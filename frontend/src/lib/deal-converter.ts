/**
 * Utility to convert basic Deal data to Comprehensive Deal format
 * Used as fallback when comprehensive deal data is not available
 */

import { Deal } from "@/data/deals";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { isPremiumDeal } from "./deal-types";

export function convertBasicDealToComprehensive(basicDeal: Deal): ComprehensiveDealDetail {
  return {
    id: basicDeal.id,
    name: basicDeal.name,
    title: `${basicDeal.name} - ${basicDeal.dealText}`,
    subtitle: basicDeal.description?.substring(0, 100) || basicDeal.dealText,
    logo: basicDeal.logo,
    banner: basicDeal.logo,
    shortDescription: basicDeal.description || basicDeal.dealText,
    seoDescription: basicDeal.description,
    category: basicDeal.category,
    subcategory: basicDeal.subcategory,
    website: basicDeal.website || "",
    
    // Rating & Reviews
    rating: 4.5,
    reviewCount: basicDeal.memberCount || 1000,
    memberCount: basicDeal.memberCount || 1000,
    
    // Deal Highlight
    dealHighlight: {
      savings: basicDeal.savings,
      headline: basicDeal.dealText,
    },

    // Social Proof
    socialProof: {
      redeemedCount: basicDeal.memberCount || 1000,
      avatars: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=user3",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=user4",
      ],
      testimonialQuote: `This ${basicDeal.name} deal has been incredibly valuable for our team.`,
      testimonialAuthor: "Startup Founder",
      testimonialRole: "CEO",
    },

    // Deals Section
    deals: {
      title: `About ${basicDeal.name}`,
      explanation: basicDeal.description || `${basicDeal.name} helps businesses streamline operations and improve productivity. This exclusive deal provides significant savings and benefits for startups and growing teams.`,
      howCanIBenefit: [
        `Get ${basicDeal.savings} in savings with this exclusive deal`,
        "Perfect for startups looking to scale efficiently",
        "Industry-leading features and support included",
        "Quick setup and easy integration",
      ],
      whyChooseThis: [
        `${basicDeal.name} is trusted by thousands of companies worldwide`,
        "This deal offers exceptional value for teams getting started",
        "Proven track record of customer success",
        "Perfect for growing startups and enterprises",
      ],
    },

    // General Info
    general: {
      overview: basicDeal.description || `${basicDeal.name} is a leading platform for businesses seeking to improve operations and productivity.`,
      useCases: [
        "Startup operations",
        "Team collaboration",
        "Business efficiency",
        "Scaling operations",
      ],
      features: [
        {
          id: "1",
          icon: "✨",
          title: "Easy to Use",
          description: "Intuitive interface for quick adoption",
        },
        {
          id: "2",
          icon: "🔒",
          title: "Secure",
          description: "Enterprise-grade security",
        },
        {
          id: "3",
          icon: "⚡",
          title: "Fast",
          description: "Optimized performance",
        },
        {
          id: "4",
          icon: "🤝",
          title: "Integration",
          description: "Seamless integration",
        },
      ],
    },

    // Eligibility
    eligibility: {
      requirements: [
        "Active startup",
        "Valid business email",
      ],
    },

    // FAQ - Generic for all deals
    faq: [
      {
        id: "faq-1",
        question: "How do I get started?",
        answer: `${basicDeal.dealText} Follow the redemption steps to claim your deal.`,
      },
      {
        id: "faq-2",
        question: "How long is the deal valid?",
        answer: `This deal is valid until ${basicDeal.expiresAt || "2026-12-31"}.`,
      },
      {
        id: "faq-3",
        question: "Is there customer support?",
        answer: "Yes, you'll have access to standard customer support included with your plan.",
      },
      {
        id: "faq-4",
        question: "Can I cancel anytime?",
        answer: "Please check the terms of service for cancellation policies.",
      },
      {
        id: "faq-5",
        question: "Do I need a credit card?",
        answer: "Some plans may require a credit card, but many offer free trials without one.",
      },
    ],

    // Pricing - Generic structure
    pricing: {
      description: `Get ${basicDeal.savings} in savings with this exclusive deal`,
      plans: [
        {
          name: "Starter",
          price: "Free",
          description: "Perfect for getting started",
          features: [
            "Basic features",
            "Community support",
            "Limited usage",
          ],
        },
        {
          name: "Professional",
          price: "Special Deal",
          description: basicDeal.dealText,
          features: [
            "Advanced features",
            "Priority support",
            "Unlimited usage",
            "Custom integrations",
          ],
          highlighted: true,
        },
      ],
    },

    // Features - Generic set
    features: [
      {
        id: "f1",
        icon: "✨",
        title: "Easy to Use",
        description: "Intuitive interface designed for quick adoption",
      },
      {
        id: "f2",
        icon: "🔒",
        title: "Secure",
        description: "Enterprise-grade security and compliance",
      },
      {
        id: "f3",
        icon: "⚡",
        title: "Fast",
        description: "Optimized performance and reliability",
      },
      {
        id: "f4",
        icon: "🤝",
        title: "Integration",
        description: "Seamless integration with your existing tools",
      },
    ],

    // Reviews - Generic template
    reviews: [
      {
        id: "review-1",
        author: "Alex Chen",
        role: "Founder",
        rating: 5,
        quote: "This product has transformed how we work. Highly recommended!",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alexchen`,
        date: "2026-03-15",
      },
      {
        id: "review-2",
        author: "Sarah Johnson",
        role: "Product Manager",
        rating: 5,
        quote: "Best decision we made for our team. The support is incredible.",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=sarahjohnson`,
        date: "2026-03-10",
      },
      {
        id: "review-3",
        author: "Mike Garcia",
        role: "CTO",
        rating: 4,
        quote: "Powerful tool with great features. Learning curve was smooth.",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=mikegarcia`,
        date: "2026-03-05",
      },
      {
        id: "review-4",
        author: "Emma Davis",
        role: "Operations Lead",
        rating: 5,
        quote: "The deal we got makes this an absolute steal. Amazing value!",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=emmadavis`,
        date: "2026-02-28",
      },
      {
        id: "review-5",
        author: "James Wilson",
        role: "Startup Founder",
        rating: 5,
        quote: "This tool scaled with us from day one. Couldn't imagine using anything else.",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=jameswilson`,
        date: "2026-02-20",
      },
    ],

    // Alternatives - Generic
    alternatives: [
      {
        id: "alt-1",
        name: "Alternative 1",
        logo: basicDeal.logo,
        tagline: "Complementary tool",
        pros: ["Feature A", "Feature B", "Feature C"],
        savings: "20% off",
      },
      {
        id: "alt-2",
        name: "Alternative 2",
        logo: basicDeal.logo,
        tagline: "Similar platform",
        pros: ["Feature X", "Feature Y", "Feature Z"],
        savings: "3 months free",
      },
      {
        id: "alt-3",
        name: "Alternative 3",
        logo: basicDeal.logo,
        tagline: "Another option",
        pros: ["Feature 1", "Feature 2", "Feature 3"],
        savings: "Special pricing",
      },
    ],

    // Related Deals
    relatedDeals: [
      {
        id: "related-1",
        name: "Related Solution 1",
        logo: basicDeal.logo,
        dealText: "Exclusive offer",
        savings: "20% off",
        memberCount: 5000,
      },
      {
        id: "related-2",
        name: "Related Solution 2",
        logo: basicDeal.logo,
        dealText: "Limited time",
        savings: "3 months free",
        memberCount: 3000,
      },
      {
        id: "related-3",
        name: "Related Solution 3",
        logo: basicDeal.logo,
        dealText: "Startup friendly",
        savings: "Special pricing",
        memberCount: 4500,
      },
    ],

    // Resources are intentionally empty here until a deal has vetted,
    // product-specific official docs or guides. We never fall back to the
    // main website or placeholder links.
    resources: [],

    // Metadata
    isFeatured: basicDeal.featured || false,
    isPremium: basicDeal.isPremium || isPremiumDeal(basicDeal.id),
    isFree: basicDeal.isFree || false,
    isPick: basicDeal.isPick || false,
  };
}
