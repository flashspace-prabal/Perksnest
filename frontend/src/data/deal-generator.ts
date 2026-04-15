/**
 * Utility Helper: Deal Data Generator
 * Quickly generate deal data for new products from minimal input
 * Useful for bulk creating deal pages
 */

import { ComprehensiveDealDetail, Feature, FAQItem, PricingPlan, Review, Alternative, PopularDeal, Resource } from "@/data/deal-details-schema";

interface DealInput {
  id: string;
  name: string;
  logo: string;
  rating?: number;
  reviewCount?: number;
  memberCount?: number;
  
  // Quick input for automation
  savings: string;
  headline: string;
  shortDescription: string;
  overview: string;
  
  // Optional detailed sections
  features?: Feature[];
  faq?: FAQItem[];
  pricing?: PricingPlan[];
  reviews?: Review[];
  alternatives?: Alternative[];
  relatedDeals?: PopularDeal[];
  resources?: Resource[];
}

/**
 * Generate default sections for a minimal deal input
 * Useful for quick deal creation
 */
export function generateComprehensiveDeal(input: DealInput): ComprehensiveDealDetail {
  const isSaaS = true; // Adjust based on product type
  
  return {
    id: input.id,
    name: input.name,
    logo: input.logo,
    rating: input.rating || 4.5,
    reviewCount: input.reviewCount || 50,
    memberCount: input.memberCount || 1000,

    // Hero Section
    title: `${input.name} Deal`,
    subtitle: input.headline,
    shortDescription: input.shortDescription,
    dealHighlight: {
      savings: input.savings,
      headline: input.headline,
    },

    socialProof: {
      redeemedCount: input.memberCount || 1000,
      avatars: [
        `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
        `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50)}.jpg`,
        `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50 + 50)}.jpg`,
      ],
    },

    // Deal Section
    deals: {
      title: `${input.name} Deal: ${input.headline}`,
      explanation: `To activate your ${input.name} discount, sign up through our exclusive link. Verify your account within 7 days and the discount will be automatically applied.`,
      howCanBenefit: `This exclusive offer helps you save ${input.savings} on ${input.name}. Perfect for startups looking to optimize their tech stack without expensive licensing. Start with this deal and scale as your business grows.`,
      whyChooseThis: `${input.name} is trusted by thousands of teams worldwide. With a ${input.rating}/5 rating and ${input.reviewCount} verified reviews, it's the perfect choice for teams looking to streamline operations and improve productivity.`,
    },

    // General Section
    general: {
      overview: input.overview,
      useCases: generateDefaultUseCases(input.name),
      features: input.features || generateDefaultFeatures(input.name),
      technicalInfo: `Enterprise-grade security with SOC 2 Type II certification. 99.99% uptime SLA. All data encrypted in transit and at rest using industry-standard encryption.`,
    },

    // Eligibility
    eligibility: {
      requirements: [
        `Startup or established company`,
        `Not currently using ${input.name}`,
        `Sign up through the provided link`,
        `Verify within 7 days for discount activation`,
      ],
      limitations: [
        `Offer limited to new users only`,
        `Cannot be combined with other promotions`,
        `Discount applied for 12 months`,
        `Standard pricing applies after discount period`,
      ],
      applicationProcess: `1. Click 'Get Deal'. 2. Sign up for ${input.name}. 3. Verify your email. 4. Discount automatically applied. 5. Start using immediately!`,
      contactEmail: `support@${input.name.toLowerCase().replace(/\\s+/g, '')}.com`,
    },

    // FAQ
    faq: input.faq || generateDefaultFAQ(input.name),

    // Pricing
    pricing: {
      description: `Transparent, flexible pricing for teams of all sizes.`,
      plans: input.pricing || generateDefaultPricing(input.name),
    },

    // Features
    features: input.features || generateDefaultFeatures(input.name),

    // Reviews
    reviews: input.reviews || generateDefaultReviews(input.name),

    // Alternatives
    alternatives: input.alternatives || [],

    // Related Deals
    relatedDeals: input.relatedDeals || [],

    // Resources
    resources: input.resources || generateDefaultResources(input.name),

    // SEO
    seoKeywords: [
      `${input.name} deal`,
      `${input.name} discount`,
      `${input.name} promo code`,
      `startup deals`,
    ],
    seoDescription: `Get exclusive ${input.name} deal - ${input.headline}. Save ${input.savings} with our marketplace exclusive offer.`,
  };
}

