// store.ts — Supabase-backed data store with localStorage fallback
import db from './supabase';

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface PartnerDeal {
  id: string; partnerId: string; partnerName: string;
  name: string; description: string; dealText: string;
  savings: string; category: string; websiteUrl: string;
  logoUrl: string; promoCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string; createdAt: string; approvedAt?: string;
  views: number; claims: number;
}

export interface Bookmark { userId: string; dealIds: string[]; }
export interface Notification {
  id: string; userId: string; type: string;
  title: string; message: string; read: boolean; createdAt: string;
}
export interface Message {
  id: string; threadId: string; senderId: string; senderName: string;
  senderRole: string; content: string; createdAt: string;
}
export interface ClaimEvent {
  id: string; userId: string; dealId: string;
  promoCode?: string; claimedAt: string;
}
export interface ReferralEntry {
  code: string; referrerId: string; referrerName: string;
  referreeEmail: string; referreeId?: string;
  status: 'pending' | 'converted' | 'paid';
  creditAmount: number; createdAt: string; convertedAt?: string;
}
export interface DigestSubscriber {
  email: string; name?: string; subscribedAt: string;
  frequency: 'weekly' | 'monthly';
}
export interface WLClient {
  id: string; name: string; subdomain: string; logoUrl?: string;
  primaryColor: string; status: string; plan: string;
  mrr: number; members: number; createdAt: string;
}

// ─── BOOKMARKS ────────────────────────────────────────────────────────────────
export async function getBookmarkedDealIds(userId: string): Promise<string[]> {
  const { data } = await db.from('bookmarks').select('deal_id').eq('user_id', userId);
  return (data || []).map((r: { deal_id: string }) => r.deal_id);
}

export async function toggleBookmark(dealId: string, userId: string): Promise<boolean> {
  const { data: existing } = await db
    .from('bookmarks').select('id').eq('user_id', userId).eq('deal_id', dealId).single();

  if (existing) {
    await db.from('bookmarks').delete().eq('user_id', userId).eq('deal_id', dealId);
    return false;
  } else {
    await db.from('bookmarks').insert({ user_id: userId, deal_id: dealId });
    return true;
  }
}

// Sync helper: returns bookmarks for non-async contexts (falls back to localStorage)
export function getBookmarks(): { userId: string; dealIds: string[] } {
  try { return JSON.parse(localStorage.getItem('pn_bookmarks') || '{"userId":"","dealIds":[]}'); }
  catch { return { userId: '', dealIds: [] }; }
}

// ─── UPVOTES ──────────────────────────────────────────────────────────────────
// Keep upvotes in localStorage for instant UI response + sync to DB in background
function getUpvoteStore(): Record<string, string[]> {
  try { return JSON.parse(localStorage.getItem('pn_upvotes') || '{}'); } catch { return {}; }
}

export function toggleUpvote(dealId: string, userId: string): boolean {
  const store = getUpvoteStore();
  const voters = store[dealId] || [];
  const already = voters.includes(userId);
  store[dealId] = already ? voters.filter(id => id !== userId) : [...voters, userId];
  localStorage.setItem('pn_upvotes', JSON.stringify(store));

  // Sync to Supabase in background
  if (already) {
    db.from('upvotes').delete().eq('deal_id', dealId).eq('user_id', userId).then(() => {});
  } else {
    db.from('upvotes').upsert({ deal_id: dealId, user_id: userId }, { onConflict: 'deal_id,user_id' }).then(() => {});
  }

  return !already;
}

export function getUpvoteCount(dealId: string): number {
  return (getUpvoteStore()[dealId] || []).length;
}

export function hasUpvoted(dealId: string, userId: string): boolean {
  return (getUpvoteStore()[dealId] || []).includes(userId);
}

// Sync upvotes from DB on load
export async function syncUpvotesFromDB(): Promise<void> {
  const { data } = await db.from('upvotes').select('deal_id, user_id');
  if (!data) return;
  const store: Record<string, string[]> = {};
  data.forEach((r: { deal_id: string; user_id: string }) => {
    if (!store[r.deal_id]) store[r.deal_id] = [];
    store[r.deal_id].push(r.user_id);
  });
  localStorage.setItem('pn_upvotes', JSON.stringify(store));
}

// ─── PARTNER DEALS ────────────────────────────────────────────────────────────
export async function getPartnerDeals(): Promise<PartnerDeal[]> {
  const { data } = await db.from('partner_deals').select('*').order('created_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string, partnerId: r.partner_id as string, partnerName: r.partner_name as string,
    name: r.name as string, description: r.description as string, dealText: r.deal_text as string,
    savings: r.savings as string, category: r.category as string, websiteUrl: r.website_url as string,
    logoUrl: r.logo_url as string, promoCode: r.promo_code as string | undefined,
    status: r.status as PartnerDeal['status'], rejectionReason: r.rejection_reason as string | undefined,
    createdAt: r.created_at as string, approvedAt: r.approved_at as string | undefined,
    views: r.views as number, claims: r.claims as number,
  }));
}

