import { API_BASE_URL } from "@/lib/runtime";

const API = API_BASE_URL;
const API_TIMEOUT = 5000; // 5 second timeout

export interface ReferralEntry {
  code: string;
  referrerId: string;
  referrerName: string;
  referreeEmail: string;
  referreeId?: string;
  status: 'pending' | 'converted' | 'paid';
  creditAmount: number;
  createdAt: string;
  convertedAt?: string;
}

export interface ReferralSummary {
  referrals: ReferralEntry[];
  totalEarned: number;
  convertedCount: number;
  pendingCount: number;
  totalReferrals: number;
  totalClicks: number;
}

interface TicketEntry {
  id: string;
  subject: string;
  message: string;
  description: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  type: "billing" | "technical" | "general";
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}

function mapReferralEntry(row: Record<string, unknown>): ReferralEntry {
  return {
    code: String(row.code || ''),
    referrerId: String(row.referrerId || row.referrer_id || ''),
    referrerName: String(row.referrerName || row.referrer_name || 'User'),
    referreeEmail: String(row.referreeEmail || row.referree_email || ''),
    referreeId: row.referreeId ? String(row.referreeId) : row.referree_id ? String(row.referree_id) : undefined,
    status: (row.status as ReferralEntry['status']) || 'pending',
    creditAmount: Number(row.creditAmount || row.credit_amount || 0),
    createdAt: String(row.createdAt || row.created_at || new Date().toISOString()),
    convertedAt: row.convertedAt ? String(row.convertedAt) : row.converted_at ? String(row.converted_at) : undefined,
  };
}

function mapTicketEntry(row: Record<string, unknown>): TicketEntry {
  const createdAt = String(row.createdAt || row.created_at || new Date().toISOString());
  const updatedAt = String(row.updatedAt || row.updated_at || createdAt);

  return {
    id: String(row.id || ""),
    subject: String(row.subject || "Untitled ticket"),
    message: String(row.message || row.description || ""),
    description: String(row.description || row.message || ""),
    status: (row.status as TicketEntry["status"]) || "open",
    priority: (row.priority as TicketEntry["priority"]) || "medium",
    type: (row.type as TicketEntry["type"]) || "general",
    createdAt,
    updatedAt,
    created_at: createdAt,
    updated_at: updatedAt,
  };
}

/**
 * Enhanced API call with timeout and retry logic
 */
export async function apiCall(path: string, method = 'GET', body?: unknown, retries = 1) {
  const session = JSON.parse(localStorage.getItem('pn_session') || '{}');
  const token = session.access_token || '';
  const userId = localStorage.getItem('perksnest_user_id') || '';
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const res = await fetch(API + path, {
        method,
        signal: controller.signal,
        headers: { 
          'Content-Type': 'application/json', 
          ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
          ...(userId ? { 'x-user-id': userId } : {}),
        },
        body: body ? JSON.stringify(body) : null
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        let serverMessage = '';
        try {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const errorBody = await res.json();
            const rawMessage = errorBody?.error || errorBody?.message || errorBody;
            serverMessage = typeof rawMessage === 'string' ? rawMessage : JSON.stringify(rawMessage);
          } else {
            serverMessage = await res.text();
          }
        } catch {
          serverMessage = '';
        }

        const suffix = serverMessage ? ` - ${serverMessage}` : '';
        const error = new Error(`API Error: ${res.status} ${res.statusText}${suffix}`);
        (error as Error & { status?: number }).status = res.status;
        throw error;
      }

      return res.json();
    } catch (error: unknown) {
      const isLastAttempt = attempt === retries;
      const err = error as { name?: string };
      
      if (err.name === 'AbortError') {
        console.warn(`API timeout: ${method} ${path} (attempt ${attempt + 1})`);
      } else {
        console.error(`API call failed: ${method} ${path}`, error);
      }

      if (isLastAttempt) {
        throw error;
      }

      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Wrapper for claimDeal with fallback to localStorage
 */
export async function claimDeal(dealId: string) {
  try {
    console.log(`[API] Claiming deal: ${dealId}`);
    const response = await apiCall('/api/deals/claim', 'POST', { dealId }, 2);
    console.log(`[API] Claim response:`, response);
    return response;
  } catch (error) {
    // Fallback: save to localStorage if API fails
    console.warn('Claim API failed, saving to localStorage', error);
    const session = JSON.parse(localStorage.getItem('pn_session') || '{}');
    if (session.user_id) {
      const claims = JSON.parse(localStorage.getItem('pn_claimed_deals') || '[]');
      if (!claims.includes(dealId)) {
        claims.push(dealId);
        localStorage.setItem('pn_claimed_deals', JSON.stringify(claims));
        console.log('[API] Saved claim to localStorage fallback');
      }
    }
    return { success: true, fallback: true };
  }
}

export async function getAdminStats() {
  try {
    const response = await apiCall('/api/admin/stats', 'GET', undefined, 2);
    return response.stats || {};
  } catch (error) {
    console.warn('Admin stats API failed', error);
    return {};
  }
}

export async function getAdminUsers(page: number = 1, limit: number = 50, search: string = '', filters?: { role?: string; status?: string; plan?: string }) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append('search', search);
  if (filters?.role && filters.role !== 'all') params.append('role', filters.role);
  if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters?.plan && filters.plan !== 'all') params.append('plan', filters.plan);
  try {
    return await apiCall(`/api/admin/users?${params.toString()}`, 'GET', undefined, 2);
  } catch (error) {
    console.warn('Admin users API failed', error);
    return { users: [], total: 0 };
  }
}