// Helper functions for generating default content
function generateDefaultUseCases(productName: string): string[] {
  return [
    `Team collaboration`,
    `Project management`,
    `Data organization`,
    `Workflow automation`,
    `Reporting and analytics`,
    `Document management`,
  ];
}

function generateDefaultFeatures(productName: string): Feature[] {
  return [
    {
      id: "f1",
      icon: "Zap",
      title: "Lightning Fast Performance",
      description: `${productName} delivers exceptional speed and reliability for all your needs.`,
    },
    {
      id: "f2",
      icon: "Shield",
      title: "Enterprise Security",
      description: `Bank-grade security with encryption, compliance certifications, and advanced access controls.`,
    },
    {
      id: "f3",
      icon: "Users",
      title: "Seamless Collaboration",
      description: `Work together in real-time with your team using ${productName}'s collaboration tools.`,
    },
    {
      id: "f4",
      icon: "Zap",
      title: "Developer Friendly",
      description: `Powerful APIs and comprehensive SDKs for custom integrations and extensions.`,
    },
  ];
}

function generateDefaultFAQ(productName: string): FAQItem[] {
  return [
    {
      id: "faq-1",
      question: `How do I get started with ${productName}?`,
      answer: `Getting started is easy! Click 'Get Deal', sign up with your email, verify your account within 7 days, and the discount will be automatically applied. You'll have full access to all features immediately.`,
    },
    {
      id: "faq-2",
      question: `Can I use this deal if I already have an account?`,
      answer: `This deal is typically limited to new users. If you already have an account, contact our support team to see if we can help you access promotional offers.`,
    },
    {
      id: "faq-3",
      question: `Is there a credit card required?`,
      answer: `No credit card is required to start your trial or access the promotional offer. Setup is completely free to try.`,
    },
    {
      id: "faq-4",
      question: `What happens after the deal period expires?`,
      answer: `After the promotional period, you can choose to continue with standard pricing, downgrade to a free plan, or cancel anytime. No long-term commitment required.`,
    },
  ];
}

function generateDefaultPricing(productName: string): PricingPlan[] {
  return [
    {
      name: "Free",
      price: "$0",
      description: "Get started for free",
      features: [
        "Basic features included",
        "Limited to individual use",
        "Community support",
        "Upgrade anytime",
      ],
    },
    {
      name: "Pro",
      price: "$29",
      billingPeriod: "per month",
      description: "For growing teams",
      features: [
        "Everything in Free",
        "Team collaboration",
        "Advanced features",
        "Email support",
        "Custom integrations",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom contracts",
        "Advanced security",
        "SLA guarantee",
      ],
    },
  ];
}

function generateDefaultReviews(productName: string): Review[] {
  const reviewNames = [
    { author: "Sarah Chen", role: "Product Manager" },
    { author: "Marcus Johnson", role: "Founder" },
    { author: "Elena Rodriguez", role: "Operations Lead" },
  ];

  return reviewNames.map((user, idx) => ({
    id: `r${idx + 1}`,
    author: user.author,
    role: user.role,
    rating: 5,
    quote: `${productName} has been instrumental in improving our team's productivity and workflow. Highly recommended!`,
    date: `April ${15 - idx}, 2026`,
    avatar: `https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'women' : 'men'}/${Math.floor(Math.random() * 50)}.jpg`,
  }));
}

function generateDefaultResources(productName: string): Resource[] {
  return [
    {
      id: "r1",
      type: "guide",
      title: `Getting Started with ${productName}`,
      description: `Learn the basics and advanced features to get the most out of ${productName}.`,
      link: `https://${productName.toLowerCase().replace(/\\s+/g, '')}.com/guides`,
      date: "March 2026",
    },
    {
      id: "r2",
      type: "blog",
      title: `10 Pro Tips for Using ${productName} Effectively`,
      description: `Discover expert tips and best practices from successful ${productName} users.`,
      link: `https://${productName.toLowerCase().replace(/\\s+/g, '')}.com/blog/pro-tips`,
      date: "April 2026",
    },
    {
      id: "r3",
      type: "video",
      title: `${productName} Tutorial: Quick Start`,
      description: `Watch our video tutorial to get started with ${productName} in under 10 minutes.`,
      link: `https://youtube.com/watch?v=${productName.toLowerCase().replace(/\\s+/g, '')}`,
      date: "April 2026",
    },
  ];
}

export default {
  generateComprehensiveDeal,
};
