require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { Server } = require("socket.io");
const nodemailer = require("nodemailer");

let reviewMetadataRows = [];
try {
  reviewMetadataRows = require("./scripts/data/review-metadata.lookup.json");
} catch {
  reviewMetadataRows = [];
}

const app = express();
const server = http.createServer(app);

// Stripe setup
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const stripe = STRIPE_SECRET_KEY ? require("stripe")(STRIPE_SECRET_KEY) : null;

// Razorpay setup
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
let razorpay = null;
try {
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    const Razorpay = require("razorpay");
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log("[PAYMENT] Razorpay SDK initialized successfully");
  } else {
    console.warn("[PAYMENT] Razorpay credentials not configured");
  }
} catch (error) {
  console.error("[PAYMENT] Failed to initialize Razorpay SDK:", error.message);
}

const PREMIUM_PLAN_USD = parseFloat(process.env.PREMIUM_PLAN_USD || "20");
const USD_TO_INR_RATE = parseFloat(process.env.USD_TO_INR_RATE || "94.87");

function getPremiumAmountInPaise() {
  const usdAmount = Number.isFinite(PREMIUM_PLAN_USD) && PREMIUM_PLAN_USD > 0 ? PREMIUM_PLAN_USD : 20;
  const usdToInrRate = Number.isFinite(USD_TO_INR_RATE) && USD_TO_INR_RATE > 0 ? USD_TO_INR_RATE : 94.87;
  return Math.round(usdAmount * usdToInrRate * 100);
}

// Mount Stripe webhook before body parser
app.post("/api/webhooks/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe) {
    return res.status(400).send("Stripe not configured");
  }

  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      try {
        const existingUser = await getUserProfileById(userId);
        const { data: updatedUser, error } = await db
          .from("users")
          .update({ plan: "premium" })
          .eq("id", userId)
          .select("*")
          .maybeSingle();
        if (error) throw error;
        if (existingUser && existingUser.plan !== "premium") {
          await handlePremiumActivationExperience(updatedUser || existingUser);
        }
        console.log(`Successfully upgraded user ${userId} to premium via webhook`);
      } catch (err) {
        console.error("Failed to update user plan:", err);
      }
    }
  }

  res.json({ received: true });
});

app.use(express.json({ limit: "1mb" }));
const PORT = Number(process.env.PORT || 3000);

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);
const APP_BASE_URL = (process.env.APP_URL || process.env.FRONTEND_URL || allowedOrigins[0] || "").replace(/\/$/, "");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS not allowed"));
    },
    credentials: true,
  },
});

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_DB_SCHEMA = process.env.SUPABASE_DB_SCHEMA || "perksnest";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  db: { schema: SUPABASE_DB_SCHEMA },
  auth: { persistSession: false, autoRefreshToken: false },
});
const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const authAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const nowIso = () => new Date().toISOString();
const parseAuthorizationToken = (req) => {
  const raw = req.headers.authorization || "";
  if (!raw.toLowerCase().startsWith("bearer ")) return null;
  return raw.slice(7).trim() || null;
};
const safeArray = (value) => (Array.isArray(value) ? value : []);
const toErrorMessage = (error) => (error && typeof error === "object" && "message" in error ? error.message : String(error || "Unknown error"));
const normalizeLookupValue = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
const buildReviewLookupKey = (dealId, author, quote) => `${normalizeLookupValue(dealId)}::${normalizeLookupValue(author)}::${normalizeLookupValue(quote)}`;
const reviewMetadataLookup = new Map(
  safeArray(reviewMetadataRows).map((review) => [
    buildReviewLookupKey(review.deal_id || review.dealId, review.user_name || review.name || review.author, review.comment || review.review_text || review.quote),
    review,
  ])
);
const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || process.env.ADMIN_EMAIL || EMAIL_USER;
const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 5;
const contactSubmissionTracker = new Map();

let contactTransporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  contactTransporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    host: process.env.EMAIL_HOST || undefined,
    port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function pruneContactRateLimit(now) {
  for (const [key, timestamps] of contactSubmissionTracker.entries()) {
    const recent = timestamps.filter((timestamp) => now - timestamp < CONTACT_RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) {
      contactSubmissionTracker.delete(key);
      continue;
    }
    contactSubmissionTracker.set(key, recent);
  }
}

function isContactRateLimited(ipAddress) {
  const now = Date.now();
  pruneContactRateLimit(now);

  const attempts = contactSubmissionTracker.get(ipAddress) || [];
  if (attempts.length >= CONTACT_RATE_LIMIT_MAX) {
    return true;
  }

  contactSubmissionTracker.set(ipAddress, [...attempts, now]);
  return false;
}

function validateContactPayload(payload = {}) {
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  const subject = String(payload.subject || "").trim();
  const message = String(payload.message || "").trim();
  const honeypot = String(payload.website || payload.companyWebsite || "").trim();

  if (honeypot) {
    return { ok: true, data: { name, email, subject, message, honeypot } };
  }

  if (!name || !email || !subject || !message) {
    return { ok: false, error: "All fields are required." };
  }

  if (!emailPattern.test(email)) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  if (name.length > 120 || subject.length > 180 || message.length > 5000) {
    return { ok: false, error: "Your message is too long. Please shorten it and try again." };
  }

  return {
    ok: true,
    data: { name, email, subject, message, honeypot: "" },
  };
}

