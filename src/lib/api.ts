const API = 'https://api.perksnest.co';
export async function apiCall(path: string, method='GET', body?: any) {
  const session = JSON.parse(localStorage.getItem('pn_session') || '{}');
  const token = session.access_token || '';
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? {'Authorization': 'Bearer ' + token} : {}) },
    body: body ? JSON.stringify(body) : null
  });
  return res.json();
}

export async function getAdminStats() {
  return apiCall('/api/admin/stats');
}

export async function getAdminUsers(page: number = 1, limit: number = 50, search: string = '') {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.append('search', search);
  return apiCall(`/api/admin/users?${params.toString()}`);
}

export async function claimDeal(dealId: string) {
  return apiCall('/api/deals/claim', 'POST', { dealId });
}

export async function getDealClaims(dealId: string) {
  return apiCall(`/api/deals/${dealId}/claims`);
}

export async function getUserClaims() {
  return apiCall('/api/user/claims');
}

export async function getReferralStats() {
  return apiCall('/api/referrals/me');
}

export async function trackReferralClick(referralCode: string) {
  return apiCall('/api/referrals/click', 'POST', { referralCode });
}

export async function convertReferral(referralCode: string) {
  return apiCall('/api/referrals/convert', 'POST', { referralCode });
}

export async function getTickets() {
  return apiCall('/api/tickets');
}

export async function createTicket(ticket: any) {
  return apiCall('/api/tickets', 'POST', ticket);
}