export async function submitPartnerDeal(deal: Omit<PartnerDeal, 'id' | 'createdAt' | 'approvedAt' | 'views' | 'claims'>): Promise<string | null> {
  const { data, error } = await db.from('partner_deals').insert({
    partner_id: deal.partnerId, partner_name: deal.partnerName,
    name: deal.name, description: deal.description, deal_text: deal.dealText,
    savings: deal.savings, category: deal.category, website_url: deal.websiteUrl,
    logo_url: deal.logoUrl, promo_code: deal.promoCode, status: 'pending',
  }).select('id').single();
  return error ? null : (data?.id as string);
}

export async function updatePartnerDealStatus(
  id: string, status: 'approved' | 'rejected', rejectionReason?: string
): Promise<void> {
  await db.from('partner_deals').update({
    status,
    rejection_reason: rejectionReason || null,
    approved_at: status === 'approved' ? new Date().toISOString() : null,
  }).eq('id', id);
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data } = await db.from('notifications').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false }).limit(50);
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string, userId: r.user_id as string, type: r.type as string,
    title: r.title as string, message: r.message as string,
    read: r.read as boolean, createdAt: r.created_at as string,
  }));
}

export async function markNotificationRead(id: string): Promise<void> {
  await db.from('notifications').update({ read: true }).eq('id', id);
}

export async function addNotification(userId: string, type: string, title: string, message: string): Promise<void> {
  await db.from('notifications').insert({ user_id: userId, type, title, message, read: false });
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────
export async function getMessages(threadId: string): Promise<Message[]> {
  const { data } = await db.from('messages').select('*')
    .eq('thread_id', threadId).order('created_at', { ascending: true });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string, threadId: r.thread_id as string,
    senderId: r.sender_id as string, senderName: r.sender_name as string,
    senderRole: r.sender_role as string, content: r.content as string,
    createdAt: r.created_at as string,
  }));
}

export async function sendMessage(args: {threadId: string; senderId: string; senderName: string; senderRole: string; recipientId?: string; content: string; subject?: string} | string, senderId?: string, senderName?: string, senderRole?: string, content?: string): Promise<void> {
  // Support both object and positional arg forms
  const a = typeof args === 'object' ? args : {threadId: args, senderId: senderId!, senderName: senderName!, senderRole: senderRole!, content: content!};
  await db.from('messages').insert({ thread_id: a.threadId, sender_id: a.senderId, sender_name: a.senderName, sender_role: a.senderRole, content: a.content });
}

// ─── REFERRALS ────────────────────────────────────────────────────────────────
export async function getReferralsByUser(userId: string): Promise<ReferralEntry[]> {
  const { data } = await db.from('referrals').select('*').eq('referrer_id', userId);
  return (data || []).map((r: Record<string, unknown>) => ({
    code: r.code as string, referrerId: r.referrer_id as string,
    referrerName: r.referrer_name as string, referreeEmail: r.referree_email as string,
    referreeId: r.referree_id as string | undefined,
    status: r.status as ReferralEntry['status'],
    creditAmount: r.credit_amount as number,
    createdAt: r.created_at as string, convertedAt: r.converted_at as string | undefined,
  }));
}

export async function trackReferral(code: string, referrerId: string, referrerName: string, referreeEmail: string): Promise<void> {
  await db.from('referrals').upsert(
    { code, referrer_id: referrerId, referrer_name: referrerName, referree_email: referreeEmail, status: 'pending', credit_amount: 20 },
    { onConflict: 'referree_email' }
  );
}

export async function convertReferral(referreeEmail: string, referreeId: string): Promise<void> {
  await db.from('referrals').update({
    status: 'converted', referree_id: referreeId, converted_at: new Date().toISOString()
  }).eq('referree_email', referreeEmail);
}

// Sync helper for non-async (localStorage fallback for legacy usage)
export function getReferrals(): ReferralEntry[] {
  try { return JSON.parse(localStorage.getItem('pn_referrals') || '[]'); } catch { return []; }
}

// ─── DIGEST SUBSCRIBERS ───────────────────────────────────────────────────────
export async function subscribeToDigestDB(email: string, name?: string, frequency: 'weekly' | 'monthly' = 'weekly'): Promise<boolean> {
  const { error } = await db.from('digest_subscribers').upsert(
    { email, name, frequency, active: true },
    { onConflict: 'email' }
  );
  return !error;
}

// Sync wrapper that also updates localStorage for immediate UI feedback
export function subscribeToDigest(email: string, name?: string, frequency: 'weekly' | 'monthly' = 'weekly'): boolean {
  const subs: DigestSubscriber[] = JSON.parse(localStorage.getItem('pn_digest_subscribers') || '[]');
  if (subs.find(s => s.email === email)) return false;
  subs.push({ email, name, subscribedAt: new Date().toISOString(), frequency });
  localStorage.setItem('pn_digest_subscribers', JSON.stringify(subs));
  // Async sync to DB
  subscribeToDigestDB(email, name, frequency).catch(() => {});
  return true;
}