async function sendContactSubmissionEmail({ name, email, subject, message }) {
  if (!contactTransporter || !CONTACT_EMAIL_TO) {
    throw new Error("Contact email is not configured.");
  }

  const formattedSubject = `New Contact Form Submission - ${subject}`;
  const text = `Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
      <h2 style="margin:0 0 16px;color:#5c2169;">New Contact Form Submission</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
      <p style="margin:0 0 16px;"><strong>Subject:</strong> ${subject}</p>
      <div style="padding:16px;border-radius:12px;background:#f8f5fb;border:1px solid #eadcf0;white-space:pre-wrap;">${message}</div>
    </div>
  `;

  await contactTransporter.sendMail({
    from: process.env.EMAIL_FROM || EMAIL_USER,
    to: CONTACT_EMAIL_TO,
    replyTo: email,
    subject: formattedSubject,
    text,
    html,
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEmailLayout({ eyebrow, title, intro, sections = [], ctaLabel, ctaHref, footer }) {
  const sectionMarkup = sections
    .map(
      (section) => `
        <div style="margin-top:16px;padding:18px;border:1px solid #eadcf0;border-radius:18px;background:#faf6fc;">
          <div style="font-size:13px;font-weight:700;color:#5c2169;margin-bottom:8px;">${escapeHtml(section.title)}</div>
          <div style="font-size:15px;line-height:1.7;color:#475569;">${escapeHtml(section.body)}</div>
        </div>
      `
    )
    .join("");

  const ctaMarkup =
    ctaLabel && ctaHref
      ? `
        <div style="margin-top:24px;">
          <a href="${escapeHtml(ctaHref)}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#5c2169;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;">
            ${escapeHtml(ctaLabel)}
          </a>
        </div>
      `
      : "";

  return `
    <div style="margin:0;padding:24px;background:#f6f0f8;font-family:Arial,sans-serif;color:#0f172a;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eadcf0;border-radius:28px;overflow:hidden;">
        <div style="padding:32px 28px;background:linear-gradient(180deg,#fbf6fd 0%,#ffffff 100%);">
          <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:#5c2169;color:#ffffff;font-size:12px;font-weight:700;letter-spacing:0.04em;">
            ${escapeHtml(eyebrow)}
          </div>
          <h1 style="margin:18px 0 12px;font-size:30px;line-height:1.15;color:#140b1a;">${escapeHtml(title)}</h1>
          <p style="margin:0;font-size:16px;line-height:1.7;color:#475569;">${escapeHtml(intro)}</p>
          ${sectionMarkup}
          ${ctaMarkup}
        </div>
        <div style="padding:0 28px 28px;font-size:13px;line-height:1.7;color:#64748b;">
          ${escapeHtml(footer || "You're receiving this email because of activity on your PerksNest account.")}
        </div>
      </div>
    </div>
  `;
}

async function sendTransactionalEmail({ to, subject, text, html, replyTo }) {
  if (!contactTransporter || !EMAIL_USER) {
    console.warn(`[EMAIL] Skipping email "${subject}" because SMTP is not configured.`);
    return false;
  }
  if (!to) {
    return false;
  }

  await contactTransporter.sendMail({
    from: process.env.EMAIL_FROM || EMAIL_USER,
    to,
    replyTo: replyTo || process.env.EMAIL_FROM || EMAIL_USER,
    subject,
    text,
    html,
  });

  return true;
}

function mapNotification(row) {
  return {
    id: String(row.id || ""),
    user_id: String(row.user_id || ""),
    type: String(row.type || "system"),
    title: String(row.title || "Notification"),
    message: String(row.message || ""),
    read: Boolean(row.read),
    created_at: String(row.created_at || nowIso()),
  };
}

async function listNotificationsForUser(userId, limit = 50) {
  const { data, error } = await db
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return safeArray(data).map(mapNotification);
}

async function emitNotificationsRefresh(userId) {
  if (!userId) return;

  try {
    const notifications = await listNotificationsForUser(userId, 20);
    io.to(`user:${userId}`).emit("notifications:update", {
      success: true,
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
    });
  } catch (error) {
    console.warn("[NOTIFICATIONS] Failed to emit refresh:", toErrorMessage(error));
  }
}

async function createNotification({ userId, type, title, message }) {
  const normalizedUserId = String(userId || "").trim();
  const normalizedType = String(type || "system").trim();
  const normalizedTitle = String(title || "").trim();
  const normalizedMessage = String(message || "").trim();

  if (!normalizedUserId || !normalizedTitle || !normalizedMessage) {
    return null;
  }

  const duplicateSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: existingRows, error: existingError } = await db
    .from("notifications")
    .select("*")
    .eq("user_id", normalizedUserId)
    .eq("type", normalizedType)
    .eq("title", normalizedTitle)
    .eq("message", normalizedMessage)
    .gte("created_at", duplicateSince)
    .order("created_at", { ascending: false })
    .limit(1);

  if (existingError) throw existingError;

  if (Array.isArray(existingRows) && existingRows[0]) {
    return mapNotification(existingRows[0]);
  }

  const { data, error } = await db
    .from("notifications")
    .insert({
      user_id: normalizedUserId,
      type: normalizedType,
      title: normalizedTitle,
      message: normalizedMessage,
      read: false,
      created_at: nowIso(),
    })
    .select("*")
    .single();

  if (error) throw error;

  const notification = mapNotification(data);
  await emitNotificationsRefresh(normalizedUserId);
  return notification;
}

async function markNotificationAsRead(userId, notificationId) {
  const { data, error } = await db
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const notification = mapNotification(data);
  await emitNotificationsRefresh(userId);
  return notification;
}

async function markAllNotificationsAsRead(userId) {
  const { error } = await db
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
  await emitNotificationsRefresh(userId);
}

async function getDealLabel(dealId) {
  const normalizedDealId = String(dealId || "").trim();
  if (!normalizedDealId) return "this deal";

  const lookupTables = ["deals", "partner_deals"];
  for (const table of lookupTables) {
    const { data, error } = await db.from(table).select("*").eq("id", normalizedDealId).maybeSingle();
    if (error) {
      console.warn(`[NOTIFICATIONS] Failed to look up ${table} for deal ${normalizedDealId}:`, error.message || error);
      continue;
    }
    if (data) {
      return String(data.name || data.title || data.company_name || normalizedDealId);
    }
  }

  return normalizedDealId;
}

function buildDealLink(dealId) {
  if (!APP_BASE_URL || !dealId) return APP_BASE_URL || "";
  return `${APP_BASE_URL}/deals/${encodeURIComponent(String(dealId))}`;
}

async function notifyDealClaimed(userId, dealId) {
  const dealLabel = await getDealLabel(dealId);
  return createNotification({
    userId,
    type: "deal_claimed",
    title: "Deal Claimed Successfully",
    message: `You have successfully claimed the ${dealLabel}. Open your dashboard anytime to continue with the access steps.`,
  });
}

async function notifyPremiumActivated(userId) {
  return createNotification({
    userId,
    type: "premium_activated",
    title: "Premium Activated 🎉",
    message: "You now have access to all premium deals.",
  });
}

async function sendDealClaimEmail({ user, dealId }) {
  const recipient = String(user?.email || "").trim();
  if (!recipient) return false;

  const userName = String(user?.name || recipient.split("@")[0] || "there").trim();
  const dealLabel = await getDealLabel(dealId);
  const dealLink = buildDealLink(dealId);
  const subject = "Your Deal is Ready 🎉";
  const text = `Hi ${userName},

You have successfully claimed the ${dealLabel}.

Next steps:
- Open the deal page to review the redemption instructions
- Use the same PerksNest account email when completing signup
- Reach out if you need help redeeming the offer

${dealLink || "Visit PerksNest to continue."}
`;

  const html = renderEmailLayout({
    eyebrow: "Deal Claimed",
    title: `${dealLabel} is ready for you`,
    intro: `Hi ${userName}, your claim is confirmed. We saved the ${dealLabel} offer to your account so you can come back and redeem it whenever you're ready.`,
    sections: [
      {
        title: "What to do next",
        body: "Open the deal page to review the redemption instructions and required signup steps.",
      },
      {
        title: "Helpful tip",
        body: "Use the same email address tied to your PerksNest account when redeeming the offer to keep everything matched correctly.",
      },
    ],
    ctaLabel: dealLink ? "View this deal" : "",
    ctaHref: dealLink,
    footer: "Need help with redemption? Reply to this email and the PerksNest team will guide you.",
  });

  return sendTransactionalEmail({
    to: recipient,
    subject,
    text,
    html,
  });
}

async function sendPremiumActivatedEmail(user) {
  const recipient = String(user?.email || "").trim();
  if (!recipient) return false;

  const userName = String(user?.name || recipient.split("@")[0] || "there").trim();
  const premiumLink = APP_BASE_URL ? `${APP_BASE_URL}/deals` : "";
  const subject = "Welcome to PerksNest Premium 🚀";
  const text = `Hi ${userName},

Welcome to PerksNest Premium.

You now have access to:
- premium-only deals
- deeper savings across the marketplace
- priority support when you need help

${premiumLink || "Visit PerksNest to explore your premium deals."}
`;

  const html = renderEmailLayout({
    eyebrow: "Premium Activated",
    title: "Welcome to PerksNest Premium",
    intro: `Hi ${userName}, your premium plan is now active and your account has been upgraded with access to our full premium deal catalog.`,
    sections: [
      {
        title: "Benefits unlocked",
        body: "You can now browse premium-only offers, unlock deeper partner discounts, and get faster support when something needs attention.",
      },
      {
        title: "Best next step",
        body: "Head back into the marketplace and start with the tools you plan to buy in the next 30 days so you can capture the biggest savings first.",
      },
    ],
    ctaLabel: premiumLink ? "Explore premium deals" : "",
    ctaHref: premiumLink,
    footer: "Thanks for upgrading to PerksNest Premium. We're excited to help you save more on the tools your team already needs.",
  });

  return sendTransactionalEmail({
    to: recipient,
    subject,
    text,
    html,
  });
}

async function handleDealClaimExperience(user, dealId) {
  if (!user?.id || !dealId) return;

  try {
    await notifyDealClaimed(user.id, dealId);
  } catch (error) {
    console.warn("[NOTIFICATIONS] Failed to create deal claim notification:", toErrorMessage(error));
  }

  try {
    await sendDealClaimEmail({ user, dealId });
  } catch (error) {
    console.warn("[EMAIL] Failed to send deal claim email:", toErrorMessage(error));
  }
}

async function handlePremiumActivationExperience(user) {
  if (!user?.id) return;
  let notification = null;

  try {
    notification = await notifyPremiumActivated(user.id);
  } catch (error) {
    console.warn("[NOTIFICATIONS] Failed to create premium activation notification:", toErrorMessage(error));
  }

  try {
    await sendPremiumActivatedEmail(user);
  } catch (error) {
    console.warn("[EMAIL] Failed to send premium activation email:", toErrorMessage(error));
  }

  return notification;
}

const isValidUUID = (str) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(str);
};

function formatSupabaseError(error) {
  if (!error) return "Unknown error";
  if (error.code === "PGRST106") {
    return `Supabase schema "${SUPABASE_DB_SCHEMA}" is not exposed via the Data API. Expose it in Supabase API settings or set SUPABASE_DB_SCHEMA to the schema that contains your tables.`;
  }
  if (error.code === "42501") {
    return `Permission denied for schema "${SUPABASE_DB_SCHEMA}". Grant schema and table access to service_role/authenticated roles in Supabase.`;
  }
  if (error.code === "PGRST205") {
    return `Could not find "${SUPABASE_DB_SCHEMA}.users". Verify the table exists in the configured schema.`;
  }
  return error.message || String(error);
}

const mapUser = (row) => ({
  id: row.id,
  email: row.email,
  name: row.name || (row.email || "").split("@")[0] || "User",
  emailPreferences: readEmailPreferencesFromNotes(row.notes),
  plan: row.plan || "free",
  role: row.role || "customer",
  referralCode: row.referral_code || "",
  referralCount: Number(row.referral_count || 0),
  claimedDeals: safeArray(row.claimed_deals),
  roles: Array.isArray(row.roles) ? row.roles : [row.role || "customer"],
  status: row.status || "active",
  avatar: row.avatar || null,
  createdAt: row.created_at || new Date().toISOString(),
});

function readEmailPreferencesFromNotes(notes) {
  if (!notes) return true;
  if (typeof notes === "object" && Object.prototype.hasOwnProperty.call(notes, "emailPreferences")) {
    return notes.emailPreferences !== false;
  }
  if (typeof notes !== "string") return true;
  try {
    const parsed = JSON.parse(notes);
    return parsed?.emailPreferences !== false;
  } catch {
    return true;
  }
}

function writeEmailPreferencesToNotes(notes, enabled) {
  let parsed = {};
  if (notes && typeof notes === "object") {
    parsed = { ...notes };
  } else if (typeof notes === "string" && notes.trim()) {
    try {
      parsed = JSON.parse(notes);
    } catch {
      parsed = { adminNotes: notes };
    }
  }
  return JSON.stringify({ ...parsed, emailPreferences: enabled !== false });
}

const mapAdminUserSummary = (row, claimCount = 0) => ({
  ...mapUser(row),
  created_at: row.created_at || new Date().toISOString(),
  subscriptionStatus: ["premium", "enterprise"].includes(row.plan || "free") && (row.status || "active") === "active" ? "active" : "inactive",
  totalDealsClaimed: Number(claimCount || 0),
});

const normalizeDealType = (row) => {
  const rawType = String(row?.type || row?.deal_type || row?.plan || "").trim().toLowerCase();
  if (rawType === "premium" || row?.is_free === false || row?.isFree === false) return "premium";
  return "free";
};

const mapAdminClaimedDeal = (claim, deal) => {
  const claimedAt = claim.claimed_at || claim.created_at || nowIso();
  return {
    id: String(claim.id || `${claim.user_id || "user"}-${claim.deal_id}`),
    userId: String(claim.user_id || ""),
    dealId: String(claim.deal_id || ""),
    dealName: deal?.name || deal?.title || deal?.company_name || String(claim.deal_id || "Unknown deal"),
    dealType: normalizeDealType(deal),
    dateClaimed: claimedAt,
    claimedAt,
    status: String(claim.status || "active"),
    deal,
  };
};

async function buildClaimRowsFromUserArrays(userIds) {
  const ids = [...new Set(safeArray(userIds).map((id) => String(id || "").trim()).filter(Boolean))];
  if (ids.length === 0) return [];

  const { data: users, error } = await db
    .from("users")
    .select("id,claimed_deals,created_at")
    .in("id", ids);
  if (error) throw error;

  return safeArray(users).flatMap((user) => {
    const userId = String(user.id || "");
    return [...new Set(safeArray(user.claimed_deals).map((dealId) => String(dealId || "").trim()).filter(Boolean))]
      .map((dealId) => ({
        id: `${userId}-${dealId}`,
        user_id: userId,
        deal_id: dealId,
        claimed_at: user.created_at || nowIso(),
        status: "active",
        source: "users.claimed_deals",
      }));
  });
}

async function backfillClaimedDealsFromUserArrays(userIds) {
  const ids = [...new Set(safeArray(userIds).map((id) => String(id || "").trim()).filter(Boolean))];
  if (ids.length === 0) return [];

  const legacyRows = await buildClaimRowsFromUserArrays(ids);
  const rows = legacyRows.map(({ id, source, ...row }) => row);

  if (rows.length === 0) return;

  const { error: upsertError } = await db
    .from("claimed_deals")
    .upsert(rows, { onConflict: "user_id,deal_id" });
  if (upsertError) throw upsertError;

  console.log("[ADMIN CLAIMED DEALS] Backfilled claimed_deals from users.claimed_deals:", {
    userIds: ids,
    rows: rows.length,
  });

  return legacyRows;
}

async function fetchClaimRowsForUser(userId) {
  const normalizedUserId = String(userId || "").trim();
  if (!normalizedUserId) return [];

  let legacyRows = [];
  try {
    legacyRows = await backfillClaimedDealsFromUserArrays([normalizedUserId]) || [];
  } catch (error) {
    console.warn("[ADMIN CLAIMED DEALS] Backfill failed; using users.claimed_deals fallback for this response:", formatSupabaseError(error));
    legacyRows = await buildClaimRowsFromUserArrays([normalizedUserId]);
  }

  const normalizedResult = await db
    .from("claimed_deals")
    .select("*")
    .eq("user_id", normalizedUserId)
    .order("claimed_at", { ascending: false });

  console.log("[ADMIN CLAIMED DEALS] claimed_deals DB response:", {
    userId: normalizedUserId,
    count: safeArray(normalizedResult.data).length,
    error: normalizedResult.error ? formatSupabaseError(normalizedResult.error) : null,
    rows: safeArray(normalizedResult.data),
  });

  if (normalizedResult.error) {
    console.warn("[ADMIN CLAIMED DEALS] claimed_deals read failed; using users.claimed_deals fallback for this response:", formatSupabaseError(normalizedResult.error));
    return legacyRows;
  }

  const normalizedRows = safeArray(normalizedResult.data);
  return normalizedRows.length > 0 ? normalizedRows : legacyRows;
}

async function getClaimCountsByUserId(userIds) {
  const ids = safeArray(userIds).map((id) => String(id || "")).filter(Boolean);
  const counts = new Map(ids.map((id) => [id, 0]));
  if (ids.length === 0) return counts;

  let legacyRows = [];
  try {
    legacyRows = await backfillClaimedDealsFromUserArrays(ids) || [];
  } catch (error) {
    console.warn("[ADMIN CLAIMED DEALS] Count backfill failed; using users.claimed_deals fallback for missing counts:", formatSupabaseError(error));
    legacyRows = await buildClaimRowsFromUserArrays(ids);
  }

  const normalizedResult = await db.from("claimed_deals").select("user_id").in("user_id", ids);
  if (normalizedResult.error) {
    console.warn("[ADMIN CLAIMED DEALS] Count read failed; using users.claimed_deals fallback:", formatSupabaseError(normalizedResult.error));
    legacyRows.forEach((row) => {
      const userId = String(row.user_id || "");
      counts.set(userId, (counts.get(userId) || 0) + 1);
    });
    return counts;
  }

  safeArray(normalizedResult.data).forEach((row) => {
    const userId = String(row.user_id || "");
    counts.set(userId, (counts.get(userId) || 0) + 1);
  });

  legacyRows.forEach((row) => {
    const userId = String(row.user_id || "");
    if ((counts.get(userId) || 0) === 0) {
      counts.set(userId, legacyRows.filter((claim) => String(claim.user_id || "") === userId).length);
    }
  });

  return counts;
}

async function enrichClaimedDeals(claimRows) {
  const dealIds = [...new Set(safeArray(claimRows).map((claim) => String(claim.deal_id || "")).filter(Boolean))];
  const dealsById = new Map();
  if (dealIds.length > 0) {
    const uuidDealIds = dealIds.filter((dealId) => isValidUUID(dealId));
    const [platformByIdResult, platformBySlugResult, partnerResult] = await Promise.all([
      db.from("deals").select("*").in("id", dealIds),
      db.from("deals").select("*").in("slug", dealIds),
      uuidDealIds.length > 0
        ? db.from("partner_deals").select("*").in("id", uuidDealIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (platformByIdResult.error && !["42P01", "42703", "PGRST106", "PGRST205"].includes(platformByIdResult.error.code)) {
      console.warn("[ADMIN CLAIMED DEALS] Failed to enrich deals by id:", formatSupabaseError(platformByIdResult.error));
    }
    if (platformBySlugResult.error && !["42P01", "42703", "PGRST106", "PGRST205"].includes(platformBySlugResult.error.code)) {
      console.warn("[ADMIN CLAIMED DEALS] Failed to enrich deals by slug:", formatSupabaseError(platformBySlugResult.error));
    }
    if (partnerResult.error && !["42P01", "PGRST106", "PGRST205"].includes(partnerResult.error.code)) {
      console.warn("[ADMIN CLAIMED DEALS] Failed to enrich partner deals:", formatSupabaseError(partnerResult.error));
    }

    safeArray(platformByIdResult.data).forEach((deal) => dealsById.set(String(deal.id), deal));
    safeArray(platformBySlugResult.data).forEach((deal) => {
      dealsById.set(String(deal.id), deal);
      if (deal.slug) dealsById.set(String(deal.slug), deal);
    });
    safeArray(partnerResult.data).forEach((deal) => dealsById.set(String(deal.id), deal));
  }

  return safeArray(claimRows).map((claim) => mapAdminClaimedDeal(claim, dealsById.get(String(claim.deal_id || ""))));
}

async function recordClaimedDealRow({ userId, dealId, status = "active" }) {
  const normalizedUserId = String(userId || "").trim();
  const normalizedDealId = String(dealId || "").trim();
  if (!normalizedUserId || !normalizedDealId) return;

  const { error } = await db
    .from("claimed_deals")
    .upsert(
      { user_id: normalizedUserId, deal_id: normalizedDealId, claimed_at: nowIso(), status },
      { onConflict: "user_id,deal_id" }
    );

  if (error && !["42P01", "PGRST106", "PGRST205"].includes(error.code)) {
    throw error;
  }
}

function createAppSession(session, user) {
  return {
    access_token: session?.access_token || "",
    refresh_token: session?.refresh_token || "",
    token_type: session?.token_type || "bearer",
    expires_in: session?.expires_in || 0,
    user_id: user.id,
  };
}

async function findAuthUserByEmail(email) {
  const normalizedEmail = String(email || "").toLowerCase().trim();
  if (!normalizedEmail) return null;

  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await authAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const users = data?.users || [];
    const match = users.find((user) => String(user.email || "").toLowerCase().trim() === normalizedEmail);
    if (match) return match;
    if (users.length < perPage) return null;
    page += 1;
  }
}

async function getUserProfileByEmail(email) {
  const normalizedEmail = String(email || "").toLowerCase().trim();
  if (!normalizedEmail) return null;

  const { data, error } = await db.from("users").select("*").eq("email", normalizedEmail).maybeSingle();
  if (error) throw error;
  return data || null;
}

async function getUserProfileById(userId) {
  if (!userId || !isValidUUID(userId)) {
    if (userId) console.warn(`[DB] Skipping lookup for invalid UUID: ${userId}`);
    return null;
  }
  const { data, error } = await db.from("users").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data || null;
}

async function validateDatabaseSetup() {
  try {
    const { error } = await db
      .from("users")
      .select("id,email,name,role,plan,created_at")
      .limit(1);

    if (error) {
      console.error("DATABASE VALIDATION ERROR:", error);
      console.error("DATABASE VALIDATION HELP:", formatSupabaseError(error));
      return;
    }

    console.log(`DATABASE VALIDATION OK: ${SUPABASE_DB_SCHEMA}.users is reachable`);
  } catch (error) {
    console.error("DATABASE VALIDATION ERROR:", error);
  }
}

async function syncUserProfileFromAuthUser(authUser, options = {}) {
  const normalizedEmail = String(authUser?.email || "").toLowerCase().trim();
  if (!authUser?.id || !normalizedEmail) {
    throw new Error("Supabase Auth user is missing id or email");
  }

  const displayName =
    options.name ||
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    normalizedEmail.split("@")[0];
  const avatar = options.avatar ?? authUser.user_metadata?.avatar_url ?? null;
  const existingById = await getUserProfileById(authUser.id);

  console.log("LOGIN DB QUERY BY ID:", {
    authUserId: authUser.id,
    found: Boolean(existingById),
  });

  if (existingById) {
    const updatePayload = {};
    if (!existingById.email || existingById.email !== normalizedEmail) updatePayload.email = normalizedEmail;
    if (!existingById.name && displayName) updatePayload.name = String(displayName).trim();
    if (avatar && existingById.avatar !== avatar) updatePayload.avatar = avatar;

    if (Object.keys(updatePayload).length > 0) {
      console.log("LOGIN DB UPDATE:", { userId: authUser.id, fields: Object.keys(updatePayload) });
      const { data, error } = await db.from("users").update(updatePayload).eq("id", authUser.id).select("*").single();
      if (error) throw error;
      return data;
    }

    return existingById;
  }

  const existingByEmail = await getUserProfileByEmail(normalizedEmail);
  console.log("LOGIN DB QUERY BY EMAIL:", {
    email: normalizedEmail,
    found: Boolean(existingByEmail),
    existingId: existingByEmail?.id || null,
  });

  if (existingByEmail) {
    console.log("LOGIN DB SYNC EXISTING EMAIL ROW:", {
      oldUserId: existingByEmail.id,
      authUserId: authUser.id,
    });

    const { data, error } = await db
      .from("users")
      .update({
        id: authUser.id,
        email: normalizedEmail,
        name: existingByEmail.name || String(displayName).trim(),
        ...(avatar ? { avatar } : {}),
      })
      .eq("id", existingByEmail.id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  }

  console.log("LOGIN DB INSERT:", { authUserId: authUser.id, email: normalizedEmail });
  return ensureUserProfile({
    email: normalizedEmail,
    name: String(displayName).trim(),
    avatar,
    referrerCode: options.referrerCode,
    authUserId: authUser.id,
    emailVerified: true,
  });
}

async function ensureUserProfile({
  email,
  name,
  avatar = null,
  referrerCode,
  authUserId,
  role = "customer",
  roles = [role],
  emailVerified = true,
}) {
  const normalizedEmail = String(email || "").toLowerCase().trim();
  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  const existing = await getUserProfileByEmail(normalizedEmail);
  if (existing) {
    const updatePayload = {};
    if (avatar && existing.avatar !== avatar) updatePayload.avatar = avatar;
    if (emailVerified && !existing.email_verified) updatePayload.email_verified = true;
    if (!existing.name && name) updatePayload.name = String(name).trim();

    if (Object.keys(updatePayload).length > 0) {
      const { data, error } = await db.from("users").update(updatePayload).eq("id", existing.id).select("*").single();
      if (error) throw error;
      return data;
    }

    return existing;
  }

  const referralCode = await generateUniqueReferralCode(name || normalizedEmail.split("@")[0]);
  const insertPayload = {
    ...(authUserId ? { id: authUserId } : {}),
    email: normalizedEmail,
    name: String(name || normalizedEmail.split("@")[0]).trim(),
    avatar,
    password: null,
    plan: "free",
    role,
    roles,
    status: "active",
    email_verified: emailVerified,
    referral_code: referralCode,
    referral_count: 0,
    claimed_deals: [],
  };

  const { data, error } = await db.from("users").insert(insertPayload).select("*").single();
  if (error || !data) throw error || new Error("Failed to create user profile");

  if (referrerCode) {
    await registerReferralSignup(referrerCode, { id: data.id, email: data.email, name: data.name });
  }

  return data;
}

async function getAuthenticatedRequestContext(req) {
  const token = parseAuthorizationToken(req);
  const explicitUserId = req.headers["x-user-id"] || (req.body || {}).userId || req.query.userId || null;

  if (token) {
    try {
      const profileContext = await getAuthenticatedProfileFromToken(token);
      const profile = profileContext.user;
      return {
        accessToken: token,
        authUser: profileContext.authUser,
        userId: profile.id,
        user: profile,
      };
    } catch (error) {
      console.warn("[AUTH] Token verification failed:", error.message || error);
      // We return null so the route can decide whether to fail with 401
      return null;
    }
  }

  if (explicitUserId) {
    try {
      if (!isValidUUID(explicitUserId)) {
        console.warn(`[AUTH] Ignoring non-UUID explicit user ID: ${explicitUserId}`);
        return null;
      }
      const user = await getUserProfileById(explicitUserId);
      return user ? { accessToken: null, authUser: null, userId: user.id, user } : null;
    } catch (error) {
      console.warn("[AUTH] Explicit user look-up failed:", error.message || error);
      return null;
    }
  }

  return null;
}

async function buildAuthResponse({ userRow, session }) {
  const mappedUser = mapUser(userRow);
  return {
    success: true,
    user: mappedUser,
    session: createAppSession(session, mappedUser),
  };
}

async function getRequestUserId(req) {
  const context = await getAuthenticatedRequestContext(req);
  return context?.userId || null;
}

async function getAuthenticatedProfileFromToken(token) {
  const { data, error } = await authAdmin.auth.getUser(token);
  if (error || !data?.user) {
    throw error || new Error("Invalid Supabase access token");
  }

  const user = await syncUserProfileFromAuthUser(data.user);
  return { authUser: data.user, user };
}

async function generateUniqueReferralCode(name) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const createCode = (length = 8) =>
    Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");

  for (let i = 0; i < 10; i += 1) {
    const candidate = createCode(i < 5 ? 6 : 8);
    const { data } = await db.from("users").select("id").eq("referral_code", candidate).maybeSingle();
    if (!data) return candidate;
  }
  return createCode(8);
}

async function registerReferralSignup(referralCode, referredUser) {
  const normalizedCode = String(referralCode || "").trim().toUpperCase();
  if (!normalizedCode) return;

  const { data: referrer } = await db
    .from("users")
    .select("id,name,email,referral_code")
    .eq("referral_code", normalizedCode)
    .maybeSingle();

  if (!referrer) return;
  if (referrer.id === referredUser.id) return;
  if (String(referrer.email || "").toLowerCase() === String(referredUser.email || "").toLowerCase()) return;

  await db.from("referrals").upsert(
    {
      code: normalizedCode,
      referrer_id: referrer.id,
      referrer_name: referrer.name || "User",
      referree_email: String(referredUser.email || "").toLowerCase().trim(),
      referree_id: referredUser.id,
      status: "pending",
      credit_amount: 20,
    },
    { onConflict: "referree_email" }
  );

  await db.from("users").update({ referred_by: referrer.id }).eq("id", referredUser.id);
}

async function createReferralInvite(referrer, referreeEmail) {
  const normalizedEmail = String(referreeEmail || "").toLowerCase().trim();
  if (!normalizedEmail) {
    throw new Error("A valid invite email is required");
  }

  if (String(referrer.email || "").toLowerCase() === normalizedEmail) {
    throw new Error("You cannot refer yourself");
  }

  const normalizedCode = String(referrer.referral_code || "").trim().toUpperCase();
  if (!normalizedCode) {
    throw new Error("Referrer does not have a referral code");
  }

  const { data: existingUser } = await db
    .from("users")
    .select("id,email")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingUser?.id === referrer.id) {
    throw new Error("You cannot refer yourself");
  }

  const { data: existingReferral } = await db
    .from("referrals")
    .select("id,referrer_id,status")
    .eq("referree_email", normalizedEmail)
    .maybeSingle();

  if (existingReferral && existingReferral.referrer_id !== referrer.id) {
    throw new Error("This email has already been referred by another user");
  }

  const referralPayload = {
    code: normalizedCode,
    referrer_id: referrer.id,
    referrer_name: referrer.name || "User",
    referree_email: normalizedEmail,
    referree_id: existingUser?.id || null,
    status: existingReferral?.status === "converted" || existingReferral?.status === "paid" ? existingReferral.status : "pending",
    credit_amount: 20,
  };

  const { data, error } = await db
    .from("referrals")
    .upsert(referralPayload, { onConflict: "referree_email" })
    .select("*")
    .single();

  if (error) throw error;

  if (existingUser?.id) {
    await db.from("users").update({ referred_by: referrer.id }).eq("id", existingUser.id);
  }

  return data;
}

async function convertReferralForUser(referredUser) {
  const email = String(referredUser.email || "").toLowerCase().trim();
  const { data } = await db
    .from("referrals")
    .select("*")
    .or(`referree_id.eq.${referredUser.id},referree_email.eq.${email}`)
    .in("status", ["pending"])
    .maybeSingle();

  if (!data) return false;
  if (data.referrer_id === referredUser.id) return false;

  await db
    .from("referrals")
    .update({ status: "converted", referree_id: referredUser.id, converted_at: new Date().toISOString() })
    .eq("id", data.id);

  const { count } = await db
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("referrer_id", data.referrer_id)
    .in("status", ["converted", "paid"]);

  await db.from("users").update({ referral_count: count || 0 }).eq("id", data.referrer_id);
  return true;
}

async function getReferralSummaryByUserId(userId) {
  const { data, error } = await db.from("referrals").select("*").eq("referrer_id", userId);
  if (error) throw error;

  const referrals = data || [];
  const converted = referrals.filter((ref) => ref.status === "converted" || ref.status === "paid");
  const pending = referrals.filter((ref) => ref.status === "pending");
  const earnings = converted.reduce((sum, ref) => sum + Number(ref.credit_amount || 20), 0);

  // Fetch click count for this user's referral code
  let totalClicks = 0;
  const { data: userRow } = await db.from("users").select("referral_code").eq("id", userId).maybeSingle();
  if (userRow?.referral_code) {
    const { count } = await db
      .from("referral_clicks")
      .select("*", { count: "exact", head: true })
      .eq("referral_code", String(userRow.referral_code).toUpperCase());
    totalClicks = count || 0;
  }

  return {
    total_referrals: referrals.length,
    converted_referrals: converted.length,
    pending_referrals: pending.length,
    referral_earnings: earnings,
    total_clicks: totalClicks,
    referrals,
  };
}

const mapTicket = (row) => ({
  id: row.id,
  user_id: row.user_id,
  user_name: row.user_name || "User",
  user_email: row.user_email || "",
  deal_id: row.deal_id || null,
  subject: row.subject,
  status: row.status || "open",
  priority: row.priority || "medium",
  type: row.type || "general",
  description: row.description || "",
  created_at: row.created_at,
  updated_at: row.updated_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  message: row.description || "",
});

let ticketsWritableColumnsCache = null;

async function getTicketsWritableColumns() {
  if (ticketsWritableColumnsCache) return ticketsWritableColumnsCache;

  const columns = new Set([
    "user_id",
    "user_name",
    "user_email",
    "user_role",
    "subject",
    "description",
    "type",
    "priority",
    "status",
  ]);

  const { error } = await db.from("tickets").select("deal_id").limit(1);
  if (!error) columns.add("deal_id");

  ticketsWritableColumnsCache = columns;
  return ticketsWritableColumnsCache;
}

async function filterTicketPayloadForDb(payload) {
  const writable = await getTicketsWritableColumns();
  return Object.fromEntries(Object.entries(payload).filter(([key]) => writable.has(key)));
}

const mapTicketMessage = (row) => ({
  id: row.id,
  ticket_id: row.ticket_id,
  user_id: row.sender_id || row.user_id,
  sender_id: row.sender_id || row.user_id,
  user_name: row.sender_name || row.user_name || "User",
  sender_name: row.sender_name || row.user_name || "User",
  message: row.message,
  sender_type: row.sender_type || (row.is_admin ? "admin" : "user"),
  is_admin: row.sender_type ? row.sender_type === "admin" : Boolean(row.is_admin),
  created_at: row.created_at,
});

async function insertTicketMessageRecord({
  ticketId,
  senderId,
  senderName,
  senderType,
  message,
}) {
  const normalizedMessage = String(message || "").trim();
  if (!ticketId || !isValidUUID(ticketId)) {
    throw new Error("Valid ticketId is required");
  }
  if (!senderId || !isValidUUID(senderId)) {
    throw new Error("Valid senderId is required");
  }
  if (!normalizedMessage) {
    throw new Error("Message is required");
  }

  const nextSenderType = senderType === "admin" ? "admin" : "user";
  const modernPayload = {
    ticket_id: ticketId,
    sender_id: senderId,
    sender_type: nextSenderType,
    message: normalizedMessage,
  };

  const modernResult = await db.from("ticket_messages").insert(modernPayload).select("*").single();
  if (!modernResult.error && modernResult.data) {
    return modernResult.data;
  }

  const fallbackPayload = {
    ticket_id: ticketId,
    user_id: senderId,
    user_name: senderName || (nextSenderType === "admin" ? "Support Team" : "User"),
    message: normalizedMessage,
    is_admin: nextSenderType === "admin",
  };

  const fallbackResult = await db.from("ticket_messages").insert(fallbackPayload).select("*").single();
  if (fallbackResult.error) {
    throw fallbackResult.error;
  }

  return fallbackResult.data;
}

const mapMessage = (row) => ({
  id: row.id,
  thread_id: row.thread_id,
  sender_id: row.sender_id,
  sender_name: row.sender_name || "User",
  sender_role: row.sender_role || "customer",
  content: row.content || "",
  read: Boolean(row.read),
  created_at: row.created_at,
});

const parseMoneyValue = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const normalized = value.replace(/[^0-9.-]+/g, "");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatPartnerDeal = (row) => ({
  id: row.id,
  partnerId: row.partner_id,
  partnerName: row.partner_name || "Partner",
  name: row.name || "Untitled deal",
  description: row.description || "",
  dealText: row.deal_text || "",
  savings: row.savings || "0",
  category: row.category || "other",
  websiteUrl: row.website_url || "",
  logoUrl: row.logo_url || "",
  promoCode: row.promo_code || "",
  status: row.status || "pending",
  rejectionReason: row.rejection_reason || null,
  createdAt: row.created_at || nowIso(),
  approvedAt: row.approved_at || null,
  views: Number(row.views || 0),
  claims: Number(row.claims || 0),
});

async function requireAdminContext(req, res) {
  const context = await getAuthenticatedRequestContext(req);
  if (!context?.userId || !isAdminUser(context.user)) {
    res.status(403).json({ success: false, error: "Forbidden - Admin only" });
    return null;
  }
  return context;
}

async function buildAdminStats() {
  const [
    usersResult,
    dealsResult,
    partnerDealsResult,
    claimEventsResult,
    whiteLabelResult,
    ticketsResult,
    messagesResult,
    reviewsResult,
  ] = await Promise.all([
    db.from("users").select("id,plan,role,roles,status,created_at,claimed_deals"),
    db.from("deals").select("id,name,category,savings,created_at"),
    db.from("partner_deals").select("*"),
    db.from("claim_events").select("id,deal_id,claimed_at"),
    db.from("wl_clients").select("mrr,status,members").order("created_at", { ascending: false }),
    db.from("tickets").select("id,status,priority,created_at,updated_at"),
    db.from("messages").select("id,thread_id,created_at,read,sender_role"),
    db.from("reviews").select("rating"),
  ]);

  const users = safeArray(usersResult.data);
  const platformDeals = safeArray(dealsResult.data);
  const partnerDeals = safeArray(partnerDealsResult.data);
  const claimEvents = safeArray(claimEventsResult.data);
  const whiteLabelClients = safeArray(whiteLabelResult.data);
  const tickets = safeArray(ticketsResult.data);
  const messages = safeArray(messagesResult.data);
  const reviews = safeArray(reviewsResult.data);

  const approvedPartnerDeals = partnerDeals.filter((deal) => deal.status === "approved");
  const pendingPartnerDeals = partnerDeals.filter((deal) => deal.status === "pending");
  const allVisibleDeals = [
    ...platformDeals.map((deal) => ({
      id: deal.id,
      savings: deal.savings,
      category: deal.category || "other",
      createdAt: deal.created_at,
    })),
    ...approvedPartnerDeals.map((deal) => ({
      id: deal.id,
      savings: deal.savings,
      category: deal.category || "other",
      createdAt: deal.created_at,
    })),
  ];

  const savingsByDealId = new Map(allVisibleDeals.map((deal) => [String(deal.id), parseMoneyValue(deal.savings)]));
  const totalSavings = claimEvents.reduce((sum, claim) => sum + (savingsByDealId.get(String(claim.deal_id)) || 0), 0);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => (user.status || "active") === "active").length;
  const premiumUsers = users.filter((user) => ["premium", "enterprise"].includes(user.plan || "free")).length;
  const enterpriseUsers = users.filter((user) => user.plan === "enterprise").length;
  const freeUsers = users.filter((user) => (user.plan || "free") === "free").length;
  const suspendedUsers = users.filter((user) => user.status === "suspended").length;
  const recentUsers = users.filter((user) => {
    if (!user.created_at) return false;
    return Date.now() - new Date(user.created_at).getTime() <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  const reviewRatings = reviews.map((review) => Number(review.rating)).filter((rating) => Number.isFinite(rating) && rating > 0);
  const avgRating = reviewRatings.length > 0 ? reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length : null;
  const nps = avgRating ? Math.round(((avgRating - 3) / 2) * 100) : null;

  const messageThreads = new Map();
  messages.forEach((message) => {
    if (!message.thread_id) return;
    const existing = messageThreads.get(message.thread_id);
    if (!existing || new Date(message.created_at).getTime() > new Date(existing.created_at).getTime()) {
      messageThreads.set(message.thread_id, message);
    }
  });

  const sessionMinutes = messageThreads.size > 0
    ? Math.max(
        1,
        Math.round(
          messages.reduce((sum, message) => {
            const ageMinutes = Math.max(1, (Date.now() - new Date(message.created_at).getTime()) / 60000);
            return sum + Math.min(ageMinutes, 45);
          }, 0) / Math.max(messages.length, 1)
        )
      )
    : null;

  const categories = Array.from(
    allVisibleDeals.reduce((map, deal) => {
      const category = String(deal.category || "other");
      map.set(category, (map.get(category) || 0) + 1);
      return map;
    }, new Map()).entries()
  ).map(([name, count]) => ({ name, count }));

  const monthlyRevenue = whiteLabelClients
    .filter((client) => (client.status || "").toLowerCase() === "active")
    .reduce((sum, client) => sum + Number(client.mrr || 0), 0);

  return {
    totalUsers,
    activeUsers,
    premiumUsers,
    enterpriseUsers,
    freeUsers,
    totalDeals: platformDeals.length + approvedPartnerDeals.length,
    activeDeals: platformDeals.length + approvedPartnerDeals.length,
    pendingApproval: pendingPartnerDeals.length,
    totalMembers: totalUsers,
    totalSavings,
    totalRevenue: monthlyRevenue,
    mrr: monthlyRevenue,
    arr: monthlyRevenue * 12,
    partners: users.filter((user) => user.role === "partner" || safeArray(user.roles).includes("partner")).length,
    conversionRate: totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0,
    churnRate: totalUsers > 0 ? (suspendedUsers / totalUsers) * 100 : 0,
    nps,
    avgSessionDurationMinutes: sessionMinutes,
    categories,
    tickets: {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "open").length,
      pending: tickets.filter((ticket) => ticket.status === "pending").length,
      closed: tickets.filter((ticket) => ticket.status === "closed").length,
      highPriority: tickets.filter((ticket) => ticket.priority === "high").length,
    },
    messages: {
      threads: messageThreads.size,
      unread: messages.filter((message) => !message.read).length,
    },
    whiteLabel: {
      totalClients: whiteLabelClients.length,
      activeClients: whiteLabelClients.filter((client) => (client.status || "").toLowerCase() === "active").length,
      members: whiteLabelClients.reduce((sum, client) => sum + Number(client.members || 0), 0),
    },
    trends: {
      newUsersLast30Days: recentUsers,
      claimsLast30Days: claimEvents.filter((claim) => {
        if (!claim.claimed_at) return false;
        return Date.now() - new Date(claim.claimed_at).getTime() <= 30 * 24 * 60 * 60 * 1000;
      }).length,
    },
  };
}

async function getTicketWithMessages(ticketId) {
  if (!ticketId || !isValidUUID(ticketId)) {
    console.warn(`[DB] Invalid ticket UUID provided for lookup: ${ticketId}`);
    return null;
  }
  const { data: ticket, error: ticketError } = await db
    .from("tickets")
    .select("*")
    .eq("id", ticketId)
    .maybeSingle();
  if (ticketError) throw ticketError;
  if (!ticket) return null;

  const { data: messages, error: messagesError } = await db
    .from("ticket_messages")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  if (messagesError) throw messagesError;

  return {
    ...mapTicket(ticket),
    messages: (messages || []).map(mapTicketMessage),
  };
}

function isAdminUser(user) {
  return user?.role === "admin" || safeArray(user?.roles).includes("admin");
}

function canAccessTicket(ticket, user) {
  if (!ticket || !user) return false;
  if (isAdminUser(user)) return true;
  return ticket.user_id === user.id;
}

app.get("/health", (_, res) => res.json({ ok: true, service: "perksnest-backend" }));
app.get("/api/health", (_, res) => res.json({ ok: true, service: "perksnest-backend" }));

app.post("/api/checkout", async (req, res) => {
  try {
    const { userId, email, name, period } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    if (!stripe) {
      // Mock flow if no Stripe key is set
      const mockSuccessUrl = `${process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',')[0] : 'http://localhost:8080'}/api/checkout/mock-success?session_id=mock_${userId}`;
      return res.json({ url: mockSuccessUrl });
    }

    const FRONTEND_URL = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',')[0] : 'http://localhost:8080';
    
    // Create actual Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'PerksNest Premium',
              description: 'Access to all premium deals',
            },
            unit_amount: period === 'annual' ? 20000 : 2000, // $200.00 annual or $20.00 monthly
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/customer?success=true`,
      cancel_url: `${FRONTEND_URL}/pricing?canceled=true`,
      client_reference_id: userId,
      customer_email: email || undefined,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ success: false, error: "Failed to create checkout session" });
  }
});

app.get("/api/checkout/mock-success", async (req, res) => {
  try {
    const { session_id } = req.query;
    if (session_id && session_id.startsWith("mock_")) {
      const userId = session_id.replace("mock_", "");
      const { error } = await db.from("users").update({ plan: "premium" }).eq("id", userId);
      if (error) console.error("Mock upgrade failed:", error);
    }
    const FRONTEND_URL = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',')[0] : 'http://localhost:8080';
    res.redirect(`${FRONTEND_URL}/customer?success=true`);
  } catch (error) {
    res.status(500).send("Error completing mock checkout");
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email and password are required" });
    return;
  }
  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const signInResult = await authClient.auth.signInWithPassword({
      email: normalizedEmail,
      password: String(password),
    });

    console.log("SUPABASE LOGIN RESPONSE:", {
      email: normalizedEmail,
      hasUser: Boolean(signInResult.data?.user),
      authUserId: signInResult.data?.user?.id || null,
      hasSession: Boolean(signInResult.data?.session?.access_token),
      error: signInResult.error ? signInResult.error.message : null,
    });

    if (signInResult.error || !signInResult.data?.user) {
      res.status(401).json({
        success: false,
        error: signInResult.error?.message || "Invalid email or password",
      });
      return;
    }

    const profile = await syncUserProfileFromAuthUser(signInResult.data.user);
    const response = await buildAuthResponse({ userRow: profile, session: signInResult.data.session });
    console.log("LOGIN SUCCESS:", {
      authUserId: signInResult.data.user.id,
      profileUserId: profile.id,
      email: profile.email,
    });
    res.json(response);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      error: formatSupabaseError(err),
    });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name, referrerCode } = req.body || {};
  if (!email || !password || !name) {
    res.status(400).json({ success: false, error: "Name, email, and password are required" });
    return;
  }
  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const [existingProfile, existingAuthUser] = await Promise.all([
      getUserProfileByEmail(normalizedEmail),
      findAuthUserByEmail(normalizedEmail),
    ]);
    if (existingProfile || existingAuthUser) {
      res.status(409).json({ success: false, error: "Email already exists" });
      return;
    }

    const { data: authData, error: authError } = await authAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: String(password),
      email_confirm: true,
      user_metadata: { name: String(name).trim() },
    });
    if (authError || !authData?.user) {
      throw authError || new Error("Failed to create Supabase Auth user");
    }

    let profile;
    try {
      profile = await ensureUserProfile({
        email: normalizedEmail,
        name: String(name).trim(),
        referrerCode,
        authUserId: authData.user.id,
        emailVerified: true,
      });
    } catch (profileError) {
      await authAdmin.auth.admin.deleteUser(authData.user.id).catch(() => {});
      throw profileError;
    }

    const signInResult = await authClient.auth.signInWithPassword({
      email: normalizedEmail,
      password: String(password),
    });
    if (signInResult.error || !signInResult.data?.session) {
      throw signInResult.error || new Error("Failed to create login session after registration");
    }

    res.status(201).json(await buildAuthResponse({ userRow: profile, session: signInResult.data.session }));
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.get("/api/auth/me", async (req, res) => {
  if (!parseAuthorizationToken(req) && !req.headers["x-user-id"] && !req.query.userId && !(req.body || {}).userId) {
    res.status(401).json({ success: false, error: "Authentication required" });
    return;
  }
  try {
    const context = await getAuthenticatedRequestContext(req);
    const data = context?.user || null;

    if (!data) {
      return res.status(401).json({ success: false, error: "Authentication failed or session expired" });
    }

    res.json(await buildAuthResponse({ userRow: data, session: { access_token: parseAuthorizationToken(req) || "", user_id: data.id } }));
  } catch (error) {
    console.error("AUTH ME ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.post("/api/auth/logout", async (req, res) => {
  try {
    const token = parseAuthorizationToken(req);
    if (token) {
      await authAdmin.auth.getUser(token);
    }
    res.json({ success: true });
  } catch (error) {
    console.error("AUTH LOGOUT ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.patch("/api/auth/plan", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    const { plan } = req.body || {};
    if (!userId || !plan) {
      res.status(400).json({ success: false, error: "Missing userId or plan" });
      return;
    }
    const { data: existingUser, error: existingUserError } = await db.from("users").select("*").eq("id", userId).maybeSingle();
    if (existingUserError) throw existingUserError;

    const { data, error } = await db.from("users").update({ plan }).eq("id", userId).select("*").single();
    if (error) throw error;
    if (plan !== "free") {
      await convertReferralForUser({ id: userId, email: data.email });
    }
    if (plan === "premium" && existingUser?.plan !== "premium") {
      await handlePremiumActivationExperience(data);
    }
    res.json({ success: true, user: mapUser(data) });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/auth/claim-deal", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    const { dealId } = req.body || {};
    console.log(`[AUTH-CLAIM] User ${userId} claiming deal ${dealId}`);
    if (!userId || !dealId) {
      res.status(400).json({ success: false, error: "Missing userId or dealId" });
      return;
    }
    const { data: user, error: userError } = await db.from("users").select("*").eq("id", userId).single();
    if (userError) throw userError;

    const claimedDeals = safeArray(user.claimed_deals);
    console.log(`[AUTH-CLAIM] Current claimed deals: ${JSON.stringify(claimedDeals)}`);
    const alreadyClaimed = claimedDeals.includes(dealId);
    const updated = alreadyClaimed ? claimedDeals : [...claimedDeals, dealId];

    const { data: updatedUser, error: updateError } = await db
      .from("users")
      .update({ claimed_deals: updated })
      .eq("id", userId)
      .select("*")
      .single();
    if (updateError) throw updateError;

    await db.from("claim_events").upsert({ user_id: userId, deal_id: dealId, claimed_at: new Date().toISOString() }, { onConflict: "user_id,deal_id" });
    await recordClaimedDealRow({ userId, dealId });
    if (!alreadyClaimed) {
      await handleDealClaimExperience(updatedUser, dealId);
    }
    console.log(`[AUTH-CLAIM] Claim stored successfully for ${dealId}`);
    res.json({ success: true, user: mapUser(updatedUser), claimedDeals: updated });
  } catch (error) {
    console.error("[AUTH-CLAIM] ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/auth/send-verification", async (req, res) => {
  const { email, name } = req.body || {};
  if (!email) {
    res.status(400).json({ success: false, error: "Email is required" });
    return;
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  try {
    await db
      .from("users")
      .update({ verification_code: code, verification_expires: expires })
      .eq("email", String(email).toLowerCase().trim());
    await fetch(`${process.env.NOTIFY_URL || `http://localhost:${PORT}`}/api/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, code }),
    }).catch(() => {});
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send verification", details: error.message });
  }
});