export async function getDealClaims(dealId: string) {
  try {
    const result = await apiCall(`/api/deals/${dealId}/claims`, 'GET', undefined, 2);
    return result || { count: 0 };
  } catch (error) {
    console.warn(`Deal claims API failed for ${dealId}`, error);
    // Return empty claims gracefully - don't fail page load
    return { count: 0, fallback: true };
  }
}

export async function getUserClaims() {
  try {
    console.log('[API] Fetching user claims...');
    const response = await apiCall('/api/user/claims', 'GET', undefined, 2);
    console.log('[API] User claims response:', response);
    return response;
  } catch (error) {
    console.warn('User claims API failed, using localStorage', error);
    const claims = JSON.parse(localStorage.getItem('pn_claimed_deals') || '[]');
    return claims;
  }
}

/**
 * Refetch user's claimed deals from server and return the updated user object
 * Used after claiming a deal to update auth context
 */
export async function refetchUserClaimedDeals() {
  try {
    const response = await apiCall('/api/auth/me', 'GET', undefined, 2);
    return response?.user || null;
  } catch (error) {
    console.warn('Failed to refetch user claimed deals', error);
    return null;
  }
}

/**
 * Get current authenticated user
 * Used after payment to verify premium upgrade
 */
export async function getCurrentUser() {
  try {
    console.log('[API] Fetching current user...');
    const response = await apiCall('/api/auth/me', 'GET', undefined, 2);
    console.log('[API] Current user:', response);
    return response?.user || response || null;
  } catch (error) {
    console.warn('Failed to fetch current user', error);
    return null;
  }
}

// Deals API with fallback
export async function getAllDeals() {
  try {
    return await apiCall('/api/deals', 'GET', undefined, 2);
  } catch (error) {
    console.warn('Get deals API failed', error);
    return { deals: [] };
  }
}

export async function getDealById(dealId: string) {
  try {
    return await apiCall(`/api/deals/${dealId}`, 'GET', undefined, 2);
  } catch (error) {
    console.warn(`Get deal API failed for ${dealId}`, error);
    return null;
  }
}

export async function getReferralStats() {
  try {
    return await apiCall('/api/referrals/me', 'GET', undefined, 2);
  } catch (error) {
    console.warn('Referral stats API failed', error);
    return { referrals: 0, conversions: 0, rewards: 0 };
  }
}

export async function getReferralSummary() : Promise<ReferralSummary> {
  try {
    const response = await apiCall('/api/referrals', 'GET', undefined, 2);
    const referrals = Array.isArray(response.referrals) ? response.referrals.map((entry: Record<string, unknown>) => mapReferralEntry(entry)) : [];
    return {
      referrals,
      totalEarned: Number(response.referral_earnings || 0),
      convertedCount: Number(response.converted_referrals || 0),
      pendingCount: Number(response.pending_referrals || 0),
      totalReferrals: Number(response.total_referrals || referrals.length),
      totalClicks: Number(response.total_clicks || 0),
    };
  } catch (error) {
    console.warn('Referral summary API failed', error);
    return {
      referrals: [],
      totalEarned: 0,
      convertedCount: 0,
      pendingCount: 0,
      totalReferrals: 0,
      totalClicks: 0,
    };
  }
}

export async function createReferralInvite(email: string) {
  return apiCall('/api/referrals/invite', 'POST', { email }, 2);
}

export async function trackReferralClick(referral: string | { code: string; source?: string }) {
  const payload = typeof referral === 'string' ? { referralCode: referral } : { referralCode: referral.code, source: referral.source };
  try {
    return await apiCall('/api/referrals/click', 'POST', payload, 2);
  } catch (error) {
    console.warn('Track referral API failed', error);
    return { tracked: true };
  }
}

export async function convertReferral(referralCode: string) {
  try {
    return await apiCall('/api/referrals/convert', 'POST', { referralCode }, 2);
  } catch (error) {
    console.warn('Convert referral API failed', error);
    return { converted: true };
  }
}

export async function getTickets() {
  try {
    const response = await apiCall('/api/tickets', 'GET', undefined, 2);
    const tickets = Array.isArray(response.tickets)
      ? response.tickets.map((ticket: Record<string, unknown>) => mapTicketEntry(ticket))
      : [];

    return {
      ...response,
      tickets,
    };
  } catch (error) {
    console.warn('Get tickets API failed', error);
    return { tickets: [] };
  }
}

export async function createTicket(ticket: Record<string, unknown>) {
  try {
    return await apiCall('/api/tickets', 'POST', ticket, 2);
  } catch (error) {
    console.warn('Create ticket API failed', error);
    return { success: false, message: 'Failed to create ticket' };
  }
}

