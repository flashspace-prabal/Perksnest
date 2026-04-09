require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const app = express();
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

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const supabaseKey = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY/SUPABASE_ANON_KEY");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, supabaseKey, {
  db: { schema: "perksnest" },
  auth: { persistSession: false, autoRefreshToken: false },
});

const nowIso = () => new Date().toISOString();
const parseAuthorizationToken = (req) => {
  const raw = req.headers.authorization || "";
  if (!raw.toLowerCase().startsWith("bearer ")) return null;
  return raw.slice(7).trim() || null;
};
const getUserIdFromRequest = (req) =>
  req.headers["x-user-id"] ||
  parseAuthorizationToken(req) ||
  req.body.userId ||
  req.query.userId ||
  null;

const safeArray = (value) => (Array.isArray(value) ? value : []);
const hashPassword = (password) =>
  crypto.createHash("sha256").update(`${password}perksnest_salt_2026`).digest("hex");

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
  createdAt: row.created_at || nowIso(),
});

async function generateUniqueReferralCode(name) {
  const base = String(name || "USER")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 4) || "USER";

  for (let i = 0; i < 10; i += 1) {
    const candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
    const { data } = await db.from("users").select("id").eq("referral_code", candidate).maybeSingle();
    if (!data) return candidate;
  }
  return `${base}${Date.now().toString().slice(-6)}`;
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
    .update({ status: "converted", referree_id: referredUser.id, converted_at: nowIso() })
    .eq("id", data.id);

  const { count } = await db
    .from("referrals")
    .select("*", { count: "exact", head: true })
    .eq("referrer_id", data.referrer_id)
    .in("status", ["converted", "paid"]);

  await db.from("users").update({ referral_count: count || 0 }).eq("id", data.referrer_id);
  return true;
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
  user_id: row.user_id,
  user_name: row.user_name || "User",
  message: row.message,
  is_admin: Boolean(row.is_admin),
  created_at: row.created_at,
});