app.post("/api/auth/verify-email", async (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) {
    res.status(400).json({ success: false, verified: false, error: "Email and code are required" });
    return;
  }
  try {
    const { data, error } = await db
      .from("users")
      .select("verification_code,verification_expires")
      .eq("email", String(email).toLowerCase().trim())
      .maybeSingle();
    if (error) throw error;
    if (!data || data.verification_code !== code || new Date(data.verification_expires) < new Date()) {
      res.json({ success: true, verified: false });
      return;
    }
    await db
      .from("users")
      .update({ email_verified: true, verification_code: null, verification_expires: null })
      .eq("email", String(email).toLowerCase().trim());
    res.json({ success: true, verified: true });
  } catch (error) {
    res.status(500).json({ success: false, verified: false, error: "Failed to verify email", details: error.message });
  }
});

app.post("/api/auth/oauth-sync", async (req, res) => {
  const { email, name, avatar, referralCode, authUserId } = req.body || {};
  if (!email) {
    res.status(400).json({ success: false, error: "Email is required" });
    return;
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const user = await ensureUserProfile({
      email: normalizedEmail,
      name: String(name || normalizedEmail.split("@")[0]),
      avatar: avatar || null,
      referrerCode: referralCode,
      authUserId: authUserId || undefined,
      emailVerified: true,
    });

    const statusCode = String(user.created_at || "") === String(user.updated_at || "") ? 201 : 200;
    res.status(statusCode).json(
      await buildAuthResponse({
        userRow: user,
        session: { access_token: "", user_id: user.id },
      })
    );
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed OAuth sync", details: error.message });
  }
});

