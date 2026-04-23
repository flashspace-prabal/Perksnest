/**
 * Comprehensive Deal Detail Page Schema
 * Defines all sections needed for production-grade product/deal pages
 * Matches the structure of https://www.joinsecret.com/stripe#stripe-coupon
 */

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  billingPeriod?: string; // e.g. "per month", "per year"
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface Feature {
  id: string;
  icon: string; // Lucide icon name
  title: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating: number;
  quote: string;
  date: string;
}

export interface Alternative {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  pros: string[];
  cons?: string[];
  savings?: string;
}

export interface PopularDeal {
  id: string;
  name: string;
  logo: string;
  dealText: string;
  savings: string;
  memberCount: number;
}

export interface Resource {
  id: string;
  type: string;
  title: string;
  description?: string;
  link?: string;
  url?: string;
  image?: string;
  date?: string;
  ctaLabel?: string;
}

export interface ComprehensiveDealDetail {
  // Basic Info
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  memberCount?: number;

  // Hero Section
  title: string;
  subtitle: string;
  shortDescription: string; // 1-2 lines
  dealHighlight: {
    savings: string;
    headline: string; // e.g. "Waived Stripe fees on your next $20,000"
  };
  socialProof: {
    redeemedCount?: number;
    avatars?: string[]; // Avatar URLs
    testimonialQuote?: string;
    testimonialAuthor?: string;
    testimonialRole?: string;
  };

  // Deal Section
  deals: {
    title: string;
    explanation: string;
    howCanBenefit?: string | string[];
    howCanIBenefit?: string[];
    whyChooseThis: string[];
  };

  // General Information
  general: {
    overview: string;
    useCases: string[];
    features: Feature[];
    technicalInfo?: string;
    website?: string;
  };

  // Eligibility
  eligibility: {
    requirements: string[];
    limitations?: string[];
    applicationProcess?: string;
    contactEmail?: string;
  };

  // FAQ
  faq: FAQItem[];

  // Pricing
  pricing: {
    description?: string;
    plans: PricingPlan[];
  };

  // Features
  features: Feature[];

  // Reviews
  reviews: Review[];

  // Alternatives/Competitors
  alternatives: Alternative[];

  // Related/Similar Deals
  relatedDeals: PopularDeal[];

  // Resources
  resources: Resource[];

  // SEO & Meta
  seoKeywords?: string[];
  seoDescription?: string;
  isPremium?: boolean;
}

/**
 * Default/sample data template for generating content
 */
export const DEFAULT_DEAL_TEMPLATE: Partial<ComprehensiveDealDetail> = {
  socialProof: {
    redeemedCount: 5000,
    avatars: [
      "https://randomuser.me/api/portraits/men/1.jpg",
      "https://randomuser.me/api/portraits/women/2.jpg",
      "https://randomuser.me/api/portraits/men/3.jpg",
    ],
  },
  general: {
    useCases: [],
    features: [],
  },
  eligibility: {
    requirements: [],
  },
  faq: [],
  pricing: {
    plans: [],
  },
  features: [],
  reviews: [],
  alternatives: [],
  relatedDeals: [],
  resources: [],
};