async function getTicketWithMessages(ticketId) {
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

app.get("/health", (_, res) => res.json({ ok: true, service: "perksnest-backend" }));
app.get("/api/health", (_, res) => res.json({ ok: true, service: "perksnest-backend" }));

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ success: false, error: "Email and password are required" });
    return;
  }
  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const plainPassword = String(password);
    const hashedPassword = hashPassword(plainPassword);

    const { data, error } = await db
      .from("users")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error || !data) {
      res.status(401).json({ success: false, error: "Invalid email or password" });
      return;
    }

    const savedPassword = String(data.password || "");
    const passwordMatches = savedPassword === hashedPassword || savedPassword === plainPassword;
    if (!passwordMatches) {
      res.status(401).json({ success: false, error: "Invalid email or password" });
      return;
    }

    // Backward compatibility: migrate old plain-text passwords to hashed format on successful login.
    if (savedPassword === plainPassword && savedPassword !== hashedPassword) {
      await db.from("users").update({ password: hashedPassword }).eq("id", data.id);
      data.password = hashedPassword;
    }

    res.json({ success: true, user: mapUser(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed", details: error.message });
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
    const { data: existing } = await db.from("users").select("id").eq("email", normalizedEmail).maybeSingle();
    if (existing) {
      res.status(409).json({ success: false, error: "Email already exists" });
      return;
    }

    const referralCode = await generateUniqueReferralCode(name);
    const { data, error } = await db
      .from("users")
      .insert({
        email: normalizedEmail,
        password: hashPassword(String(password)),
        name: String(name).trim(),
        plan: "free",
        role: "customer",
        roles: ["customer"],
        referral_code: referralCode,
        referral_count: 0,
        claimed_deals: [],
        status: "active",
      })
      .select("*")
      .single();
    if (error || !data) throw error || new Error("Failed to create user");

    if (referrerCode) {
      await registerReferralSignup(referrerCode, { id: data.id, email: data.email, name: data.name });
    }

    res.status(201).json({ success: true, user: mapUser(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Registration failed", details: error.message });
  }
});

app.get("/api/auth/me", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(400).json({ success: false, error: "Missing userId" });
    return;
  }
  try {
    const { data, error } = await db.from("users").select("*").eq("id", userId).maybeSingle();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
    res.json({ success: true, user: mapUser(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch user", details: error.message });
  }
});

app.patch("/api/auth/plan", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { plan } = req.body || {};
  if (!userId || !plan) {
    res.status(400).json({ success: false, error: "Missing userId or plan" });
    return;
  }
  try {
    const { data, error } = await db.from("users").update({ plan }).eq("id", userId).select("*").single();
    if (error) throw error;
    if (plan !== "free") {
      await convertReferralForUser({ id: userId, email: data.email });
    }
    res.json({ success: true, user: mapUser(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update plan", details: error.message });
  }
});

app.post("/api/auth/claim-deal", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { dealId } = req.body || {};
  if (!userId || !dealId) {
    res.status(400).json({ success: false, error: "Missing userId or dealId" });
    return;
  }
  try {
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
    await convertReferralForUser({ id: userId, email: updatedUser.email });

    res.json({ success: true, user: mapUser(updatedUser) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to claim deal", details: error.message });
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
  const { email, name, avatar, referralCode } = req.body || {};
  if (!email) {
    res.status(400).json({ success: false, error: "Email is required" });
    return;
  }
  const normalizedEmail = String(email).toLowerCase().trim();
  try {
    const { data: existing } = await db.from("users").select("*").eq("email", normalizedEmail).maybeSingle();
    if (existing) {
      if (avatar && existing.avatar !== avatar) {
        await db.from("users").update({ avatar, email_verified: true }).eq("id", existing.id);
      }
      const { data: refreshed } = await db.from("users").select("*").eq("id", existing.id).single();
      res.json({ success: true, user: mapUser(refreshed || existing) });
      return;
    }

    const generatedCode = await generateUniqueReferralCode(name || normalizedEmail.split("@")[0]);
    const { data, error } = await db
      .from("users")
      .insert({
        email: normalizedEmail,
        name: String(name || normalizedEmail.split("@")[0]),
        avatar: avatar || null,
        password: "google_oauth",
        plan: "free",
        role: "customer",
        roles: ["customer"],
        status: "active",
        email_verified: true,
        referral_code: generatedCode,
        referral_count: 0,
        claimed_deals: [],
      })
      .select("*")
      .single();
    if (error || !data) throw error || new Error("Failed to create oauth user");

    if (referralCode) {
      await registerReferralSignup(referralCode, { id: data.id, email: data.email, name: data.name });
    }

    res.status(201).json({ success: true, user: mapUser(data) });
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
  const userId = getUserIdFromRequest(req);
  const { dealId } = req.body || {};
  if (!userId || !dealId) {
    res.status(400).json({ success: false, error: "userId and dealId are required" });
    return;
  }

  try {
    const { data: user, error: userError } = await db.from("users").select("claimed_deals").eq("id", userId).single();
    if (userError) throw userError;

    const claimedDeals = safeArray(user.claimed_deals);
    const updated = claimedDeals.includes(dealId) ? claimedDeals : [...claimedDeals, dealId];

    const { error: updateError } = await db.from("users").update({ claimed_deals: updated }).eq("id", userId);
    if (updateError) throw updateError;

    await db
      .from("claim_events")
      .upsert({ user_id: userId, deal_id: dealId, claimed_at: nowIso() }, { onConflict: "user_id,deal_id" });

    res.json({ success: true, claimedDeals: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to claim deal", details: error.message });
  }
});

app.get("/api/deals/:dealId/claims", async (req, res) => {
  try {
    const { count, error } = await db
      .from("claim_events")
      .select("*", { count: "exact", head: true })
      .eq("deal_id", req.params.dealId);
    if (error) throw error;
    res.json({ count: count || 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch claim count", details: error.message });
  }
});

app.get("/api/user/claims", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.status(400).json({ claims: [] });
    return;
  }
  try {
    const { data, error } = await db.from("claim_events").select("*").eq("user_id", userId).order("claimed_at", { ascending: false });
    if (error) throw error;
    res.json({ claims: data || [] });
  } catch (error) {
    res.status(500).json({ claims: [], error: "Failed to fetch user claims", details: error.message });
  }
});

app.get("/api/admin/stats", async (_, res) => {
  try {
    const [usersCount, dealsCount, claimsCount] = await Promise.all([
      db.from("users").select("*", { count: "exact", head: true }),
      db.from("deals").select("*", { count: "exact", head: true }),
      db.from("claim_events").select("*", { count: "exact", head: true }),
    ]);
    res.json({
      stats: {
        users: usersCount.count || 0,
        deals: dealsCount.count || 0,
        claims: claimsCount.count || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin stats", details: error.message });
  }
});

app.get("/api/admin/users", async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 50);
  const search = String(req.query.search || "").trim();
  const from = Math.max((page - 1) * limit, 0);
  const to = from + limit - 1;

  try {
    let query = db.from("users").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, to);
    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ users: data || [], total: count || 0, page, limit });
  } catch (error) {
    res.status(500).json({ users: [], total: 0, error: "Failed to fetch users", details: error.message });
  }
});

app.patch("/api/users/me", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { name, email } = req.body || {};
  if (!userId) {
    res.status(400).json({ success: false, error: "Missing userId" });
    return;
  }
  try {
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
    res.status(500).json({ success: false, error: "Failed to update user", details: error.message });
  }
});

app.get("/api/tickets", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.json({ tickets: [] });
    return;
  }
  try {
    const { data, error } = await db.from("tickets").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ tickets: (data || []).map(mapTicket) });
  } catch (error) {
    res.status(500).json({ tickets: [], error: "Failed to fetch tickets", details: error.message });
  }
});

app.post("/api/tickets", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { subject, description, message, priority = "medium", type = "general" } = req.body || {};
  if (!userId || !subject || !(description || message)) {
    res.status(400).json({ success: false, error: "Missing required fields" });
    return;
  }
  try {
    const { data: user } = await db.from("users").select("name,email,role").eq("id", userId).maybeSingle();
    const payload = {
      user_id: userId,
      user_name: user?.name || "User",
      user_email: user?.email || "",
      user_role: user?.role || "customer",
      subject: String(subject).trim(),
      status: "open",
      priority,
      type,
      description: String(description || message).trim(),
      updated_at: nowIso(),
    };
    const { data, error } = await db.from("tickets").insert(payload).select("*").single();
    if (error) throw error;
    res.json({ success: true, ticket: mapTicket(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create ticket", details: error.message });
  }
});

app.get("/api/tickets/:ticketId", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  try {
    const ticket = await getTicketWithMessages(req.params.ticketId);
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }
    if (userId && ticket.user_id !== userId) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: "Failed to load ticket", details: error.message });
  }
});

app.post("/api/tickets/:ticketId/reply", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { message } = req.body || {};
  if (!userId || !message) {
    res.status(400).json({ success: false, error: "Missing required fields" });
    return;
  }
  try {
    const { data: user } = await db.from("users").select("name").eq("id", userId).maybeSingle();
    const { data, error } = await db
      .from("ticket_messages")
      .insert({
        ticket_id: req.params.ticketId,
        user_id: userId,
        user_name: user?.name || "User",
        message: String(message).trim(),
        is_admin: false,
      })
      .select("*")
      .single();
    if (error) throw error;
    await db.from("tickets").update({ status: "open", updated_at: nowIso() }).eq("id", req.params.ticketId);
    res.json({ success: true, message: mapTicketMessage(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send reply", details: error.message });
  }
});

app.put("/api/tickets/:ticketId/close", async (req, res) => {
  try {
    const { error } = await db.from("tickets").update({ status: "closed", updated_at: nowIso() }).eq("id", req.params.ticketId);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to close ticket", details: error.message });
  }
});

app.get("/api/admin/tickets", async (_, res) => {
  try {
    const { data, error } = await db.from("tickets").select("*").order("updated_at", { ascending: false });
    if (error) throw error;
    res.json({ tickets: (data || []).map(mapTicket) });
  } catch (error) {
    res.status(500).json({ tickets: [], error: "Failed to load tickets", details: error.message });
  }
});

app.get("/api/admin/tickets/:ticketId", async (req, res) => {
  try {
    const ticket = await getTicketWithMessages(req.params.ticketId);
    if (!ticket) {
      res.status(404).json({ error: "Ticket not found" });
      return;
    }
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: "Failed to load ticket detail", details: error.message });
  }
});

app.post("/api/admin/tickets/:ticketId/reply", async (req, res) => {
  const { message } = req.body || {};
  if (!message) {
    res.status(400).json({ success: false, error: "Message is required" });
    return;
  }
  try {
    const { data, error } = await db
      .from("ticket_messages")
      .insert({
        ticket_id: req.params.ticketId,
        user_id: "admin",
        user_name: "Support Team",
        message: String(message).trim(),
        is_admin: true,
      })
      .select("*")
      .single();
    if (error) throw error;
    await db.from("tickets").update({ status: "pending", updated_at: nowIso() }).eq("id", req.params.ticketId);
    res.json({ success: true, message: mapTicketMessage(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to send admin reply", details: error.message });
  }
});

app.put("/api/admin/tickets/:ticketId", async (req, res) => {
  const { status, priority } = req.body || {};
  try {
    const payload = {
      ...(status ? { status } : {}),
      ...(priority ? { priority } : {}),
      updated_at: nowIso(),
    };
    const { data, error } = await db.from("tickets").update(payload).eq("id", req.params.ticketId).select("*").single();
    if (error) throw error;
    res.json({ success: true, ticket: mapTicket(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update ticket", details: error.message });
  }
});

app.get("/api/referrals/me", async (req, res) => {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    res.json({ referrals: 0, conversions: 0, rewards: 0 });
    return;
  }
  try {
    const { data, error } = await db.from("referrals").select("*").eq("referrer_id", userId);
    if (error) throw error;
    const referrals = data || [];
    const conversions = referrals.filter((ref) => ref.status === "converted" || ref.status === "paid").length;
    const rewards = referrals
      .filter((ref) => ref.status === "converted" || ref.status === "paid")
      .reduce((sum, ref) => sum + Number(ref.credit_amount || 0), 0);
    res.json({ referrals: referrals.length, conversions, rewards, referralList: referrals });
  } catch (error) {
    res.status(500).json({ referrals: 0, conversions: 0, rewards: 0, error: error.message });
  }
});

app.post("/api/referrals/click", async (req, res) => {
  const { referralCode, source } = req.body || {};
  if (!referralCode) {
    res.status(400).json({ tracked: false, error: "referralCode is required" });
    return;
  }
  try {
    await db.from("referral_clicks").insert({
      referral_code: String(referralCode).toUpperCase(),
      source: source || "web",
      clicked_at: nowIso(),
    });
    res.json({ tracked: true });
  } catch {
    res.json({ tracked: true });
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
      .update({ status: "converted", converted_at: nowIso() })
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
      created_at: nowIso(),
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
    const payload = { ...req.body, updated_at: nowIso() };
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

app.post("/api/admin/deals", async (req, res) => {
  try {
    const { data, error } = await db.from("deals").insert(req.body).select("*").single();
    if (error) throw error;
    res.json({ success: true, deal: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put("/api/admin/deals/:dealId", async (req, res) => {
  try {
    const { data, error } = await db.from("deals").update(req.body).eq("id", req.params.dealId).select("*").single();
    if (error) throw error;
    res.json({ success: true, deal: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/admin/deals/:dealId", async (req, res) => {
  try {
    const { error } = await db.from("deals").delete().eq("id", req.params.dealId);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`PerksNest backend API running on port ${PORT}`);
});