app.get("/api/notifications", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const notifications = await listNotificationsForUser(userId);
    res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter((notification) => !notification.read).length,
    });
  } catch (error) {
    console.error("[NOTIFICATIONS] GET ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.patch("/api/notifications/read-all", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    await markAllNotificationsAsRead(userId);
    res.json({ success: true });
  } catch (error) {
    console.error("[NOTIFICATIONS] READ ALL ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.patch("/api/notifications/:id/read", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    const notificationId = String(req.params.id || "").trim();
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }
    if (!notificationId) {
      return res.status(400).json({ success: false, error: "Notification ID is required" });
    }

    const notification = await markNotificationAsRead(userId, notificationId);
    if (!notification) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    res.json({ success: true, notification });
  } catch (error) {
    console.error("[NOTIFICATIONS] MARK READ ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.get("/api/deals", async (_, res) => {
  try {
    const { data, error } = await db
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ deals: safeArray(data).map(enrichDealResponse) });
  } catch {
    const { data } = await db.from("partner_deals").select("*").eq("status", "approved");
    res.json({ deals: safeArray(data).map(enrichDealResponse) });
  }
});

function normalizeResponseFeatures(row) {
  const source = Array.isArray(row?.features) && row.features.length > 0
    ? row.features
    : [
        row?.deal_text || row?.discounted_value || "Exclusive startup offer",
        "Startup-friendly onboarding",
        "Founder-focused savings",
        "Partner activation support",
      ];

  return source
    .map((feature, index) => {
      if (typeof feature === "string") {
        return {
          id: `feature-${index + 1}`,
          icon: index % 3 === 0 ? "Zap" : index % 3 === 1 ? "ShieldCheck" : "Sparkles",
          title: feature,
          description: `${row?.name || "This deal"} includes ${feature.toLowerCase()} for startup teams.`,
        };
      }

      if (feature && typeof feature === "object") {
        const title = String(feature.title || feature.name || feature.description || `Feature ${index + 1}`);
        return {
          id: String(feature.id || `feature-${index + 1}`),
          icon: String(feature.icon || "Sparkles"),
          title,
          description: String(feature.description || `${row?.name || "This deal"} includes ${title.toLowerCase()}.`),
        };
      }

      return null;
    })
    .filter(Boolean)
    .slice(0, 8);
}

