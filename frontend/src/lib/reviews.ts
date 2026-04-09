import db from './supabase';

export interface Review {
  id: string;
  dealId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  helpful: number;
  createdAt: string;
}

export async function getReviewsForDeal(dealId: string): Promise<Review[]> {
  const { data } = await db.from('reviews').select('*')
    .eq('deal_id', dealId).order('created_at', { ascending: false });
  return (data || []).map((r: Record<string, unknown>) => ({
    id: r.id as string, dealId: r.deal_id as string, userId: r.user_id as string,
    userName: r.user_name as string, rating: r.rating as number,
    comment: r.comment as string, helpful: r.helpful as number,
    createdAt: r.created_at as string,
  }));
}

export async function addReview(dealId: string, userId: string, userName: string, rating: number, comment: string): Promise<Review | null> {
  const { data, error } = await db.from('reviews').upsert(
    { deal_id: dealId, user_id: userId, user_name: userName, rating, comment, helpful: 0 },
    { onConflict: 'deal_id,user_id' }
  ).select('*').single();
  if (error || !data) return null;
  return {
    id: data.id, dealId: data.deal_id, userId: data.user_id, userName: data.user_name,
    rating: data.rating, comment: data.comment, helpful: data.helpful, createdAt: data.created_at,
  };
}

export async function markReviewHelpful(reviewId: string): Promise<void> {
  const { data } = await db.from('reviews').select('helpful').eq('id', reviewId).single();
  if (data) {
    await db.from('reviews').update({ helpful: (data.helpful as number) + 1 }).eq('id', reviewId);
  }
}

export async function getAverageRating(dealId: string): Promise<number> {
  const reviews = await getReviewsForDeal(dealId);
  if (!reviews.length) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

// Sync helper for non-async usage (returns 0 initially, updates on re-render)
export function getAverageRatingSync(dealId: string): number {
  const cached = sessionStorage.getItem(`pn_avg_rating_${dealId}`);
  if (cached) return parseFloat(cached);
  // Fetch async and cache
  getAverageRating(dealId).then(avg => sessionStorage.setItem(`pn_avg_rating_${dealId}`, String(avg)));
  return 0;
}

// Backwards-compatible aliases
export const getReviews = getReviewsForDeal;
export const getUserReview = async (dealId: string, userId: string): Promise<Review | null> => {
  const reviews = await getReviewsForDeal(dealId);
  return reviews.find(r => r.userId === userId) || null;
};
export const markHelpful = markReviewHelpful;