export async function getTicketById(ticketId: string) {
  return apiCall(`/api/tickets/${ticketId}`, 'GET', undefined, 2);
}

export async function replyToTicket(ticketId: string, message: string) {
  return apiCall(`/api/tickets/${ticketId}/reply`, 'POST', { message }, 2);
}

export async function closeTicket(ticketId: string) {
  return apiCall(`/api/tickets/${ticketId}/close`, 'PUT', undefined, 2);
}

export async function updateTicketStatus(ticketId: string, status: string) {
  return apiCall(`/api/tickets/${ticketId}/status`, 'PATCH', { status }, 2);
}

export async function updateAdminUser(userId: string, updates: Record<string, unknown>) {
  return apiCall(`/api/admin/users/${userId}`, 'PATCH', updates, 2);
}

export async function createAdminUser(payload: Record<string, unknown>) {
  return apiCall('/api/admin/users', 'POST', payload, 1);
}

export async function deleteAdminUser(userId: string) {
  return apiCall(`/api/admin/users/${userId}`, 'DELETE', undefined, 1);
}

export async function getAdminDeals() {
  try {
    return await apiCall('/api/admin/deals', 'GET', undefined, 2);
  } catch (error) {
    console.warn('Admin deals API failed', error);
    return { deals: [], partnerDeals: [] };
  }
}

export async function getAdminWhiteLabelClients() {
  try {
    return await apiCall('/api/admin/whitelabel/clients', 'GET', undefined, 2);
  } catch (error) {
    console.warn('Admin white-label clients API failed', error);
    return { clients: [] };
  }
}

export async function createAdminWhiteLabelClient(payload: Record<string, unknown>) {
  return apiCall('/api/admin/whitelabel/clients', 'POST', payload, 1);
}

export async function updateAdminWhiteLabelClient(clientId: string, payload: Record<string, unknown>) {
  return apiCall(`/api/admin/whitelabel/clients/${clientId}`, 'PATCH', payload, 1);
}

export async function deleteAdminWhiteLabelClient(clientId: string) {
  return apiCall(`/api/admin/whitelabel/clients/${clientId}`, 'DELETE', undefined, 1);
}

export async function createAdminDeal(payload: Record<string, unknown>) {
  return apiCall('/api/admin/deals', 'POST', payload, 1);
}

export async function updateAdminDeal(dealId: string, payload: Record<string, unknown>) {
  return apiCall(`/api/admin/deals/${dealId}`, 'PUT', payload, 1);
}

export async function deleteAdminDeal(dealId: string) {
  return apiCall(`/api/admin/deals/${dealId}`, 'DELETE', undefined, 1);
}

export async function updatePartnerDealStatusAdmin(dealId: string, status: 'approved' | 'rejected' | 'pending', rejectionReason?: string) {
  return apiCall(`/api/admin/partner-deals/${dealId}/status`, 'PATCH', { status, rejectionReason }, 1);
}

export async function requestPasswordReset(email: string) {
  return apiCall('/api/password-reset', 'POST', { email }, 1);
}

export async function getBookmarks() {
  return apiCall('/api/bookmarks', 'GET', undefined, 2);
}

export async function addBookmark(dealId: string) {
  return apiCall('/api/bookmarks', 'POST', { dealId }, 2);
}

export async function removeBookmark(dealId: string) {
  return apiCall(`/api/bookmarks/${dealId}`, 'DELETE', undefined, 2);
}

export async function getMessageThreads() {
  return apiCall('/api/messages/threads', 'GET', undefined, 2);
}

export async function getMessages(threadId: string) {
  return apiCall(`/api/messages?threadId=${encodeURIComponent(threadId)}`, 'GET', undefined, 2);
}

export async function sendMessage(threadId: string, content: string) {
  return apiCall('/api/messages', 'POST', { threadId, content }, 2);
}

export async function markMessagesRead(threadId: string) {
  return apiCall(`/api/messages/${encodeURIComponent(threadId)}/read`, 'PATCH', undefined, 2);
}

// Reviews API - Fetches customer reviews from Supabase
export async function getDealReviews(dealId: string) {
  try {
    const response = await apiCall(`/api/deals/${dealId}/reviews`, 'GET', undefined, 2);

    if (Array.isArray(response?.reviews)) {
      return { ...response, reviews: response.reviews };
    }

    if (Array.isArray(response?.review)) {
      return { ...response, reviews: response.review };
    }

    if (response?.review) {
      return { ...response, reviews: [response.review] };
    }

    return { ...response, reviews: [] };
  } catch (error) {
    console.warn(`Get reviews API failed for ${dealId}`, error);
    return { reviews: [], fallback: true };
  }
}

export async function getAllReviews() {
  try {
    return await apiCall('/api/deals/reviews', 'GET', undefined, 2);
  } catch (error) {
    console.warn('Get all reviews API failed', error);
    return { reviews: [], fallback: true };
  }
}

export async function submitContactMessage(payload: ContactMessagePayload) {
  return apiCall('/api/contact', 'POST', payload, 0);
}
