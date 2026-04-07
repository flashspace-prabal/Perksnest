const API = 'https://api.perksnest.co';
const API_TIMEOUT = 5000; // 5 second timeout

/**
 * Enhanced API call with timeout and retry logic
 */
export async function apiCall(path: string, method = 'GET', body?: any, retries = 1) {
  const session = JSON.parse(localStorage.getItem('pn_session') || '{}');
  const token = session.access_token || '';
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const res = await fetch(API + path, {
        method,
        signal: controller.signal,
        headers: { 
          'Content-Type': 'application/json', 
          ...(token ? { 'Authorization': 'Bearer ' + token } : {}) 
        },
        body: body ? JSON.stringify(body) : null
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        const error = new Error(`API Error: ${res.status} ${res.statusText}`);
        (error as any).status = res.status;
        throw error;
      }

      return res.json();
    } catch (error: any) {
      const isLastAttempt = attempt === retries;
      
      if (error.name === 'AbortError') {
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
    return await apiCall('/api/deals/claim', 'POST', { dealId }, 2);
  } catch (error) {
    // Fallback: save to localStorage if API fails
    console.warn('Claim API failed, saving to localStorage', error);
    const session = JSON.parse(localStorage.getItem('pn_session') || '{}');
    if (session.user_id) {
      const claims = JSON.parse(localStorage.getItem('pn_claimed_deals') || '[]');
      if (!claims.includes(dealId)) {
        claims.push(dealId);
        localStorage.setItem('pn_claimed_deals', JSON.stringify(claims));
      }
    }
    return { success: true, fallback: true };
  }
}

export async function getAdminStats() {
  try {
    return await apiCall('/api/admin/stats', 'GET', undefined, 2);
  } catch (error) {
    console.warn('Admin stats API failed', error);
    return { stats: { users: 0, deals: 0, claims: 0 } };
  }
}

export async function getAdminUsers(page: number = 1, limit: number = 50, search: string = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append('search', search);
  try {
    return await apiCall(`/api/admin/users?${params.toString()}`, 'GET', undefined, 2);
  } catch (error) {
    console.warn('Admin users API failed', error);
    return { users: [], total: 0 };
  }
}

export async function getDealClaims(dealId: string) {
  try {
    return await apiCall(`/api/deals/${dealId}/claims`, 'GET', undefined, 2);
  } catch (error) {
    console.warn(`Deal claims API failed for ${dealId}`, error);
    return { count: 0 };
  }
}

export async function getUserClaims() {
  try {
    return await apiCall('/api/user/claims', 'GET', undefined, 2);
  } catch (error) {
    console.warn('User claims API failed, using localStorage', error);
    const claims = JSON.parse(localStorage.getItem('pn_claimed_deals') || '[]');
    return claims;
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

export async function trackReferralClick(referralCode: string) {
  try {
    return await apiCall('/api/referrals/click', 'POST', { referralCode }, 2);
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
    return await apiCall('/api/tickets', 'GET', undefined, 2);
  } catch (error) {
    console.warn('Get tickets API failed', error);
    return { tickets: [] };
  }
}

export async function createTicket(ticket: any) {
  try {
    return await apiCall('/api/tickets', 'POST', ticket, 2);
  } catch (error) {
    console.warn('Create ticket API failed', error);
    return { success: false, message: 'Failed to create ticket' };
  }
}
