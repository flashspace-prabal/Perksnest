export interface Review {
  id: string;
  dealId: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
  helpful: number;
}

const REVIEWS_KEY = 'pn_reviews';

// Initialize with seed data
const seedReviews: Review[] = [
  {
    id: 'r1',
    dealId: 'notion',
    userId: 'u1',
    userName: 'John Davis',
    rating: 5,
    text: 'Notion has completely transformed how our startup manages documentation and project workflows. The discount made it a no-brainer for our team. Highly recommend!',
    createdAt: new Date('2024-01-15').toISOString(),
    helpful: 12
  },
  {
    id: 'r2',
    dealId: 'notion',
    userId: 'u2',
    userName: 'Sarah Thompson',
    rating: 4,
    text: 'Great tool for collaboration. The learning curve was a bit steep at first, but the savings were substantial and the platform is incredibly powerful once you get the hang of it.',
    createdAt: new Date('2024-01-20').toISOString(),
    helpful: 8
  },
  {
    id: 'r3',
    dealId: 'stripe',
    userId: 'u3',
    userName: 'Michael Chen',
    rating: 5,
    text: 'Stripe is the gold standard for payment processing. This deal saved us thousands in processing fees during our critical early growth phase. Essential for any SaaS startup.',
    createdAt: new Date('2024-01-18').toISOString(),
    helpful: 15
  },
  {
    id: 'r4',
    dealId: 'stripe',
    userId: 'u4',
    userName: 'Emily Rodriguez',
    rating: 5,
    text: 'Integration was seamless and the fee waiver on our first $50K was incredibly valuable. Support team is responsive and the documentation is excellent.',
    createdAt: new Date('2024-01-22').toISOString(),
    helpful: 9
  }
];

function initializeReviews() {
  const existing = localStorage.getItem(REVIEWS_KEY);
  if (!existing) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(seedReviews));
    return seedReviews;
  }
  return JSON.parse(existing);
}

export function getReviews(dealId: string): Review[] {
  const allReviews = initializeReviews();
  return allReviews.filter((r: Review) => r.dealId === dealId)
    .sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAverageRating(dealId: string): number | null {
  const reviews = getReviews(dealId);
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
}

export function getUserReview(dealId: string, userId: string): Review | null {
  const allReviews = initializeReviews();
  return allReviews.find((r: Review) => r.dealId === dealId && r.userId === userId) || null;
}

export function addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Review {
  const allReviews = initializeReviews();
  const newReview: Review = {
    ...review,
    id: `r${Date.now()}`,
    createdAt: new Date().toISOString(),
    helpful: 0
  };
  allReviews.push(newReview);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
  return newReview;
}

export function markHelpful(reviewId: string): void {
  const allReviews = initializeReviews();
  const review = allReviews.find((r: Review) => r.id === reviewId);
  if (review) {
    review.helpful += 1;
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));
  }
}