export function getDigestSubscribers(): DigestSubscriber[] {
  try { return JSON.parse(localStorage.getItem('pn_digest_subscribers') || '[]'); } catch { return []; }
}

// ─── CLAIM EVENTS ─────────────────────────────────────────────────────────────
export async function getClaimEvents(userId?: string): Promise<ClaimEvent[]> {
  let query = db.from('claim_events').select('*');
  if (userId) query = query.eq('user_id', userId);
  const { data } = await query.order('claimed_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string, userId: r.user_id as string, dealId: r.deal_id as string,
    promoCode: r.promo_code as string | undefined, claimedAt: r.claimed_at as string,
  }));
}

// ─── DEAL VIEWS ───────────────────────────────────────────────────────────────
export async function trackDealView(dealId: string, userId?: string): Promise<void> {
  await db.from('deal_views').insert({ deal_id: dealId, user_id: userId || null });
}

export async function getDealViewCount(dealId: string): Promise<number> {
  const { count } = await db.from('deal_views').select('*', { count: 'exact', head: true }).eq('deal_id', dealId);
  return count || 0;
}

// ─── WHITE LABEL CLIENTS ─────────────────────────────────────────────────────
export async function getWLClients(): Promise<WLClient[]> {
  const { data } = await db.from('wl_clients').select('*').order('created_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string, name: r.name as string, subdomain: r.subdomain as string,
    logoUrl: r.logo_url as string | undefined, primaryColor: r.primary_color as string,
    status: r.status as string, plan: r.plan as string,
    mrr: r.mrr as number, members: r.members as number, createdAt: r.created_at as string,
  }));
}

// ─── EMAIL ────────────────────────────────────────────────────────────────────
export async function sendEmail(type: string, to: string, name: string, dealName?: string, promoCode?: string): Promise<void> {
  try {
    await fetch('https://api.perksnest.co/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, to, name, dealName, promoCode }),
    });
  } catch {}
}

// ─── ADMIN SETTINGS (localStorage — non-sensitive UI prefs) ──────────────────
export function getAdminSettings() {
  try { return JSON.parse(localStorage.getItem('pn_admin_settings') || 'null') || {}; } catch { return {}; }
}
export function saveAdminSettings(settings: Record<string, unknown>) {
  localStorage.setItem('pn_admin_settings', JSON.stringify(settings));
}

export function getPartnerSettings(partnerId: string) {
  try {
    const all = JSON.parse(localStorage.getItem('pn_partner_settings') || '{}');
    return all[partnerId] || {};
  } catch { return {}; }
}
export function savePartnerSettings(partnerId: string, settings: Record<string, unknown>) {
  const all = JSON.parse(localStorage.getItem('pn_partner_settings') || '{}');
  all[partnerId] = settings;
  localStorage.setItem('pn_partner_settings', JSON.stringify(all));
}

export const updatePartnerDeal = updatePartnerDealStatus;

export async function updatePartnerDealFields(
  id: string, fields: Partial<{name: string, description: string, dealText: string, savings: string, category: string, websiteUrl: string, logoUrl: string, promoCode: string}>
): Promise<void> {
  const mapped: Record<string, unknown> = {};
  if (fields.name) mapped.name = fields.name;
  if (fields.description) mapped.description = fields.description;
  if (fields.dealText) mapped.deal_text = fields.dealText;
  if (fields.savings) mapped.savings = fields.savings;
  if (fields.category) mapped.category = fields.category;
  if (fields.websiteUrl) mapped.website_url = fields.websiteUrl;
  if (fields.logoUrl !== undefined) mapped.logo_url = fields.logoUrl;
  if (fields.promoCode !== undefined) mapped.promo_code = fields.promoCode;
  await db.from('partner_deals').update(mapped).eq('id', id);
}


export const addPartnerDeal = submitPartnerDeal;

export const getMessageThread = getMessages;

export const saveMessageThread = async (threadId: string, msgs: Message[]) => { /* deprecated - use sendMessage instead */ };

export const markAllNotificationsRead = async (userId: string) => { await db.from('notifications').update({ read: true }).eq('user_id', userId); };

export async function getThreadList(userId: string, role: string): Promise<{threadId: string; lastMessage: string; senderName: string; unread: number; updatedAt: string}[]> {
  const { data } = await db.from('messages').select('*').order('created_at', { ascending: false });
  const msgs = (data || []) as any[];
  const filtered = role === 'admin' ? msgs : msgs.filter((m: any) => m.thread_id === `${role}_${userId}_admin`);
  const threads = new Map<string, any>();
  filtered.forEach((m: any) => {
    if (!threads.has(m.thread_id)) {
      threads.set(m.thread_id, { threadId: m.thread_id, lastMessage: m.content, senderName: m.sender_name, unread: 0, updatedAt: m.created_at });
    }
    if (!m.read && m.sender_role !== role) threads.get(m.thread_id).unread++;
  });
  return Array.from(threads.values());
}

export async function markThreadRead(threadId: string, readerRole: string): Promise<void> {
  await db.from('messages').update({ read: true }).eq('thread_id', threadId).neq('sender_role', readerRole);
}
