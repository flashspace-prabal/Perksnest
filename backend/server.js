require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Stripe setup
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const stripe = STRIPE_SECRET_KEY ? require("stripe")(STRIPE_SECRET_KEY) : null;

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
        const { error } = await db.from("users").update({ plan: "premium" }).eq("id", userId);
        if (error) throw error;
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
    db.from("deals").select("id,name,category,savings,active,created_at"),
    db.from("partner_deals").select("*"),
    db.from("claim_events").select("id,deal_id,claimed_at"),
    db.from("wl_clients").select("mrr,status,members").order("created_at", { ascending: false }),
    db.from("tickets").select("id,status,priority,created_at,updated_at"),
    db.from("messages").select("id,thread_id,created_at,read,sender_role"),
    db.from("deal_reviews").select("rating"),
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
  const activePlatformDeals = platformDeals.filter((deal) => deal.active !== false);
  const allVisibleDeals = [
    ...activePlatformDeals.map((deal) => ({
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
    activeDeals: activePlatformDeals.length + approvedPartnerDeals.length,
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
    const { data, error } = await db.from("users").update({ plan }).eq("id", userId).select("*").single();
    if (error) throw error;
    if (plan !== "free") {
      await convertReferralForUser({ id: userId, email: data.email });
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
    if (!userId || !dealId) {
      res.status(400).json({ success: false, error: "Missing userId or dealId" });
      return;
    }
    const { data: user, error: userError } = await db.from("users").select("*").eq("id", userId).single();
    if (userError) throw userError;

    const claimedDeals = safeArray(user.claimed_deals);
    const updated = claimedDeals.includes(dealId) ? claimedDeals : [...claimedDeals, dealId];

    const { data: updatedUser, error: updateError } = await db
      .from("users")
      .update({ claimed_deals: updated })
      .eq("id", userId)
      .select("*")
      .single();
    if (updateError) throw updateError;

    await db.from("claim_events").upsert({ user_id: userId, deal_id: dealId }, { onConflict: "user_id,deal_id" });
    res.json({ success: true, user: mapUser(updatedUser) });
  } catch (error) {
    console.error("ERROR:", error);
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

app.get("/api/deals", async (_, res) => {
  try {
    const { data, error } = await db.from("deals").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ deals: data || [] });
  } catch {
    const { data } = await db.from("partner_deals").select("*").eq("status", "approved");
    res.json({ deals: data || [] });
  }
});

app.get("/api/deals/:dealId", async (req, res) => {
  const { dealId } = req.params;
  try {
    const { data, error } = await db.from("deals").select("*").eq("id", dealId).maybeSingle();
    if (error) throw error;
    if (data) {
      res.json({ deal: data });
      return;
    }
    const { data: partner } = await db.from("partner_deals").select("*").eq("id", dealId).maybeSingle();
    if (!partner) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }
    res.json({ deal: partner });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch deal", details: error.message });
  }
});

app.post("/api/deals/claim", async (req, res) => {
  try {
    const userId = await getRequestUserId(req);
    const { dealId } = req.body || {};
    if (!userId || !dealId) {
      res.status(400).json({ success: false, error: "userId and dealId are required" });
      return;
    }
    const { data: user, error: userError } = await db.from("users").select("claimed_deals").eq("id", userId).single();
    if (userError) throw userError;

    const claimedDeals = safeArray(user.claimed_deals);
    const updated = claimedDeals.includes(dealId) ? claimedDeals : [...claimedDeals, dealId];

    const { error: updateError } = await db.from("users").update({ claimed_deals: updated }).eq("id", userId);
    if (updateError) throw updateError;

    await db
      .from("claim_events")
      .upsert({ user_id: userId, deal_id: dealId, claimed_at: new Date().toISOString() }, { onConflict: "user_id,deal_id" });

    res.json({ success: true, claimedDeals: updated });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
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
    if (!userId) {
      res.status(400).json({ claims: [] });
      return;
    }
    const { data, error } = await db.from("claim_events").select("*").eq("user_id", userId).order("claimed_at", { ascending: false });
    if (error) throw error;
    res.json({ claims: data || [] });
  } catch (error) {
    console.error("ERROR:", error);
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
    const { dealId } = req.body || {};
    if (!userId || !dealId) {
      res.status(400).json({ success: false, error: "userId and dealId are required" });
      return;
    }

    const { error } = await db
      .from("bookmarks")
      .upsert({ user_id: userId, deal_id: dealId }, { onConflict: "user_id,deal_id", ignoreDuplicates: true });

    if (error) throw error;
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

app.get("/api/admin/users", async (req, res) => {
  const context = await requireAdminContext(req, res);
  if (!context) return;

  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "").trim();
  const role = String(req.query.role || "").trim();
  const plan = String(req.query.plan || "").trim();
  const from = Math.max((page - 1) * limit, 0);
  const to = from + limit - 1;

  try {
    let query = db.from("users").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }
    if (status) query = query.eq("status", status);
    if (role) query = query.or(`role.eq.${role},roles.cs.{${role}}`);
    if (plan) query = query.eq("plan", plan);
    const { data, error, count } = await query;
    if (error) throw error;

    const allUsersResult = await db.from("users").select("id,plan,role,roles,status,created_at");
    if (allUsersResult.error) throw allUsersResult.error;
    const allUsers = safeArray(allUsersResult.data);

    res.json({
      users: (data || []).map(mapUser),
      total: count || 0,
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
      },
    });
  } catch (error) {
    res.status(500).json({ users: [], total: 0, error: "Failed to fetch users", details: error.message });
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
    const userId = await getRequestUserId(req);
    const { name, email } = req.body || {};
    if (!userId) {
      res.status(400).json({ success: false, error: "Missing userId" });
      return;
    }
    const { data, error } = await db
      .from("users")
      .update({
        ...(name ? { name } : {}),
        ...(email ? { email: String(email).toLowerCase().trim() } : {}),
      })
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

app.get("/api/deals/:dealId/reviews", async (req, res) => {
  try {
    const { data, error } = await db.from("deal_reviews").select("*").eq("deal_id", req.params.dealId).maybeSingle();
    if (error) throw error;
    res.json({ review: data || null });
  } catch (error) {
    res.status(500).json({ review: null, error: error.message });
  }
});

app.get("/api/deals/reviews", async (_, res) => {
  try {
    const { data, error } = await db.from("deal_reviews").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ reviews: data || [] });
  } catch (error) {
    res.status(500).json({ reviews: [], error: error.message });
  }
});

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    res.status(400).json({ success: false, error: "Missing required fields" });
    return;
  }
  try {
    await db.from("contact_messages").insert({
      name,
      email: String(email).toLowerCase().trim(),
      message,
      created_at: new Date().toISOString(),
    });
  } catch {
    // Best effort only.
  }
  res.json({ success: true });
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

app.post("/api/admin/deals", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;
    const { data, error } = await db.from("deals").insert(req.body).select("*").single();
    if (error) throw error;
    res.json({ success: true, deal: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/admin/deals/:dealId", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;
    const { data, error } = await db.from("deals").update(req.body).eq("id", req.params.dealId).select("*").single();
    if (error) throw error;
    res.json({ success: true, deal: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/admin/deals/:dealId", async (req, res) => {
  try {
    const context = await requireAdminContext(req, res);
    if (!context) return;
    const { error } = await db.from("deals").delete().eq("id", req.params.dealId);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- USER TICKET ROUTES ---
app.get("/api/tickets", async (req, res) => {
  try {
    const context = await getAuthenticatedRequestContext(req);
    if (!context?.userId) return res.status(401).json({ success: false, error: "Authentication required" });

    const { data, error } = await db.from("tickets").select("*").eq("user_id", context.userId).order("updated_at", { ascending: false });
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

    const { subject, message, type, priority } = req.body;
    const { data: ticket, error: ticketError } = await db.from("tickets").insert({
      user_id: context.userId,
      user_name: context.user?.name || "User",
      user_email: context.user?.email || "",
      user_role: context.user?.role || "customer",
      subject: String(subject).trim(),
      description: String(message).trim(),
      type: type || "general",
      priority: priority || "medium",
      status: "open",
    }).select("*").single();

    if (ticketError) throw ticketError;
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

    const data = await insertTicketMessageRecord({
      ticketId: req.params.id,
      senderId: context.userId,
      senderName: context.user?.name || "User",
      senderType: isAdminUser(context.user) ? "admin" : "user",
      message: req.body.message,
    });
    
    await db.from("tickets").update({ updated_at: new Date().toISOString(), status: "open" }).eq("id", req.params.id);
    const mapped = mapTicketMessage(data);
    io.to(String(req.params.id)).emit("receive_message", { success: true, message: mapped });
    io.to(String(req.params.id)).emit("ticket:message", mapped);

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

    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: "Status required" });

    const { data, error } = await db.from("tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select("*")
      .single();

    if (error) throw error;
    res.json({ success: true, ticket: data });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ success: false, error: (error instanceof Error ? error.message : String(error)) });
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

    const { data, error } = await db.from("tickets").update(updates).eq("id", req.params.id).select("*").single();
    if (error) throw error;

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

    // 4. Real-time broadcast (Defensive)
    try {
      console.log(`[ADMIN REPLY] Broadcasting update for ticket ${ticketId} via socket`);
      io.to(String(ticketId)).emit("receive_message", { success: true, message: mapped });
      io.to(String(ticketId)).emit("ticket:message", mapped);
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

    if (!token) {
      next(new Error("Authentication required"));
      return;
    }

    const context = await getAuthenticatedProfileFromToken(token);
    socket.data.user = context.user;
    socket.data.authUser = context.authUser;
    next();
  } catch (error) {
    console.error("ERROR:", error);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
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

      await db.from("tickets").update({ updated_at: new Date().toISOString(), status: "open" }).eq("id", ticketId);
      const mapped = mapTicketMessage(data);
      io.to(String(ticketId)).emit("receive_message", { success: true, message: mapped });
      io.to(String(ticketId)).emit("ticket:message", mapped);
    } catch (error) {
      console.error("ERROR:", error);
      socket.emit("ticket_error", { success: false, error: (error instanceof Error ? error.message : String(error)) });
    }
  });
});

server.listen(PORT, () => {
  console.log(`PerksNest backend API running on port ${PORT}`);
  validateDatabaseSetup();
});
