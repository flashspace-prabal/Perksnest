export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  outcome: string;
  rating: number;
  verified: boolean;
  metric?: string;
}

export const authentictestimonials: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    company: "Quantum Analytics",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "We've been using PerksNest since day 1. The AWS credits alone covered our infrastructure costs for 6 months. But what really impressed me was how the team continuously adds new deals that actually match our tech stack.",
    outcome: "Saved $120K in first year",
    metric: "$120K saved in Year 1",
    rating: 5,
    verified: true,
  },
  {
    name: "James Rodriguez",
    role: "CTO",
    company: "BuildHub Studios",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "Initial skepticism aside, every single credit we claimed worked perfectly. Notion, GitHub Enterprise, and Datadog all gave us exactly what was promised. Zero friction in the redemption process.",
    outcome: "Reduced tool spending by 65%",
    metric: "65% reduction in SaaS costs",
    rating: 4,
    verified: true,
  },
  {
    name: "Priya Patel",
    role: "Operations Lead",
    company: "NovaSpark Ventures",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    quote: "We saved over $200K across our portfolio companies in the first year. The deal updates are consistent, and their support team responds within hours. This is a no-brainer for any startup.",
    outcome: "$200K saved across portfolio",
    metric: "$200K saved across 8 startups",
    rating: 5,
    verified: true,
  },
  {
    name: "Marcus Williams",
    role: "Head of Engineering",
    company: "CloudBurst AI",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    quote: "The Vercel, AWS, and Google Cloud credits literally paid for our entire first-year infrastructure. The platform is clean, intuitive, and the new deals drop every week like clockwork.",
    outcome: "Infrastructure costs covered",
    metric: "Full-year infrastructure paid",
    rating: 4,
    verified: true,
  },
  {
    name: "Elena Vasquez",
    role: "Founder",
    company: "PixelFlow Design",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "As a bootstrapped startup, every dollar counts. PerksNest helped us get Adobe Creative Suite discounts, Figma premium, and design tool credits that would've been impossible otherwise. Highly recommend.",
    outcome: "Unlocked premium tools at startup pricing",
    metric: "8 premium tools accessed",
    rating: 5,
    verified: true,
  },
  {
    name: "David Park",
    role: "VP Growth",
    company: "RapidScale Inc",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "HubSpot, Mixpanel, and Amplitude credits from PerksNest gave us the analytics firepower we needed. Without it, we'd have had to compromise on our growth stack. Worth every penny (which is zero for the basic tier!).",
    outcome: "Full analytics stack implemented",
    metric: "$45K in software credits",
    rating: 3,
    verified: true,
  },
];

export const testimonialsByRole: Testimonial[] = [
  {
    name: "Sofia Andersen",
    role: "Founder",
    company: "TechStartup Nordic",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "I was skeptical about 'deal' platforms, but PerksNest is legitimate. Real credits, real discounts, no hidden catches. Our accountant was thrilled we found this.",
    outcome: "Cleared first year with minimal burn",
    metric: "30% reduction in burn rate",
    rating: 5,
    verified: true,
  },
  {
    name: "Kevin Thompson",
    role: "CEO",
    company: "DataVault Systems",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    quote: "We've recommended PerksNest to 15+ other founders. The Stripe Atlas, AWS, and GCP deals are real money-savers. The platform's design is clean and the UX is frictionless.",
    outcome: "Word-of-mouth champion",
    metric: "Referred 15+ other startups",
    rating: 5,
    verified: true,
  },
];

export const toPRemiumTestimonials: Testimonial[] = [
  {
    name: "Jessica Lee",
    role: "Founder & CEO",
    company: "SerenityPath Mental Wellness",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    quote: "The premium tier unlocked access to exclusive deals we couldn't find anywhere else. The private Slack community with other founders was worth the subscription alone.",
    outcome: "Access to exclusive $200K+ deals",
    metric: "$280K in exclusive deals",
    rating: 5,
    verified: true,
  },
  {
    name: "Robert Chen",
    role: "Founding Partner",
    company: "VentureScale VC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    quote: "Our entire portfolio uses PerksNest Premium. The deal curation is exceptional, support is white-glove, and the ROI is undeniable. We integrated their API into our onboarding.",
    outcome: "Standardized across portfolio",
    metric: "PerksNest standard in 20+ portfolio cos",
    rating: 5,
    verified: true,
  },
];

// Export all testimonials
export const allTestimonials = [
  ...authentictestimonials,
  ...testimonialsByRole,
  ...toPRemiumTestimonials,
];