const responsePricingByDeal = {
  cloudflare: [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Basic CDN, DNS, SSL, and DDoS protection for personal sites.", features: ["Free SSL", "Global CDN", "Basic DDoS protection"] },
    { name: "Pro", price: "$20", billingPeriod: "month", description: "Performance and security features for professional websites.", features: ["WAF rules", "Image optimization", "More page rules"] },
    { name: "Business", price: "$200", billingPeriod: "month", description: "Advanced security, performance, and support for production businesses.", features: ["Advanced DDoS protection", "Prioritized support", "PCI compliance features"] },
  ],
  digitalocean: [
    { name: "Basic Droplets", price: "From $4", billingPeriod: "month", description: "Simple virtual machines for apps, APIs, and staging environments.", features: ["SSD storage", "Bandwidth included", "Predictable monthly pricing"] },
    { name: "App Platform", price: "From $5", billingPeriod: "month", description: "Managed app hosting with builds, deploys, and scaling.", features: ["Managed deployments", "HTTPS included", "Horizontal scaling"] },
    { name: "Managed Databases", price: "From $15", billingPeriod: "month", description: "Managed database options for production applications.", features: ["Automated backups", "High availability options", "Monitoring"] },
  ],
  vercel: [
    { name: "Hobby", price: "$0", billingPeriod: "month", description: "Free personal projects and prototypes.", features: ["Preview deployments", "Global CDN", "Serverless functions"] },
    { name: "Pro", price: "$20", billingPeriod: "user/month", description: "Team projects with higher limits and collaboration.", features: ["Team seats", "More bandwidth", "Advanced analytics"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Advanced security, governance, and scale for larger teams.", features: ["SAML/SSO", "Enterprise support", "Custom limits"] },
  ],
  render: [
    { name: "Static Sites", price: "$0", billingPeriod: "month", description: "Free static site hosting with automatic deploys.", features: ["Global CDN", "HTTPS", "Git deploys"] },
    { name: "Web Services", price: "From $7", billingPeriod: "month", description: "Managed web services for production apps.", features: ["Autoscaling options", "Private services", "Zero-downtime deploys"] },
    { name: "Databases", price: "From $7", billingPeriod: "month", description: "Managed PostgreSQL instances for application data.", features: ["Backups", "Monitoring", "Persistent disks"] },
  ],
  openai: [
    { name: "API", price: "Usage-based", billingPeriod: "tokens", description: "Pay per model input, output, and tool usage.", features: ["Text and vision models", "Embeddings", "Realtime and batch options"] },
    { name: "ChatGPT Plus", price: "$20", billingPeriod: "month", description: "Individual ChatGPT plan with higher limits.", features: ["Advanced models", "File analysis", "Image generation"] },
    { name: "ChatGPT Team", price: "From $25", billingPeriod: "user/month", description: "Workspace plan for teams billed annually.", features: ["Shared workspace", "Admin controls", "Higher message limits"] },
  ],
  anthropic: [
    { name: "Claude API", price: "Usage-based", billingPeriod: "tokens", description: "Model API pricing based on input and output tokens.", features: ["Claude models", "Prompt caching", "Batch processing"] },
    { name: "Claude Pro", price: "$20", billingPeriod: "month", description: "Individual Claude subscription with higher usage.", features: ["More usage", "Priority access", "Projects"] },
    { name: "Claude Team", price: "$30", billingPeriod: "user/month", description: "Team workspace with admin and collaboration controls.", features: ["Team management", "Shared projects", "Central billing"] },
  ],
  notion: [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Personal workspace and basic collaboration.", features: ["Pages and blocks", "Basic integrations", "Templates"] },
    { name: "Plus", price: "$10", billingPeriod: "user/month", description: "Small-team workspace with more file uploads and history.", features: ["Unlimited blocks for teams", "30-day page history", "Guest collaboration"] },
    { name: "Business", price: "$20", billingPeriod: "user/month", description: "Advanced permissions, security, and workspace controls.", features: ["SAML SSO", "Private teamspaces", "Advanced analytics"] },
  ],
  github: [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Public and private repos for individuals and small teams.", features: ["GitHub Actions minutes", "Issues and projects", "Community support"] },
    { name: "Team", price: "$4", billingPeriod: "user/month", description: "Team collaboration with protected branches and code owners.", features: ["Pull request reviews", "Code owners", "Required reviewers"] },
    { name: "Enterprise", price: "$21", billingPeriod: "user/month", description: "Enterprise security, compliance, and administration.", features: ["SAML SSO", "Advanced security", "Audit logs"] },
  ],
  supabase: [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Hosted Postgres and backend services for prototypes.", features: ["Postgres database", "Auth", "Storage"] },
    { name: "Pro", price: "$25", billingPeriod: "project/month", description: "Production projects with more compute and no pause.", features: ["Daily backups", "Higher limits", "Email support"] },
    { name: "Team", price: "$599", billingPeriod: "month", description: "Organization controls and advanced support for teams.", features: ["SSO", "SOC2 documents", "Priority support"] },
  ],
  mongodb: [
    { name: "M0 Free", price: "$0", billingPeriod: "month", description: "Free shared Atlas cluster for learning and prototypes.", features: ["512 MB storage", "Shared RAM", "Atlas UI"] },
    { name: "Dedicated", price: "From $57", billingPeriod: "month", description: "Dedicated Atlas clusters for production workloads.", features: ["Backups", "Autoscaling", "Global clusters"] },
    { name: "Serverless", price: "Usage-based", billingPeriod: "reads/writes/storage", description: "Scale-to-zero database option for variable traffic.", features: ["Pay per operation", "Automatic scaling", "No capacity planning"] },
  ],
  hubspot: [
    { name: "Free Tools", price: "$0", billingPeriod: "month", description: "Free CRM, marketing, sales, and service tools.", features: ["CRM contacts", "Forms", "Email marketing basics"] },
    { name: "Starter", price: "From $20", billingPeriod: "month", description: "Starter hubs for small teams needing automation and branding control.", features: ["Remove HubSpot branding", "Simple automation", "Email support"] },
    { name: "Professional", price: "From $800", billingPeriod: "month", description: "Advanced automation, reporting, and scale across hubs.", features: ["Workflows", "Custom reporting", "Campaign tools"] },
  ],
  "stripe-atlas": [
    { name: "Atlas setup", price: "$500", billingPeriod: "one-time", description: "Company formation package for Delaware C-Corps.", features: ["Incorporation", "EIN filing support", "Founder stock docs"] },
    { name: "Stripe Payments", price: "2.9% + 30¢", billingPeriod: "card transaction", description: "Standard online card payment processing.", features: ["Cards and wallets", "Disputes", "Fraud tools"] },
    { name: "Custom pricing", price: "Custom", billingPeriod: "volume", description: "Volume pricing for larger payment businesses.", features: ["Volume discounts", "Custom rates", "Dedicated support"] },
  ],
  salesforce: [
    { name: "Starter Suite", price: "$25", billingPeriod: "user/month", description: "Starter CRM suite for sales, service, and marketing.", features: ["Lead management", "Email tools", "Dashboards"] },
    { name: "Pro Suite", price: "$100", billingPeriod: "user/month", description: "More automation and customization for growing teams.", features: ["Forecasting", "Automation", "Custom apps"] },
    { name: "Enterprise", price: "$165", billingPeriod: "user/month", description: "Advanced CRM customization and platform features.", features: ["Workflow automation", "Advanced permissions", "API access"] },
  ],
};

const responsePricingByCategory = {
  cloud: [
    { name: "Free tier", price: "$0", billingPeriod: "month", description: "Entry-level free usage for trials, prototypes, or always-free services.", features: ["Free usage limits", "Basic monitoring", "Self-serve docs"] },
    { name: "Pay-as-you-go", price: "Usage-based", billingPeriod: "resources used", description: "Standard cloud pricing based on compute, storage, bandwidth, and managed services.", features: ["No upfront commitment", "Scale up/down", "Metered billing"] },
    { name: "Enterprise / committed use", price: "Custom", billingPeriod: "contract", description: "Discounted committed usage, support, or enterprise agreements.", features: ["Volume discounts", "Support plans", "Governance controls"] },
  ],
  infrastructure: [
    { name: "Free / developer", price: "$0", billingPeriod: "month", description: "Developer tier for testing and small projects.", features: ["Basic usage", "Community support", "Self-serve setup"] },
    { name: "Team / pro", price: "From $20", billingPeriod: "month", description: "Production tier for teams and live apps.", features: ["Higher limits", "Team controls", "Better performance"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Advanced reliability, security, compliance, and support.", features: ["SLA", "SSO", "Dedicated support"] },
  ],
  ai: [
    { name: "Free / trial", price: "$0", billingPeriod: "limited usage", description: "Starter access for evaluation and experiments.", features: ["Limited usage", "Basic models", "Self-serve docs"] },
    { name: "API / Pro", price: "Usage-based", billingPeriod: "usage", description: "Paid usage based on API calls, tokens, minutes, or generated media.", features: ["Production API", "Higher limits", "Usage billing"] },
    { name: "Business / Enterprise", price: "Custom", billingPeriod: "contract", description: "Higher limits, security, and support for business deployments.", features: ["Custom limits", "Priority support", "Security reviews"] },
  ],
  database: [
    { name: "Free", price: "$0", billingPeriod: "month", description: "Free hosted database tier for prototypes and development.", features: ["Shared resources", "Basic backups", "Limited storage"] },
    { name: "Production", price: "From $25", billingPeriod: "month", description: "Managed production database with backups and higher limits.", features: ["Backups", "Monitoring", "Higher compute"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Advanced scale, security, compliance, and dedicated support.", features: ["SLA", "Private networking", "Dedicated support"] },
  ],
};

function buildResponsePricing(row) {
  const id = row.slug || row.id || "";
  const name = row.name || "This product";
  const category = String(row.category || "").toLowerCase();
  const plans = responsePricingByDeal[id] || responsePricingByCategory[category] || [
    { name: "Free / trial", price: "$0", billingPeriod: "limited access", description: "Starter access for evaluation.", features: ["Self-serve setup", "Basic features", "Community resources"] },
    { name: "Team", price: "Custom", billingPeriod: "month", description: "Standard paid plan for teams.", features: ["Team workspace", "Higher limits", "Support"] },
    { name: "Enterprise", price: "Custom", billingPeriod: "contract", description: "Enterprise plan with advanced security and support.", features: ["SSO", "Admin controls", "Dedicated support"] },
  ];

  return {
    description: `${name} standard pricing shown separately from the PerksNest startup offer. Confirm current rates on the partner website before purchase.`,
    plans: plans.map((plan, index) => ({
      ...plan,
      highlighted: index === 1,
    })),
  };
}

function enrichDealResponse(row = {}) {
  const features = normalizeResponseFeatures(row);
  const dealText = row.deal_text || row.dealText || row.discounted_value || "Exclusive startup offer";
  const savings = row.savings || row.savings_amount || "Special offer";
  const description = row.description || row.short_description || `${row.name || "This deal"} helps startups move faster.`;
  const steps = safeArray(row.steps).length > 0
    ? safeArray(row.steps)
    : ["Open the partner offer from PerksNest.", "Create or sign in to your partner account.", "Complete any required startup verification."];
  const eligibility = safeArray(row.eligibility).length > 0
    ? safeArray(row.eligibility)
    : ["Startup or early-stage business profile", "Valid company or founder account", "One redemption per eligible company unless stated otherwise"];
  const storedHighlight = row.deal_highlight && typeof row.deal_highlight === "object" && (row.deal_highlight.savings || row.deal_highlight.headline)
    ? row.deal_highlight
    : null;
  const storedDeals = row.deals && typeof row.deals === "object" && (row.deals.title || row.deals.explanation)
    ? row.deals
    : null;
  const storedGeneral = row.general && typeof row.general === "object" && (row.general.overview || safeArray(row.general.useCases).length > 0)
    ? row.general
    : null;
  const storedPricing = row.pricing && typeof row.pricing === "object" && safeArray(row.pricing.plans).length > 0
    ? row.pricing
    : null;

  return {
    ...row,
    features,
    deal_highlight: storedHighlight || {
      savings,
      headline: dealText,
    },
    social_proof: row.social_proof || {
      redeemedCount: Number(row.member_count || row.claims || 0),
    },
    deals: storedDeals || {
      title: `${row.name || "Deal"} startup offer`,
      explanation: description,
      howCanBenefit: `${row.name || "This deal"} can help startups reduce spend while testing production-ready workflows.`,
      howCanIBenefit: steps,
      whyChooseThis: features.slice(0, 5).map((feature) => feature.title),
    },
    general: storedGeneral || {
      overview: description,
      useCases: features.slice(0, 4).map((feature) => feature.title),
      features,
      website: row.website || row.redeem_url || undefined,
    },
    faq: safeArray(row.faq).length > 0 ? row.faq : [
      {
        id: "faq-1",
        question: `How do I claim the ${row.name || "deal"} offer?`,
        answer: `Click the claim button on PerksNest, follow the partner flow, and complete any required verification. Typical steps: ${steps.join(" ")}`,
      },
      {
        id: "faq-2",
        question: `Who is eligible for ${row.name || "this offer"}?`,
        answer: eligibility.join(" "),
      },
      {
        id: "faq-3",
        question: "What happens after I apply?",
        answer: "The partner may activate credits automatically or review your application manually. Watch your email for approval and next steps.",
      },
    ],
    pricing: storedPricing || buildResponsePricing(row),
  };
}

app.get("/api/deals/:dealId", async (req, res) => {
  const { dealId } = req.params;
  try {
    const { data, error } = await db
      .from("deals")
      .select("*")
      .or(`id.eq.${dealId},slug.eq.${dealId}`)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      res.json({ deal: enrichDealResponse(data) });
      return;
    }
    const { data: partner } = await db.from("partner_deals").select("*").eq("id", dealId).maybeSingle();
    if (!partner) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }
    res.json({ deal: enrichDealResponse(partner) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deal", details: error.message });
  }
});

app.post("/api/deals/claim", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    const { dealId } = req.body || {};
    console.log(`[CLAIM] User ${userId} claiming deal ${dealId}`);
    
    if (!userId || !dealId) {
      res.status(400).json({ success: false, error: "userId and dealId are required" });
      return;
    }
    
    const { data: user, error: userError } = await db.from("users").select("*").eq("id", userId).single();
    if (userError) {
      console.error(`[CLAIM] Failed to fetch user: ${userError.message}`);
      throw userError;
    }

    const claimedDeals = safeArray(user.claimed_deals);
    console.log(`[CLAIM] Current claimed deals: ${JSON.stringify(claimedDeals)}`);
    
    const alreadyClaimed = claimedDeals.includes(dealId);
    const updated = alreadyClaimed ? claimedDeals : [...claimedDeals, dealId];
    
    console.log(`[CLAIM] Updating claimed deals: ${JSON.stringify(updated)}`);

    const { data: updatedUser, error: updateError } = await db.from("users").update({ claimed_deals: updated }).eq("id", userId).select("*").single();
    if (updateError) {
      console.error(`[CLAIM] Failed to update user: ${updateError.message}`);
      throw updateError;
    }

    console.log(`[CLAIM] User updated successfully. Inserting claim event...`);
    
    await db
      .from("claim_events")
      .upsert({ user_id: userId, deal_id: dealId, claimed_at: new Date().toISOString() }, { onConflict: "user_id,deal_id" });
    await recordClaimedDealRow({ userId, dealId });

    if (!alreadyClaimed) {
      await handleDealClaimExperience(updatedUser, dealId);
    }

    console.log(`[CLAIM] Claim event recorded. Returning response...`);
    res.json({ success: true, user: mapUser(updatedUser), claimedDeals: updated });
  } catch (error) {
    console.error("[CLAIM] ERROR:", error);
    
    // Provide detailed error information
    let errorMsg = (error instanceof Error ? error.message : String(error));
    let hint = "";
    
    // Check for specific Supabase errors
    if (errorMsg.includes("undefined column") || errorMsg.includes("does not exist")) {
      hint = "The 'claimed_deals' column might not exist in the users table. Run the migration: sql/03-add-claimed-deals-column.sql";
    } else if (errorMsg.includes("permission")) {
      hint = "Check database permissions and RLS policies";
    } else if (errorMsg.includes("connection")) {
      hint = "Check Supabase connectivity and API keys in .env file";
    }
    
    console.error("[CLAIM] HINT:", hint);
    res.status(500).json({ 
      success: false, 
      error: errorMsg,
      hint: hint,
      code: error.code || null
    });
  }
});

app.get("/api/deals/:dealId/claims", async (req, res) => {
  try {
    const { count, error } = await db
      .from("claim_events")
      .select("*", { count: "exact", head: true })
      .eq("deal_id", req.params.dealId);
    
    // Handle both table not found and other errors gracefully
    if (error) {
      // If table doesn't exist, return 0 count instead of erroring
      if (error.code === "42P01" || error.code === "PGRST106") {
        return res.json({ count: 0, message: "Claims table not initialized" });
      }
      throw error;
    }
    
    res.json({ count: count || 0 });
  } catch (error) {
    // Log the error but return 0 count for graceful degradation
    console.warn(`Deal claims error for ${req.params.dealId}:`, error.message);
    res.json({ count: 0, fallback: true });
  }
});

app.get("/api/user/claims", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    console.log(`[USER-CLAIMS] Fetching claims for user ${userId}`);
    
    if (!userId) {
      console.warn(`[USER-CLAIMS] No userId provided`);
      res.status(400).json({ claims: [] });
      return;
    }
    
    const { data, error } = await db.from("claim_events").select("*").eq("user_id", userId).order("claimed_at", { ascending: false });
    if (error) {
      console.error(`[USER-CLAIMS] Database error: ${error.message}`);
      throw error;
    }
    
    console.log(`[USER-CLAIMS] Found ${data?.length || 0} claims`);
    res.json({ claims: data || [] });
  } catch (error) {
    console.error("[USER-CLAIMS] ERROR:", error);
    res.status(500).json({ claims: [], error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get("/api/bookmarks", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    if (!userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    const { data, error } = await db
      .from("bookmarks")
      .select("deal_id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json({ success: true, dealIds: (data || []).map((row) => row.deal_id) });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/bookmarks", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    const dealId = String(req.body?.dealId || "").trim();
    if (!userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    if (!dealId) {
      res.status(400).json({ success: false, error: "dealId is required" });
      return;
    }

    const { data: existingBookmark, error: existingBookmarkError } = await db
      .from("bookmarks")
      .select("deal_id")
      .eq("user_id", userId)
      .eq("deal_id", dealId)
      .maybeSingle();

    if (existingBookmarkError) throw existingBookmarkError;

    if (!existingBookmark) {
      const { error } = await db
        .from("bookmarks")
        .insert({ user_id: userId, deal_id: dealId });

      if (error) throw error;
    }

    res.json({ success: true, dealId });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.delete("/api/bookmarks/:dealId", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    const { dealId } = req.params;
    if (!userId || !dealId) {
      res.status(400).json({ success: false, error: "userId and dealId are required" });
      return;
    }

    const { error } = await db
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("deal_id", dealId);

    if (error) throw error;
    res.json({ success: true, dealId });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const stats = await buildAdminStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin stats", details: error.message });
  }
});

app.get(["/api/admin/users", "/admin/users"], async (req, res) => {
  const context = await requireAdminContext(req, res);
  if (!context) return;

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "").trim();
  const role = String(req.query.role || "").trim();
  const plan = String(req.query.plan || "").trim();
  const dateFilter = String(req.query.date || "").trim();
  const activity = String(req.query.activity || "").trim();
  const from = Math.max((page - 1) * limit, 0);

  try {
    let query = db.from("users").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }
    if (status) query = query.eq("status", status);
    if (role === "admin") query = query.or("role.eq.admin,roles.cs.{admin}");
    else if (role === "free") query = query.eq("plan", "free").not("role", "eq", "admin");
    else if (role === "premium") query = query.in("plan", ["premium", "enterprise"]).not("role", "eq", "admin");
    else if (role) query = query.or(`role.eq.${role},roles.cs.{${role}}`);
    if (plan) query = query.eq("plan", plan);
    if (dateFilter === "7d") query = query.gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    if (dateFilter === "30d") query = query.gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
    if (dateFilter === "90d") query = query.gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    const { data: matchingUsers, error } = await query;
    if (error) throw error;

    const matchingUserIds = safeArray(matchingUsers).map((user) => user.id);
    const claimCounts = await getClaimCountsByUserId(matchingUserIds);
    let filteredUsers = safeArray(matchingUsers);
    if (activity === "most-active") {
      filteredUsers = [...filteredUsers].sort((a, b) => (claimCounts.get(String(b.id)) || 0) - (claimCounts.get(String(a.id)) || 0));
    } else if (activity === "no-activity") {
      filteredUsers = filteredUsers.filter((user) => (claimCounts.get(String(user.id)) || 0) === 0);
    } else if (activity === "claimed") {
      filteredUsers = filteredUsers.filter((user) => (claimCounts.get(String(user.id)) || 0) > 0);
    }

    const pageUsers = filteredUsers.slice(from, from + limit);
    const pageClaimCounts = await getClaimCountsByUserId(pageUsers.map((user) => user.id));

    const allUsersResult = await db.from("users").select("id,plan,role,roles,status,created_at");
    if (allUsersResult.error) throw allUsersResult.error;
    const allUsers = safeArray(allUsersResult.data);
    const allClaimCounts = await getClaimCountsByUserId(allUsers.map((user) => user.id));

    res.json({
      users: pageUsers.map((user) => mapAdminUserSummary(user, pageClaimCounts.get(String(user.id)) || 0)),
      total: filteredUsers.length,
      page,
      limit,
      stats: {
        total: allUsers.length,
        active: allUsers.filter((user) => (user.status || "active") === "active").length,
        premium: allUsers.filter((user) => ["premium", "enterprise"].includes(user.plan || "free")).length,
        free: allUsers.filter((user) => (user.plan || "free") === "free").length,
        enterprise: allUsers.filter((user) => user.plan === "enterprise").length,
        newThisMonth: allUsers.filter((user) => {
          if (!user.created_at) return false;
          return Date.now() - new Date(user.created_at).getTime() <= 30 * 24 * 60 * 60 * 1000;
        }).length,
        pendingVerification: allUsers.filter((user) => user.status === "pending").length,
        withActivity: allUsers.filter((user) => (allClaimCounts.get(String(user.id)) || 0) > 0).length,
        noActivity: allUsers.filter((user) => (allClaimCounts.get(String(user.id)) || 0) === 0).length,
      },
    });
  } catch (error) {
    res.status(500).json({ users: [], total: 0, error: "Failed to fetch users", details: error.message });
  }
});

app.get(["/api/admin/users/:userId", "/admin/users/:userId"], async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const { data: user, error } = await db.from("users").select("*").eq("id", req.params.userId).maybeSingle();
    if (error) throw error;
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const claimRows = await fetchClaimRowsForUser(user.id);
    res.json({
      success: true,
      user: mapAdminUserSummary(user, claimRows.length),
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get(["/api/admin/users/:userId/claimed-deals", "/admin/users/:userId/claimed-deals"], async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const sort = String(req.query.sort || "latest").trim();
    const dealType = String(req.query.dealType || "").trim();
    const status = String(req.query.status || "").trim();
    const from = Math.max((page - 1) * limit, 0);

    const user = await getUserProfileById(req.params.userId);
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const claimRows = await fetchClaimRowsForUser(req.params.userId);
    let claimedDeals = await enrichClaimedDeals(claimRows);
    const totalClaimed = claimedDeals.length;
    if (dealType) claimedDeals = claimedDeals.filter((claim) => claim.dealType === dealType);
    if (status) claimedDeals = claimedDeals.filter((claim) => claim.status === status);

    if (sort === "deal-type") {
      claimedDeals = [...claimedDeals].sort((a, b) => a.dealType.localeCompare(b.dealType) || new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime());
    } else if (sort === "date-asc") {
      claimedDeals = [...claimedDeals].sort((a, b) => new Date(a.claimedAt).getTime() - new Date(b.claimedAt).getTime());
    } else {
      claimedDeals = [...claimedDeals].sort((a, b) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime());
    }

    res.json({
      success: true,
      claimedDeals: claimedDeals.slice(from, from + limit),
      total: claimedDeals.length,
      totalClaimed,
      page,
      limit,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, claimedDeals: [], total: 0, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/admin/users", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const { email, password, name, role = "customer", plan = "free", status = "active", roles } = req.body || {};
    const normalizedEmail = String(email || "").toLowerCase().trim();

    if (!normalizedEmail || !password || !name) {
      res.status(400).json({ success: false, error: "name, email, and password are required" });
      return;
    }

    const authResult = await authAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: String(password),
      email_confirm: true,
      user_metadata: { name: String(name).trim() },
    });

    if (authResult.error || !authResult.data?.user) {
      throw authResult.error || new Error("Failed to create auth user");
    }

    let userRow = await ensureUserProfile({
      email: normalizedEmail,
      name: String(name).trim(),
      authUserId: authResult.data.user.id,
      role,
      roles: Array.isArray(roles) && roles.length > 0 ? roles : [role],
      emailVerified: true,
    });

    const { data: updatedUser, error: updateError } = await db
      .from("users")
      .update({
        plan,
        status,
        role,
        roles: Array.isArray(roles) && roles.length > 0 ? roles : [role],
        approved_by: context.user.email,
        approved_at: nowIso(),
      })
      .eq("id", userRow.id)
      .select("*")
      .single();

    if (updateError) throw updateError;
    userRow = updatedUser;

    res.status(201).json({ success: true, user: mapUser(userRow) });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.patch("/api/admin/users/:userId", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const allowedFields = ["name", "email", "role", "roles", "status", "plan", "notes", "email_verified"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
        updates[field] = field === "email" ? String(req.body[field]).toLowerCase().trim() : req.body[field];
      }
    });

    updates.approved_by = context.user.email;
    updates.approved_at = new Date().toISOString();

    const { data, error } = await db
      .from("users")
      .update(updates)
      .eq("id", req.params.userId)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ success: true, user: mapUser(data), rawUser: data });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.delete("/api/admin/users/:userId", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const targetUserId = String(req.params.userId || "");
    if (!targetUserId) {
      res.status(400).json({ success: false, error: "User ID is required" });
      return;
    }

    if (targetUserId === context.userId) {
      res.status(400).json({ success: false, error: "You cannot delete your own admin account" });
      return;
    }

    const existingUser = await getUserProfileById(targetUserId);
    if (!existingUser) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }

    const deleteAuthResult = await authAdmin.auth.admin.deleteUser(targetUserId);
    if (deleteAuthResult.error) {
      console.warn("[ADMIN DELETE USER] Failed to delete auth user:", deleteAuthResult.error.message);
    }

    const { error } = await db.from("users").delete().eq("id", targetUserId);
    if (error) throw error;

    res.json({ success: true, deletedUserId: targetUserId });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.patch("/api/users/me", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    const userId = context?.userId;
    const { name, emailPreferences } = req.body || {};
    if (!userId || !context?.user) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    const updatePayload = {};
    if (typeof name === "string") {
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        res.status(400).json({ success: false, error: "Name must be at least 2 characters" });
        return;
      }
      updatePayload.name = trimmedName;
    }
    if (typeof emailPreferences === "boolean") {
      updatePayload.notes = writeEmailPreferencesToNotes(context.user.notes, emailPreferences);
    }

    if (Object.keys(updatePayload).length === 0) {
      res.json({ success: true, user: mapUser(context.user) });
      return;
    }

    const { data, error } = await db
      .from("users")
      .update(updatePayload)
      .eq("id", userId)
      .select("*")
      .single();
    if (error) throw error;
    res.json({ success: true, user: data });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});


app.get("/api/messages", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    const threadId = String(req.query.threadId || "").trim();

    if (!context?.userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    let query = db.from("messages").select("*").order("created_at", { ascending: true });
    if (threadId) {
      query = query.eq("thread_id", threadId);
    } else if (context.user?.role !== "admin" && !safeArray(context.user?.roles).includes("admin")) {
      query = query.eq("thread_id", `${context.user.role || "customer"}_${context.userId}_admin`);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ success: true, messages: (data || []).map(mapMessage) });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get("/api/messages/threads", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    const { data, error } = await db.from("messages").select("*").order("created_at", { ascending: false });
    if (error) throw error;

    const visibleMessages =
      context.user?.role === "admin" || safeArray(context.user?.roles).includes("admin")
        ? data || []
        : (data || []).filter((row) => row.thread_id === `${context.user.role || "customer"}_${context.userId}_admin`);

    const threads = new Map();
    visibleMessages.forEach((row) => {
      if (!threads.has(row.thread_id)) {
        threads.set(row.thread_id, {
          threadId: row.thread_id,
          lastMessage: row.content,
          senderName: row.sender_name,
          updatedAt: row.created_at,
          unread: 0,
        });
      }
      if (!row.read && row.sender_role !== (context.user?.role || "customer")) {
        threads.get(row.thread_id).unread += 1;
      }
    });

    res.json({ success: true, threads: Array.from(threads.values()) });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/messages", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    const { threadId, content } = req.body || {};

    if (!context?.userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }
    if (!threadId || !content) {
      res.status(400).json({ success: false, error: "threadId and content are required" });
      return;
    }

    const { data, error } = await db
      .from("messages")
      .insert({
        thread_id: String(threadId),
        sender_id: context.userId,
        sender_name: context.user?.name || "User",
        sender_role: context.user?.role || "customer",
        content: String(content).trim(),
        read: false,
      })
      .select("*")
      .single();

    if (error) throw error;
    res.json({ success: true, message: mapMessage(data) });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.patch("/api/messages/:threadId/read", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    const { error } = await db
      .from("messages")
      .update({ read: true })
      .eq("thread_id", req.params.threadId)
      .neq("sender_role", context.user?.role || "customer");

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get("/api/referrals", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    const summary = await getReferralSummaryByUserId(context.userId);
    res.json({ success: true, ...summary });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get("/api/referrals/me", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    if (!userId) {
      res.json({ referrals: 0, conversions: 0, rewards: 0, referralList: [] });
      return;
    }
    const summary = await getReferralSummaryByUserId(userId);
    res.json({
      referrals: summary.total_referrals,
      conversions: summary.converted_referrals,
      rewards: summary.referral_earnings,
      clicks: summary.total_clicks,
      referralList: summary.referrals,
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ referrals: 0, conversions: 0, rewards: 0, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/referrals/invite", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    const inviteEmail = String(req.body?.email || "").trim();
    if (!inviteEmail || !inviteEmail.includes("@")) {
      res.status(400).json({ success: false, error: "A valid email is required" });
      return;
    }

    const { data: referrer, error: referrerError } = await db
      .from("users")
      .select("id,email,name,referral_code")
      .eq("id", context.userId)
      .single();

    if (referrerError) throw referrerError;

    const referral = await createReferralInvite(referrer, inviteEmail);

    await db.from("referral_clicks").insert({
      referral_code: String(referrer.referral_code || "").toUpperCase(),
      source: "email_invite",
      clicked_at: new Date().toISOString(),
    });

    res.json({ success: true, referral });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/referrals/click", async (req, res) => {
  const { referralCode, source } = req.body || {};
  if (!referralCode) {
    res.status(400).json({ tracked: false, error: "referralCode is required" });
    return;
  }
  try {
    const normalizedCode = String(referralCode).trim().toUpperCase();
    const { data: referrer } = await db.from("users").select("id").eq("referral_code", normalizedCode).maybeSingle();
    if (!referrer) {
      res.status(404).json({ tracked: false, error: "Invalid referral code" });
      return;
    }

    await db.from("referral_clicks").insert({
      referral_code: normalizedCode,
      source: source || "web",
      clicked_at: new Date().toISOString(),
    });
    res.json({ tracked: true });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ tracked: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/referrals/convert", async (req, res) => {
  const { referralCode } = req.body || {};
  if (!referralCode) {
    res.status(400).json({ converted: false, error: "referralCode is required" });
    return;
  }
  try {
    const { error } = await db
      .from("referrals")
      .update({ status: "converted", converted_at: new Date().toISOString() })
      .eq("code", String(referralCode).toUpperCase());
    if (error) throw error;
    res.json({ converted: true });
  } catch (error) {
    res.status(500).json({ converted: false, error: error.message });
  }
});

const normalizeDealReviewRow = (row = {}) => {
  const dealId = row.deal_id || row.dealId || null;
  const author = row.author || row.name || row.user_name || row.reviewer_name || "Anonymous reviewer";
  const quote = row.quote || row.review_text || row.text || row.comment || "";
  const metadata = reviewMetadataLookup.get(buildReviewLookupKey(dealId, author, quote)) || {};

  return {
    id: row.id || metadata.id || null,
    deal_id: dealId,
    author,
    name: row.name || row.author || row.user_name || row.reviewer_name || metadata.name || metadata.author || metadata.user_name || "Anonymous reviewer",
    role: row.role || row.title || metadata.role || "Founder",
    company: row.company || metadata.company || null,
    avatar: row.avatar || row.image_url || row.profile_image || metadata.image_url || metadata.avatar || null,
    image_url: row.image_url || row.avatar || row.profile_image || metadata.image_url || metadata.avatar || null,
    rating: Number(row.rating || metadata.rating || 5),
    quote,
    review_text: row.review_text || row.quote || row.text || row.comment || metadata.review_text || metadata.quote || "",
    date: row.date || metadata.date || row.created_at || metadata.created_at || new Date().toISOString().slice(0, 10),
    created_at: row.created_at || metadata.created_at || null,
  };
};

const getSeededDealReviews = (dealId) =>
  safeArray(reviewMetadataRows)
    .filter((review) => String(review.deal_id || review.dealId || "") === String(dealId || ""))
    .map(normalizeDealReviewRow)
    .sort((a, b) => new Date(b.created_at || b.date || 0).getTime() - new Date(a.created_at || a.date || 0).getTime());

app.get("/api/deals/:dealId/reviews", async (req, res) => {
  const seededReviews = getSeededDealReviews(req.params.dealId);

  try {
    const { data, error } = await db
      .from("reviews")
      .select("*")
      .eq("deal_id", req.params.dealId)
      .order("created_at", { ascending: false });

    if (error && error.code !== "22P02") throw error;

    const reviews = (data || []).map(normalizeDealReviewRow);
    const resolvedReviews = reviews.length > 0 ? reviews : seededReviews;
    console.log(`[DEAL-REVIEWS] ${req.params.dealId}: returning ${reviews.length} review(s)`);
    res.json({ reviews: resolvedReviews });
  } catch (error) {
    if (seededReviews.length > 0) {
      res.json({ reviews: seededReviews, fallback: true });
      return;
    }

    res.status(500).json({ reviews: [], error: error.message });
  }
});

app.get("/api/deals/reviews", async (_, res) => {
  try {
    const { data, error } = await db.from("reviews").select("*").order("created_at", { ascending: false });
    if (error) throw error;

    const reviews = (data || []).map(normalizeDealReviewRow);
    const resolvedReviews = reviews.length > 0 ? reviews : safeArray(reviewMetadataRows).map(normalizeDealReviewRow);
    res.json({ reviews: resolvedReviews });
  } catch (error) {
    res.json({ reviews: safeArray(reviewMetadataRows).map(normalizeDealReviewRow), fallback: true });
  }
});

app.post("/api/contact", async (req, res) => {
  const validation = validateContactPayload(req.body || {});
  if (!validation.ok) {
    res.status(400).json({ success: false, error: validation.error });
    return;
  }

  const { name, email, subject, message, honeypot } = validation.data;
  if (honeypot) {
    res.json({ success: true, ignored: true });
    return;
  }

  const ipAddress = getClientIp(req);
  if (isContactRateLimited(ipAddress)) {
    res.status(429).json({
      success: false,
      error: "Too many messages from this connection. Please wait a bit and try again.",
    });
    return;
  }

  try {
    await sendContactSubmissionEmail({ name, email, subject, message });

    try {
      await db.from("contact_messages").insert({
        name,
        email,
        message: `Subject: ${subject}\n\n${message}`,
        created_at: new Date().toISOString(),
      });
    } catch (storageError) {
      console.warn("[CONTACT] Failed to persist contact message:", toErrorMessage(storageError));
    }

    res.json({ success: true, message: "We’ll get back to you soon." });
  } catch (error) {
    console.error("[CONTACT] Failed to send contact email:", toErrorMessage(error));
    res.status(500).json({
      success: false,
      error: "We couldn’t send your message right now. Please try again shortly.",
    });
    return;
  }
});

app.post("/api/password-reset", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    res.status(400).json({ success: false, error: "Email is required" });
    return;
  }
  try {
    await authClient.auth.resetPasswordForEmail(String(email).toLowerCase().trim(), {
      redirectTo:
        process.env.PASSWORD_RESET_REDIRECT_URL ||
        process.env.APP_URL ||
        allowedOrigins[0] ||
        "http://localhost:5173/login",
    });
  } catch {
    // Intentionally return success to avoid leaking account existence.
  }
  res.json({ success: true, message: "If the account exists, reset instructions were sent." });
});

app.post("/api/send-verification", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    res.status(400).json({ success: false, error: "Email is required" });
    return;
  }
  res.json({ success: true });
});

app.post("/api/notify", async (_, res) => res.json({ success: true }));

app.post("/api/checkout", async (_, res) => {
  res.json({ url: process.env.CHECKOUT_FALLBACK_URL || "https://perksnest.co/pricing" });
});

app.post("/api/billing/portal", async (_, res) => {
  res.json({ url: process.env.BILLING_PORTAL_URL || "https://perksnest.co/customer" });
});

app.post("/api/billing/cancel-subscription", async (req, res) => {
  try {
    const userId = (await getRequestUserId(req)) || req.body?.userId;
    if (!userId) {
      return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const { data: user, error: userError } = await db
      .from("users")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (userError) throw userError;
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isActivePremiumSubscription =
      user.plan === "premium" && String(user.status || "active").toLowerCase() === "active";

    if (!isActivePremiumSubscription) {
      return res.status(400).json({
        success: false,
        error: "No active premium subscription found for this account",
      });
    }

    const { data: updatedUser, error: updateError } = await db
      .from("users")
      .update({ plan: "free" })
      .eq("id", userId)
      .select("*")
      .single();
    if (updateError) throw updateError;

    res.json({
      success: true,
      message: "Subscription cancelled successfully",
      cancelledAt: nowIso(),
      user: mapUser(updatedUser),
    });
  } catch (error) {
    console.error("CANCEL SUBSCRIPTION ERROR:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

app.get("/api/stripe/:path*", async (_, res) => {
  res.json({ data: [], subscriptions: [] });
});

app.get("/api/admin/settings", async (_, res) => {
  try {
    const { data, error } = await db.from("admin_settings").select("*").limit(1).maybeSingle();
    if (error) throw error;
    res.json({ settings: data || {} });
  } catch {
    res.json({ settings: {} });
  }
});

app.post("/api/admin/settings", async (req, res) => {
  try {
    const payload = { ...req.body, updated_at: new Date().toISOString() };
    await db.from("admin_settings").upsert(payload, { onConflict: "id" });
    res.json({ success: true });
  } catch {
    res.json({ success: true });
  }
});

app.get("/api/admin/whitelabel/clients", async (_, res) => {
  try {
    const { data, error } = await db.from("wl_clients").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ clients: data || [] });
  } catch (error) {
    res.status(500).json({ clients: [], error: error.message });
  }
});

app.post("/api/admin/whitelabel/clients", async (req, res) => {
  try {
    const { data, error } = await db.from("wl_clients").insert(req.body).select("*").single();
    if (error) throw error;
    res.json({ success: true, client: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch("/api/admin/whitelabel/clients/:id", async (req, res) => {
  try {
    const { data, error } = await db.from("wl_clients").update(req.body).eq("id", req.params.id).select("*").single();
    if (error) throw error;
    res.json({ success: true, client: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/admin/whitelabel/clients/:id", async (req, res) => {
  try {
    const { error } = await db.from("wl_clients").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/admin/deals", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const [platformDealsResult, partnerDealsResult] = await Promise.all([
      db.from("deals").select("*").order("created_at", { ascending: false }),
      db.from("partner_deals").select("*").order("created_at", { ascending: false }),
    ]);

    if (platformDealsResult.error) throw platformDealsResult.error;
    if (partnerDealsResult.error) throw partnerDealsResult.error;

    res.json({
      success: true,
      deals: safeArray(platformDealsResult.data),
      partnerDeals: safeArray(partnerDealsResult.data).map(formatPartnerDeal),
    });
  } catch (error) {
    res.status(500).json({ success: false, deals: [], partnerDeals: [], error: error.message });
  }
});

app.patch("/api/admin/partner-deals/:dealId/status", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;

    const { status, rejectionReason } = req.body || {};
    if (!["approved", "rejected", "pending"].includes(String(status))) {
      res.status(400).json({ success: false, error: "status must be approved, rejected, or pending" });
      return;
    }

    const { data, error } = await db
      .from("partner_deals")
      .update({
        status,
        rejection_reason: rejectionReason || null,
        approved_at: status === "approved" ? nowIso() : null,
      })
      .eq("id", req.params.dealId)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ success: true, deal: formatPartnerDeal(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function slugifyDealName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function isValidHttpUrl(value) {
  if (!value) return true;
  try {
    const parsed = new URL(String(value));
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function isValidAssetUrl(value) {
  if (!value) return true;
  return isValidHttpUrl(value) || /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/i.test(String(value));
}

function normalizeDealList(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item || "").trim()).filter(Boolean);
}

function normalizeObjectList(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === "object");
}

const baseAdminDealColumns = new Set([
  "id",
  "slug",
  "name",
  "company",
  "logo",
  "description",
  "deal_text",
  "savings",
  "member_count",
  "is_premium",
  "is_free",
  "is_pick",
  "featured",
  "category",
  "subcategory",
  "last_added",
  "expires_at",
  "collection",
  "redeem_url",
  "promo_code",
  "steps",
  "eligibility",
  "features",
  "reviews",
  "website",
  "expires_in",
  "created_at",
  "updated_at",
]);

const optionalAdminDealColumns = [
  "short_description",
  "full_description",
  "deal_highlight",
  "social_proof",
  "deals",
  "general",
  "faq",
  "pricing",
  "alternatives",
  "related_deals",
  "resources",
];

let writableDealColumnsCache = null;

async function getWritableDealColumns() {
  if (writableDealColumnsCache) return writableDealColumnsCache;
  const writable = new Set(baseAdminDealColumns);

  await Promise.all(optionalAdminDealColumns.map(async (column) => {
    const { error } = await db.from("deals").select(column).limit(1);
    if (!error) writable.add(column);
  }));

  writableDealColumnsCache = writable;
  return writableDealColumnsCache;
}

async function filterAdminDealPayloadForDb(data) {
  const writable = await getWritableDealColumns();
  return Object.fromEntries(Object.entries(data).filter(([key, value]) => writable.has(key) && value !== undefined));
}

function validateAndBuildAdminDealPayload(rawPayload = {}, existingId) {
  const errors = [];
  const name = String(rawPayload.name || "").trim();
  const slug = slugifyDealName(rawPayload.slug || name);
  const company = String(rawPayload.company || name).trim();
  const logo = String(rawPayload.logo || "").trim();
  const category = String(rawPayload.category || "other").trim().toLowerCase();
  const subcategory = String(rawPayload.subcategory || "").trim().toLowerCase() || null;
  const description = String(rawPayload.description || "").trim();
  const dealText = String(rawPayload.deal_text || rawPayload.dealText || "").trim();
  const savings = String(rawPayload.savings || "").trim();
  const dealType = String(rawPayload.dealType || rawPayload.type || "free").trim().toLowerCase();
  const benefits = normalizeDealList(rawPayload.eligibility || rawPayload.benefits);
  const steps = normalizeDealList(rawPayload.steps);
  const features = normalizeObjectList(rawPayload.features);
  const faq = normalizeObjectList(rawPayload.faq);
  const reviews = normalizeObjectList(rawPayload.reviews);
  const pricing = rawPayload.pricing && typeof rawPayload.pricing === "object" ? rawPayload.pricing : {};
  const pricingPlans = normalizeObjectList(pricing.plans);
  const redeemUrl = String(rawPayload.redeem_url || rawPayload.redeemUrl || "").trim();
  const website = String(rawPayload.website || redeemUrl).trim();
  const promoCode = String(rawPayload.promo_code || rawPayload.promoCode || "").trim() || null;
  const collection = String(rawPayload.collection || "").trim() || null;
  const expiresAt = String(rawPayload.expires_at || rawPayload.expiresAt || "").trim() || null;
  const expiresIn = String(rawPayload.expires_in || rawPayload.expiresIn || "").trim() || null;
  const memberCount = Number(rawPayload.member_count || rawPayload.memberCount || 0);
  const featured = Boolean(rawPayload.featured);
  const isPick = Boolean(rawPayload.is_pick || rawPayload.isPick);

  if (!name) errors.push("Deal name is required.");
  if (!slug) errors.push("Slug is required.");
  if (!company) errors.push("Company name is required.");
  if (!category) errors.push("Category is required.");
  if (!description) errors.push("Description is required.");
  if (!dealText) errors.push("Deal text is required.");
  if (!savings) errors.push("Savings is required.");
  if (!redeemUrl) errors.push("Claim URL is required.");
  if (!["free", "premium"].includes(dealType)) errors.push("Deal type must be free or premium.");
  if (benefits.length === 0) errors.push("Add at least one key benefit.");
  if (features.length === 0) errors.push("Add at least one detail page feature.");
  if (pricingPlans.length === 0) errors.push("Add at least one pricing plan.");
  if (faq.length === 0) errors.push("Add at least one FAQ.");
  if (reviews.length === 0) errors.push("Add at least one review.");
  if (steps.length === 0) errors.push("Add at least one redemption step.");

  if (!isValidAssetUrl(logo)) {
    errors.push("Logo must be a valid http(s) URL or uploaded image.");
  }
  if (!isValidHttpUrl(redeemUrl)) errors.push("Claim URL must be a valid http(s) URL.");
  if (!isValidHttpUrl(website)) errors.push("Website must be a valid http(s) URL.");
  if (expiresAt && Number.isNaN(new Date(expiresAt).getTime())) {
    errors.push("Expiration date is invalid.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const pricingData = {
    description: String(pricing.description || `${name} partner pricing and startup offer details.`).trim(),
    plans: pricingPlans,
  };
  const dealHighlight = rawPayload.deal_highlight && typeof rawPayload.deal_highlight === "object"
    ? rawPayload.deal_highlight
    : {
      savings,
      headline: dealText,
    };
  const general = rawPayload.general && typeof rawPayload.general === "object"
    ? rawPayload.general
    : {
      overview: description,
      useCases: benefits.slice(0, 4),
      website: website || redeemUrl,
    };

  const data = {
      id: existingId ? undefined : slug,
      slug,
      name,
      company,
      logo: logo || null,
      description,
      deal_text: dealText,
      savings,
      member_count: Number.isFinite(memberCount) ? memberCount : 0,
      is_premium: dealType === "premium",
      is_free: dealType === "free",
      is_pick: isPick,
      featured,
      category,
      subcategory,
      last_added: existingId ? undefined : nowIso(),
      expires_at: expiresAt,
      collection,
      redeem_url: redeemUrl,
      promo_code: promoCode,
      steps,
      eligibility: benefits,
      features,
      reviews,
      short_description: description,
      full_description: description,
      deal_highlight: dealHighlight,
      social_proof: {
        redeemedCount: Number.isFinite(memberCount) ? memberCount : 0,
      },
      deals: {
        title: `${name} startup offer`,
        explanation: description,
        howCanBenefit: `${name} can help startups save ${savings} while adopting ${company}.`,
        howCanIBenefit: steps,
        whyChooseThis: features.map((feature) => feature.title).filter(Boolean).slice(0, 5),
      },
      general,
      faq,
      pricing: pricingData,
      website: website || redeemUrl,
      expires_in: expiresIn,
      updated_at: nowIso(),
      ...(existingId ? {} : { created_at: nowIso() }),
    };

  return {
    ok: true,
    data: Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)),
  };
}

app.post("/api/admin/deals", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;
    console.log("[ADMIN DEAL CREATE] Incoming payload:", JSON.stringify(req.body || {}));

    const validation = validateAndBuildAdminDealPayload(req.body);
    if (!validation.ok) {
      res.status(400).json({ success: false, error: validation.errors.join(" ") });
      return;
    }

    const payload = await filterAdminDealPayloadForDb(validation.data);
    const { data, error } = await db.from("deals").insert(payload).select("*").single();
    console.log("[ADMIN DEAL CREATE] DB response:", JSON.stringify({ data, error }));
    if (error) {
      const isDuplicate = error.code === "23505";
      return res.status(isDuplicate ? 409 : 500).json({ success: false, error: formatSupabaseError(error) });
    }
    res.json({ success: true, deal: data });
  } catch (error) {
    console.error("[ADMIN DEAL CREATE] ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.put("/api/admin/deals/:dealId", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;
    console.log("[ADMIN DEAL UPDATE] Incoming payload:", JSON.stringify({ dealId: req.params.dealId, body: req.body || {} }));

    const validation = validateAndBuildAdminDealPayload(req.body, req.params.dealId);
    if (!validation.ok) {
      res.status(400).json({ success: false, error: validation.errors.join(" ") });
      return;
    }

    const payload = await filterAdminDealPayloadForDb(validation.data);
    const { data, error } = await db.from("deals").update(payload).eq("id", req.params.dealId).select("*").single();
    console.log("[ADMIN DEAL UPDATE] DB response:", JSON.stringify({ data, error }));
    if (error) {
      const isDuplicate = error.code === "23505";
      return res.status(isDuplicate ? 409 : 500).json({ success: false, error: formatSupabaseError(error) });
    }
    res.json({ success: true, deal: data });
  } catch (error) {
    console.error("[ADMIN DEAL UPDATE] ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

app.delete("/api/admin/deals/:dealId", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;
    const dealId = String(req.params.dealId || "").trim();
    if (!dealId) {
      res.status(400).json({ success: false, error: "Deal ID is required" });
      return;
    }

    let lookup = await db.from("deals").select("id,slug").eq("id", dealId).maybeSingle();
    if (lookup.error) throw lookup.error;
    if (!lookup.data) {
      lookup = await db.from("deals").select("id,slug").eq("slug", dealId).maybeSingle();
      if (lookup.error) throw lookup.error;
    }
    if (!lookup.data) {
      res.status(404).json({ success: false, error: "Deal not found" });
      return;
    }

    const dealKeys = [...new Set([lookup.data.id, lookup.data.slug, dealId].map((value) => String(value || "").trim()).filter(Boolean))];
    for (const table of ["bookmarks", "claim_events", "reviews"]) {
      const { error } = await db.from(table).delete().in("deal_id", dealKeys);
      if (error) throw error;
    }

    const { data, error } = await db.from("deals").delete().eq("id", lookup.data.id).select("id").single();
    if (error) throw error;
    res.json({ success: true, deletedId: data.id });
  } catch (error) {
    console.error("[ADMIN DEAL DELETE] ERROR:", error);
    res.status(500).json({ success: false, error: formatSupabaseError(error) });
  }
});

// --- USER TICKET ROUTES ---
app.get("/api/tickets", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) return res.status(401).json({ success: false, error: "Authentication required" });

    const { data, error } = await db
      .from("tickets")
      .select("id,user_id,user_name,user_email,deal_id,subject,status,priority,type,description,created_at,updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    res.json({ tickets: data || [] });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ tickets: [], error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/tickets", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) return res.status(401).json({ success: false, error: "Authentication required" });

    const { subject, message, description, dealId, deal_id, type, priority } = req.body || {};
    const normalizedSubject = String(subject || "").trim();
    const normalizedMessage = String(message ?? description ?? "").trim();
    const normalizedDealId = String(dealId || deal_id || "").trim();
    const normalizedType = ["billing", "technical", "general"].includes(String(type)) ? String(type) : "general";
    const normalizedPriority = ["low", "medium", "high"].includes(String(priority)) ? String(priority) : "medium";

    if (!normalizedSubject || !normalizedMessage || !normalizedDealId) {
      return res.status(400).json({ success: false, error: "Subject, deal, and message are required" });
    }

    const payload = await filterTicketPayloadForDb({
      user_id: context.userId,
      user_name: context.user?.name || "User",
      user_email: context.user?.email || "",
      user_role: context.user?.role || "customer",
      deal_id: normalizedDealId,
      subject: normalizedSubject,
      description: normalizedMessage,
      type: normalizedType,
      priority: normalizedPriority,
      status: "open",
    });

    const { data: ticket, error: ticketError } = await db.from("tickets").insert(payload).select("*").single();

    if (ticketError) throw ticketError;
    io.to("admin:tickets").emit("ticket:created", ticket);
    io.to(`user:${context.userId}`).emit("ticket:created", ticket);
    res.json({ success: true, ticket });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get("/api/tickets/:id", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) return res.status(401).json({ success: false, error: "Authentication required" });

    const ticket = await getTicketWithMessages(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });
    if (!canAccessTicket(ticket, context.user)) return res.status(403).json({ success: false, error: "Forbidden" });

    res.json({ ticket });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/tickets/:id/reply", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) return res.status(401).json({ success: false, error: "Authentication required" });

    const ticket = await getTicketWithMessages(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });
    if (!canAccessTicket(ticket, context.user)) return res.status(403).json({ success: false, error: "Forbidden" });
    if (ticket.status === "closed" && !isAdminUser(context.user)) {
      return res.status(403).json({ success: false, error: "This ticket is closed" });
    }

    const data = await insertTicketMessageRecord({
      ticketId: req.params.id,
      senderId: context.userId,
      senderName: context.user?.name || "User",
      senderType: isAdminUser(context.user) ? "admin" : "user",
      message: req.body.message,
    });
    
    const { data: updatedTicket } = await db.from("tickets").update({ updated_at: new Date().toISOString(), status: "open" }).eq("id", req.params.id).select("*").single();
    const mapped = mapTicketMessage(data);
    io.to(String(req.params.id)).emit("receive_message", { success: true, message: mapped });
    io.to(String(req.params.id)).emit("ticket:message", mapped);
    io.to("admin:tickets").emit("ticket:updated", updatedTicket || { id: req.params.id, status: "open", updated_at: new Date().toISOString() });
    io.to(`user:${ticket.user_id}`).emit("ticket:updated", updatedTicket || { id: req.params.id, status: "open", updated_at: new Date().toISOString() });

    res.json({ success: true, message: mapped });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.patch("/api/tickets/:id/status", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) return res.status(401).json({ success: false, error: "Authentication required" });

    const ticket = await getTicketWithMessages(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });
    if (!canAccessTicket(ticket, context.user)) return res.status(403).json({ success: false, error: "Forbidden" });
    if (!isAdminUser(context.user)) return res.status(403).json({ success: false, error: "Only admins can update ticket status" });

    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: "Status required" });

    const { data, error } = await db.from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select("*")
      .single();

    if (error) throw error;
    io.to(String(req.params.id)).emit("ticket:updated", data);
    io.to("admin:tickets").emit("ticket:updated", data);
    io.to(`user:${ticket.user_id}`).emit("ticket:updated", data);
    res.json({ success: true, ticket: data });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

// --- PAYMENT ROUTES (Razorpay) ---

/**
 * POST /api/create-order
 * Creates a Razorpay order for premium upgrade
 * Used when user clicks "Upgrade to Premium"
 */
app.post("/api/create-order", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error("[PAYMENT] Razorpay SDK not initialized");
      return res.status(500).json({ success: false, error: "Payment service not configured" });
    }

    // Prevent duplicate orders - check if user already has active premium
    const { data: user, error: userError } = await db.from("users").select("plan,id").eq("id", userId).single();
    if (userError) throw userError;

    if (user.plan === "premium") {
      return res.status(400).json({ success: false, error: "User is already premium" });
    }

    try {
      const amountInPaise = getPremiumAmountInPaise();
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`, // Max 40 chars: Razorpay requirement
        payment_capture: 1, // Auto capture payment
        notes: {
          plan: "premium",
          usd_amount: String(PREMIUM_PLAN_USD),
          usd_to_inr_rate: String(USD_TO_INR_RATE),
        },
      };

      console.log(`[PAYMENT] Creating order for user ${userId}`, options);
      
      const order = await razorpay.orders.create(options);

      console.log(`[PAYMENT] Order created successfully: ${order.id}`);

      // Store order in database for tracking (non-blocking)
      try {
        const { error: insertError } = await db.from("payment_orders").insert({
          user_id: userId,
          razorpay_order_id: order.id,
          amount: options.amount,
          currency: options.currency,
          status: "created",
          created_at: new Date().toISOString(),
        });
        if (insertError) {
          console.warn("[PAYMENT] Failed to store order:", insertError);
        } else {
          console.log("[PAYMENT] Order stored in database");
        }
      } catch (dbError) {
        console.warn("[PAYMENT] Error storing order:", dbError);
      }

      res.json({
        success: true,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (razorpayError) {
      const errorMsg = razorpayError instanceof Error ? razorpayError.message : String(razorpayError);
      const errorFull = JSON.stringify(razorpayError, null, 2);
      console.error("[PAYMENT] Razorpay error:", errorMsg);
      console.error("[PAYMENT] Full error:", errorFull);
      res.status(500).json({
        success: false,
        error: `Failed to create order: ${errorMsg}`,
      });
    }
  } catch (error) {
    console.error("[PAYMENT] Create order error:", error);
    res.status(500).json({
      success: false,
      error: (error instanceof Error ? error.message : String(error)),
    });
  }
});

/**
 * POST /api/verify-payment
 * Verifies Razorpay payment signature and upgrades user to premium
 * CRITICAL: Only upgrade user after successful signature verification
 */
app.post("/api/verify-payment", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, error: "Authentication required" });
    }

    const { payment_id, order_id, signature } = req.body;

    if (!payment_id || !order_id || !signature) {
      console.warn(`[PAYMENT] Missing payment details for user ${userId}`);
      return res.status(400).json({
        success: false,
        error: "Missing payment details",
      });
    }

    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
    if (!RAZORPAY_KEY_SECRET) {
      console.error("[PAYMENT] Missing Razorpay secret key");
      return res.status(500).json({ success: false, error: "Payment verification failed" });
    }

    try {
      const { data: existingUser, error: existingUserError } = await db.from("users").select("*").eq("id", userId).maybeSingle();
      if (existingUserError) throw existingUserError;

      let recordedOrder = null;
      try {
        const { data: orderRecord, error: orderRecordError } = await db
          .from("payment_orders")
          .select("amount,currency")
          .eq("razorpay_order_id", order_id)
          .eq("user_id", userId)
          .maybeSingle();
        if (orderRecordError) {
          console.warn("[PAYMENT] Failed to read order amount:", orderRecordError);
        } else {
          recordedOrder = orderRecord;
        }
      } catch (dbError) {
        console.warn("[PAYMENT] Error reading order amount:", dbError);
      }

      // Verify signature using crypto
      const crypto = require("crypto");
      const expectedSignature = crypto
        .createHmac("sha256", RAZORPAY_KEY_SECRET)
        .update(`${order_id}|${payment_id}`)
        .digest("hex");

      const isSignatureValid = expectedSignature === signature;

      console.log(`[PAYMENT] Signature verification for user ${userId}:`, {
        isValid: isSignatureValid,
        orderId: order_id,
        paymentId: payment_id,
      });

      if (!isSignatureValid) {
        console.warn(`[PAYMENT] Invalid signature for user ${userId}`);
        return res.status(400).json({
          success: false,
          error: "Invalid payment signature - payment verification failed",
        });
      }

      // Signature is valid - upgrade user to premium
      console.log(`[PAYMENT] Valid signature. Upgrading user ${userId} to premium...`);

      const { data: updatedUser, error: updateError } = await db
        .from("users")
        .update({
          plan: "premium",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select("*")
        .single();

      if (updateError) {
        console.error(`[PAYMENT] Failed to update user: ${updateError.message}`);
        throw updateError;
      }

      // Store successful payment in database (non-blocking)
      try {
        const { error: updateStatusError } = await db
          .from("payment_orders")
          .update({ status: "success" })
          .eq("razorpay_order_id", order_id);
        if (updateStatusError) {
          console.warn("[PAYMENT] Failed to update order status:", updateStatusError);
        } else {
          console.log("[PAYMENT] Order status updated to success");
        }
      } catch (dbError) {
        console.warn("[PAYMENT] Error updating order status:", dbError);
      }

      // Store payment record (non-blocking)
      try {
        const { error: insertError } = await db
          .from("payment_history")
          .insert({
            user_id: userId,
            razorpay_payment_id: payment_id,
            razorpay_order_id: order_id,
            amount: recordedOrder?.amount || getPremiumAmountInPaise(),
            currency: recordedOrder?.currency || "INR",
            status: "success",
            created_at: new Date().toISOString(),
          });
        if (insertError) {
          console.warn("[PAYMENT] Failed to store payment history:", insertError);
        } else {
          console.log("[PAYMENT] Payment record stored");
        }
      } catch (dbError) {
        console.warn("[PAYMENT] Error storing payment history:", dbError);
      }

      console.log(`[PAYMENT] User ${userId} successfully upgraded to premium`);
      let notification = null;
      if (existingUser?.plan !== "premium") {
        notification = await handlePremiumActivationExperience(updatedUser);
      }

      res.json({
        success: true,
        message: "Payment verified and user upgraded to premium",
        user: mapUser(updatedUser),
        notification,
      });
    } catch (verifyError) {
      console.error("[PAYMENT] Verification error:", verifyError);
      res.status(500).json({
        success: false,
        error: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("[PAYMENT] Verify payment error:", error);
    res.status(500).json({
      success: false,
      error: (error instanceof Error ? error.message : String(error)),
    });
  }
});

// --- ADMIN TICKET ROUTES ---
app.get("/api/admin/tickets", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId || !isAdminUser(context.user)) {
      return res.status(403).json({ success: false, error: "Forbidden - Admin only" });
    }

    const { data, error } = await db.from("tickets").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    res.json({ tickets: data || [] });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ tickets: [], error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.get("/api/admin/tickets/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidUUID(id)) {
    return res.status(400).json({ success: false, error: "Invalid Ticket ID format" });
  }
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId || !isAdminUser(context.user)) {
      return res.status(403).json({ success: false, error: "Forbidden - Admin only" });
    }

    const ticket = await getTicketWithMessages(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, error: "Ticket not found" });

    res.json({ ticket });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.put("/api/admin/tickets/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidUUID(id)) {
    return res.status(400).json({ success: false, error: "Invalid Ticket ID format" });
  }
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId || !isAdminUser(context.user)) {
      return res.status(403).json({ success: false, error: "Forbidden - Admin only" });
    }

    const { status, priority } = req.body;
    const updates = {};
    if (status) updates.status = status;
    if (priority) updates.priority = priority;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await db.from("tickets").update(updates).eq("id", req.params.id).select("*").single();
    if (error) throw error;
    io.to(String(req.params.id)).emit("ticket:updated", data);
    io.to("admin:tickets").emit("ticket:updated", data);
    io.to(`user:${data.user_id}`).emit("ticket:updated", data);

    res.json({ success: true, ticket: data });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
  }
});

app.post("/api/admin/tickets/:id/reply", async (req, res) => {
  const ticketId = req.params.id;
  if (!isValidUUID(ticketId)) {
    return res.status(400).json({ success: false, error: "Invalid Ticket ID format" });
  }
  try {
    console.log(`[ADMIN REPLY] Starting reply for ticket: ${ticketId}`);
    
    // 1. Authenticate Request
    let context;
    try {
      context = await getAuthenticatedRequestContext(req);
    } catch (authErr) {
      console.error("[ADMIN REPLY] Auth check failed:", authErr);
      return res.status(401).json({ 
        success: false, 
        error: "Your session has expired. Please log in again.",
        code: "UNAUTHORIZED"
      });
    }

    if (!context?.userId || !isAdminUser(context.user)) {
      console.warn(`[ADMIN REPLY] Access denied for user: ${context?.userId}`);
      return res.status(403).json({ success: false, error: "Forbidden - Admin access required" });
    }

    // 2. Insert Message
    console.log(`[ADMIN REPLY] Inserting message into DB for ticket ${ticketId}`);
    const data = await insertTicketMessageRecord({
      ticketId,
      senderId: context.userId,
      senderName: context.user?.name || "Support Team",
      senderType: "admin",
      message: req.body.message,
    });
    
    if (!data) {
      throw new Error("Message created but no data was returned from the database.");
    }
    
    const mapped = mapTicketMessage(data);
    
    // 3. Update Ticket Metadata
    console.log(`[ADMIN REPLY] Updating ticket status for ${ticketId}`);
    await db.from("tickets").update({ 
      updated_at: new Date().toISOString(), 
      status: req.body.status || "open" 
    }).eq("id", ticketId);
    const { data: updatedTicket } = await db.from("tickets").select("*").eq("id", ticketId).maybeSingle();

    // 4. Real-time broadcast (Defensive)
    try {
      console.log(`[ADMIN REPLY] Broadcasting update for ticket ${ticketId} via socket`);
      io.to(String(ticketId)).emit("receive_message", { success: true, message: mapped });
      io.to(String(ticketId)).emit("ticket:message", mapped);
      if (updatedTicket) {
        io.to(String(ticketId)).emit("ticket:updated", updatedTicket);
        io.to("admin:tickets").emit("ticket:updated", updatedTicket);
        io.to(`user:${updatedTicket.user_id}`).emit("ticket:updated", updatedTicket);
      }
    } catch (socketErr) {
      console.warn("[ADMIN REPLY] Real-time broadcast failed (non-critical):", socketErr);
      // We don't throw here so the user still gets a success response for the DB write
    }

    console.log(`[ADMIN REPLY] Successfully processed reply for ticket ${ticketId}`);
    res.json({ success: true, message: mapped });
  } catch (error) {
    console.error(`[ADMIN REPLY] Critical error processing ticket ${ticketId}:`, error);
    res.status(500).json({ 
      success: false, 
      error: "Internal Server Error during ticket reply processing.",
      details: (error instanceof Error ? error.message : String(error))
    });
  }
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, "") ||
      null;
    const userId = socket.handshake.auth?.userId || null;

    if (!token && !userId) {
      next(new Error("Authentication required"));
      return;
    }

    if (token) {
      try {
        const context = await getAuthenticatedProfileFromToken(token);
        socket.data.user = context.user;
        socket.data.authUser = context.authUser;
      } catch (tokenError) {
        if (!userId) throw tokenError;
        const user = await getUserProfileById(userId);
        if (!user) throw tokenError;
        socket.data.user = user;
      }
    } else {
      const user = await getUserProfileById(userId);
      if (!user) {
        next(new Error("Unauthorized"));
        return;
      }
      socket.data.user = user;
    }
    next();
  } catch (error) {
    console.error("ERROR:", error);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  if (socket.data.user?.id) {
    socket.join(`user:${socket.data.user.id}`);
  }
  if (isAdminUser(socket.data.user)) {
    socket.join("admin:tickets");
  }

  socket.on("join_ticket", async ({ ticketId }) => {
    try {
      const ticket = await getTicketWithMessages(ticketId);
      if (!ticket) {
        socket.emit("ticket_error", { success: false, error: "Ticket not found" });
        return;
      }
      if (!canAccessTicket(ticket, socket.data.user)) {
        socket.emit("ticket_error", { success: false, error: "Forbidden" });
        return;
      }
      if (ticket.status === "closed" && !isAdminUser(socket.data.user)) {
        socket.emit("ticket_error", { success: false, error: "This ticket is closed" });
        return;
      }

      await socket.join(String(ticketId));
      socket.emit("joined_ticket", { success: true, ticketId: String(ticketId) });
    } catch (error) {
      console.error("ERROR:", error);
      socket.emit("ticket_error", { success: false, error: (error instanceof Error ? error.message : String(error)) });
    }
  });

  socket.on("send_message", async ({ ticketId, message }) => {
    try {
      if (!ticketId || !message || !isValidUUID(ticketId)) {
        socket.emit("ticket_error", { success: false, error: "Valid ticketId and message are required" });
        return;
      }

      const ticket = await getTicketWithMessages(ticketId);
      if (!ticket) {
        socket.emit("ticket_error", { success: false, error: "Ticket not found" });
        return;
      }
      if (!canAccessTicket(ticket, socket.data.user)) {
        socket.emit("ticket_error", { success: false, error: "Forbidden" });
        return;
      }

      const data = await insertTicketMessageRecord({
        ticketId,
        senderId: socket.data.user.id,
        senderName: socket.data.user.name || "User",
        senderType: isAdminUser(socket.data.user) ? "admin" : "user",
        message,
      });

      const { data: updatedTicket } = await db.from("tickets").update({ updated_at: new Date().toISOString(), status: "open" }).eq("id", ticketId).select("*").single();
      const mapped = mapTicketMessage(data);
      io.to(String(ticketId)).emit("receive_message", { success: true, message: mapped });
      io.to(String(ticketId)).emit("ticket:message", mapped);
      io.to("admin:tickets").emit("ticket:updated", updatedTicket || { id: ticketId, status: "open", updated_at: new Date().toISOString() });
      io.to(`user:${ticket.user_id}`).emit("ticket:updated", updatedTicket || { id: ticketId, status: "open", updated_at: new Date().toISOString() });
    } catch (error) {
      console.error("ERROR:", error);
      socket.emit("ticket_error", { success: false, error: (error instanceof Error ? error.message : String(error)) });
    }
  });
});

// --- DEBUG ENDPOINT ---
app.get("/api/debug/claimed-deals", async (req, res) => {
  try {
    // Try to get userId from:
    // 1. Query parameter: ?userId=xxx
    // 2. Header: x-user-id: xxx
    // 3. Authentication header
    const queryUserId = req.query.userId || req.query.uid;
    const headerUserId = req.headers["x-user-id"];
    let userId = queryUserId || headerUserId;
    
    // If no userId provided, try to get from auth
    if (!userId) {
      userId = await getRequestUserId(req).catch(() => null);
    }
    
    console.log(`[DEBUG] Testing claimed_deals`);
    console.log(`[DEBUG] Provided userId: ${userId}`);
    console.log(`[DEBUG] Query params:`, req.query);
    console.log(`[DEBUG] Headers x-user-id:`, req.headers["x-user-id"]);

    // First: Test database connection
    console.log(`[DEBUG] Testing database connection...`);
    const { data: testUser, error: testError } = await db
      .from("users")
      .select("id,email,claimed_deals")
      .limit(1)
      .single();
    
    if (testError) {
      console.error(`[DEBUG] Database connection failed:`, testError);
      return res.json({
        status: "error",
        phase: "database_connection",
        error: testError.message,
        code: testError.code,
        hint: "Database is not accessible. Check Supabase connectivity.",
        help: "Your Supabase URL and API key may be incorrect. Check backend/.env"
      });
    }

    console.log(`[DEBUG] Database connection OK`);

    // Check if claimed_deals column exists
    const hasClaimedDealsColumn = testUser && 'claimed_deals' in testUser;
    console.log(`[DEBUG] claimed_deals column exists: ${hasClaimedDealsColumn}`);

    if (!hasClaimedDealsColumn) {
      return res.json({
        status: "error",
        phase: "column_check",
        error: "claimed_deals column does not exist",
        message: "The 'claimed_deals' column is missing from the users table",
        hint: "You need to run the SQL migration to add the claimed_deals column",
        fix: "Run this SQL in Supabase SQL Editor: ALTER TABLE perksnest.users ADD COLUMN IF NOT EXISTS claimed_deals TEXT[] DEFAULT '{}';",
        help: "See DEBUG_CLAIMED_DEALS.md for full migration SQL"
      });
    }

    if (!userId) {
      return res.json({
        status: "ok",
        phase: "no_user_provided",
        message: "Database and column are OK, but no userId was provided",
        database_status: "connected",
        claimed_deals_column: "exists",
        how_to_test_with_user: [
          "Option 1: Visit ?userId=any-test-id",
          "Option 2: Send header: x-user-id: any-test-id",
          "Option 3: Login to the app first, then visit without parameters"
        ]
      });
    }

    // Test 2: Fetch specific user and check claimed_deals
    console.log(`[DEBUG] Fetching user: ${userId}`);
    const { data: user, error: userError } = await db.from("users").select("*").eq("id", userId).single();
    
    if (userError) {
      console.error(`[DEBUG] User fetch failed:`, userError);
      return res.json({
        status: "error",
        phase: "user_fetch",
        error: userError.message,
        code: userError.code,
        hint: userError.hint,
        userId: userId,
        message: `User ${userId} not found or access denied`
      });
    }

    console.log(`[DEBUG] User found:`, { id: user.id, email: user.email });

    // Test 3: Try to update claimed_deals
    const testDealId = "test-deal-" + Date.now();
    const currentDeals = Array.isArray(user.claimed_deals) ? user.claimed_deals : [];
    const updated = [...currentDeals, testDealId];
    
    console.log(`[DEBUG] Testing update with test deal: ${testDealId}`);
    const { data: updatedUser, error: updateError } = await db
      .from("users")
      .update({ claimed_deals: updated })
      .eq("id", userId)
      .select("*")
      .single();
    
    if (updateError) {
      console.error(`[DEBUG] Update failed:`, updateError);
      return res.json({
        status: "error",
        phase: "update_test",
        error: updateError.message,
        code: updateError.code,
        hint: "Update to claimed_deals column failed",
        message: "Check database permissions and RLS policies",
        userId: userId
      });
    }

    console.log(`[DEBUG] Update successful`);

    // Test 4: Verify update worked
    const { data: verifyUser, error: verifyError } = await db
      .from("users")
      .select("claimed_deals")
      .eq("id", userId)
      .single();

    const updateVerified = verifyUser && verifyUser.claimed_deals && verifyUser.claimed_deals.includes(testDealId);
    console.log(`[DEBUG] Update verified: ${updateVerified}`);

    res.json({
      status: "ok",
      phase: "all_tests_passed",
      message: "Everything looks good! Your claimed deals setup is working correctly.",
      database: {
        connected: true,
        schema: SUPABASE_DB_SCHEMA
      },
      column: {
        exists: true,
        type: "array"
      },
      user: {
        id: user.id,
        email: user.email,
        claimed_deals_count: currentDeals.length,
        claimed_deals_current: currentDeals
      },
      update_test: {
        attempted: true,
        success: true,
        tested_value: testDealId,
        verified: updateVerified
      },
      next_steps: [
        "Try claiming a deal in the app",
        "Check the /api/user/claims endpoint to verify persistence",
        "Check the dashboard to see claimed deals"
      ]
    });

  } catch (error) {
    console.error("[DEBUG] Unexpected error:", error);
    res.status(500).json({
      status: "error",
      phase: "unexpected_error",
      error: (error instanceof Error ? error.message : String(error)),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

server.listen(PORT, () => {
  console.log(`PerksNest backend API running on port ${PORT}`);
  validateDatabaseSetup();
});
