/**
 * Stripe Deal - Comprehensive Product Page Data
 * Serves as template for other deals
 */

import { ComprehensiveDealDetail } from "./deal-details-schema";

export const stripeDealDetail: ComprehensiveDealDetail = {
  id: "stripe",
  name: "Stripe",
  logo: "https://res.cloudinary.com/secretsaas/image/upload/ar_1.0,c_pad,dpr_auto,f_auto,fl_progressive,h_48,q_auto:good,w_48/v1/production/0hiu8hhbwq3u94n8u4o77p0ibgvm",
  rating: 4.4,
  reviewCount: 47,
  memberCount: 6447,

  title: "Stripe Promo code",
  subtitle: "Waived Stripe fees on your next $20,000 in payment processing",
  shortDescription:
    "Experience enhanced savings with our exclusive Stripe promo code. Get waived fees on your next $20,000 in payment processing, potentially saving you up to $500.",

  dealHighlight: {
    savings: "$500",
    headline: "Waived Stripe fees on your next $20,000 in payment processing",
  },

  socialProof: {
    redeemedCount: 6447,
    avatars: [
      "https://randomuser.me/api/portraits/men/57.jpg",
      "https://randomuser.me/api/portraits/women/18.jpg",
      "https://randomuser.me/api/portraits/men/82.jpg",
    ],
    testimonialQuote:
      "Stripe has completely transformed how we handle payments. With this deal, we saved $500 on our first $20k processed.",
    testimonialAuthor: "Sarah Chen",
    testimonialRole: "Founder, fintech startup",
  },

  deals: {
    title: "Stripe Promo Code: Waived Stripe fees on your next $20,000 in payment processing",
    explanation:
      "To activate your Stripe discount code, simply click on the Get Deal button on our platform. You'll need to sign up through the link provided, ensuring that you haven't received Stripe credits previously. Follow the straightforward steps to activate your deal and start processing payments with no fees up to the $20,000 mark.",
    howCanBenefit:
      "The Stripe offer provides €20,000 (or equivalent in USD) in payments accepted on your website without Stripe fees. This can free up essential cash flow for your business, allowing you to operate more efficiently. With typical payment processing fees around 2.9%, this waiver can save you up to $500 and enhance your financial operations without impacting service quality.",
    whyChooseThis:
      "Stripe is trusted by over 1 million businesses worldwide. They handle 250 million API requests daily with 99.999% uptime. Their unified platform supports 135+ currencies, global expansion, and advanced fraud detection, making them the ideal payment partner for startups and enterprises alike.",
  },

  general: {
    overview:
      "Stripe is a financial infrastructure platform that enables businesses of all sizes to accept payments, manage finances, and scale globally. Built for developers and business teams, Stripe handles complex payment processing, fraud prevention, and compliance so you can focus on growth. Stripe's payment infrastructure powers some of the world's leading companies.",
    useCases: [
      "E-commerce and online stores",
      "SaaS and subscription billing",
      "Marketplace platforms",
      "Physical stores and point of sale",
      "Invoice and payment links",
      "Global expansion with local payments",
      "Recurring revenue and invoicing",
      "Mobile app monetization",
    ],
    features: [
      {
        id: "payments",
        icon: "CreditCard",
        title: "Payment Processing",
        description:
          "Accept payments from customers worldwide. Supports credit cards, digital wallets, ACH transfers, and local payment methods in 135+ currencies.",
      },
      {
        id: "fraud",
        icon: "Shield",
        title: "Fraud Prevention",
        description:
          "Advanced fraud detection with Stripe Radar using machine learning to identify suspicious activities, reduce chargebacks, and enhance payment security.",
      },
      {
        id: "analytics",
        icon: "BarChart3",
        title: "Payment Analytics & Reporting",
        description:
          "Detailed analytics and reporting tools to track transaction volumes, revenue, customer behavior, and other metrics for informed business decisions.",
      },
      {
        id: "subscriptions",
        icon: "RotateCcw",
        title: "Subscription Billing",
        description:
          "Robust subscription billing capabilities with recurring billing, trial periods, customizable plans, and automated revenue management.",
      },
      {
        id: "checkout",
        icon: "ShoppingCart",
        title: "Customizable Checkout",
        description:
          "Create a customized checkout experience with pre-built templates, easy-to-use forms, and customization options for seamless payment flows.",
      },
      {
        id: "developers",
        icon: "Code",
        title: "Developer-Friendly APIs",
        description:
          "Developer-friendly APIs and SDKs that allow seamless integration into websites or applications with flexibility and control over payment flows.",
      },
      {
        id: "international",
        icon: "Globe",
        title: "International Expansion",
        description:
          "Support for global expansion with multiple currencies, automatic conversion, localized payment methods, and compliance for 47+ countries.",
      },
      {
        id: "extras",
        icon: "Zap",
        title: "Subsidiary Services",
        description:
          "Additional services including Stripe Connect for marketplace payments, Stripe Radar for fraud prevention, invoicing, and revenue management tools.",
      },
    ],
    technicalInfo:
      "All credit card numbers are AES-256 encrypted, and Stripe's servers cannot access unencrypted data. Stripe has been awarded PCI Level 1 Service Provider certification. Availability is over 99.99%, with enterprise-grade infrastructure handling 250 million API requests daily across 47 countries.",
    website: "https://stripe.com",
  },

  eligibility: {
    requirements: [
      "You have not benefited from Stripe credits in the past",
      "Not using connected accounts or custom-negotiated rates",
      "Not already paying through Shopify payments",
      "Actively processing payments through Stripe",
    ],
    limitations: [
      "This offer is for new credit grants only",
      "Cannot be combined with other Stripe promotional offers",
      "Credits must be used within 90 days of activation",
      "Available in 47 supported countries only",
    ],
    applicationProcess:
      "Click the Get Deal button, sign up or log in to your Stripe account, and our team will verify your eligibility. All applications are manually reviewed by our Customer Success Team.",
    contactEmail: "applications@joinsecret.com",
  },

  faq: [
    {
      id: "faq-1",
      question: "What are the guarantees of our promotion on Stripe?",
      answer:
        "Secret is an accredited partner of Stripe with a money-back guarantee. If you're not accessing the deal for whatever reason and haven't redeemed any other deal, we'll fully refund your membership. You'll receive exactly what's advertised: €20,000 in waived Stripe fees.",
    },
    {
      id: "faq-2",
      question: "What does the Stripe waived fees offer include?",
      answer:
        "The Stripe offer includes €20,000 (or equivalent in USD) in payments accepted on your website without Stripe fees. This applies to all payment types including credit cards, digital wallets, and bank transfers. After using your credit, normal Stripe processing fees apply.",
    },
    {
      id: "faq-3",
      question: "How do I know if my application for Stripe's fee waiver is successful?",
      answer:
        "After you apply through our platform, our Customer Success Team will manually review your application within 2-3 business days. You'll receive an email notification with your approval status. Once approved, the credits will be automatically added to your Stripe account.",
    },
    {
      id: "faq-4",
      question: "Can I use this offer if I already have a Stripe account?",
      answer:
        "Yes! This offer works with both new and existing Stripe accounts. The credits will be added directly to your existing account, and you can start using them immediately to process payments without fees up to the $20,000 limit.",
    },
    {
      id: "faq-5",
      question: "What happens after I use my $20,000 credit?",
      answer:
        "Once you've processed $20,000 with waived fees, normal Stripe processing fees will apply to all subsequent transactions (typically 2.9% + $0.30 per transaction). You can upgrade your plan or continue with standard rates based on your business needs.",
    },
    {
      id: "faq-6",
      question: "Is this offer available worldwide?",
      answer:
        "The Stripe deal is available in 47 supported countries. Stripe itself supports 135+ currencies and payment methods globally, but this specific promotional offer may be restricted based on your location and business type. Contact our support team to confirm availability.",
    },
  ],

  pricing: {
    description:
      "Stripe offers transparent, flat-rate pricing with no setup fees, monthly fees, or hidden charges. Pay only for transactions you process.",
    plans: [
      {
        name: "Standard (Pay-As-You-Go)",
        price: "2.9%",
        billingPeriod: "per transaction + $0.30",
        description: "Best for growing businesses and startups",
        features: [
          "No monthly fees; only pay for transactions",
          "Supports multiple payment methods",
          "Subscription billing and invoicing",
          "Basic fraud detection",
          "Developer-friendly APIs",
          "Email support",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "Custom pricing for high-volume accounts",
        features: [
          "Negotiated pricing and volume discounts",
          "Priority customer support with dedicated account manager",
          "Advanced fraud detection with machine learning",
          "Custom integration support",
          "SLA guarantees",
          "Advanced security and compliance features",
        ],
        highlighted: true,
      },
    ],
  },

  features: [
    {
      id: "feature-1",
      icon: "Zap",
      title: "Never miss a sale again",
      description:
        "Process payments instantly with 99.99% uptime. Stripe's infrastructure ensures your transactions always go through, even during peak traffic.",
    },
    {
      id: "feature-2",
      icon: "BarChart3",
      title: "Payment Analytics & Reporting",
      description:
        "Get insights into transaction volumes, revenue trends, customer behavior, and payment performance to make data-driven decisions.",
    },
    {
      id: "feature-3",
      icon: "CreditCard",
      title: "Payment Processing",
      description:
        "Accept payments from customers worldwide with support for 135+ currencies and multiple payment methods.",
    },
    {
      id: "feature-4",
      icon: "Shield",
      title: "Fraud Prevention",
      description:
        "Stripe Radar uses machine learning to identify suspicious activities and reduce chargebacks with minimal false positives.",
    },
    {
      id: "feature-5",
      icon: "Globe",
      title: "International Expansion",
      description:
        "Support for global expansion with localized payment methods, automatic currency conversion, and compliance for 47+ countries.",
    },
    {
      id: "feature-6",
      icon: "ShoppingCart",
      title: "Customizable Checkout",
      description:
        "Create checkout experiences tailored to your brand with pre-built templates and easy customization options.",
    },
    {
      id: "feature-7",
      icon: "RotateCcw",
      title: "Subscription Billing",
      description:
        "Set up recurring billing with trial periods, customizable plans, and automated revenue management.",
    },
    {
      id: "feature-8",
      icon: "Code",
      title: "Developer-Friendly APIs",
      description:
        "Clear documentation and comprehensive SDKs for easy integration with flexible control over payment flows.",
    },
  ],

  reviews: [
    {
      id: "review-1",
      author: "Malin Karlsson",
      role: "Business Owner",
      rating: 5,
      quote:
        "Very happy with the deal! The technical payment issues come from other integrations, not Stripe. The support is great, and the fee waiver saved us a lot of money.",
      date: "April 15, 2026",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: "review-2",
      author: "Marguerita Quitzon",
      role: "SaaS Founder",
      rating: 5,
      quote:
        "We run a SaaS with usage-based billing and Stripe Billing plus metered invoicing works exceptionally well. Proration behaves predictably when customers upgrade mid-cycle.",
      date: "April 4, 2026",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: "review-3",
      author: "Erminia Pagac",
      role: "Fraud Prevention Lead",
      rating: 5,
      quote:
        "Radar has caught a surprising amount of fraud for us with minimal false positives. The dashboard is actually usable instead of overwhelming.",
      date: "March 31, 2026",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    },
    {
      id: "review-4",
      author: "Myron Beier",
      role: "CTO",
      rating: 5,
      quote:
        "The API docs are clear enough that our developer shipped subscriptions with webhooks and idempotency keys in a day. It's been stable even during traffic spikes.",
      date: "March 22, 2026",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    },
  ],

  alternatives: [
    {
      id: "alt-1",
      name: "Airwallex",
      logo: "https://res.cloudinary.com/secretsaas/image/upload/ar_1.0,c_pad,dpr_auto,f_auto,fl_progressive,h_48,q_auto:good,w_48/v1/production/ggtyduaya1yiymcbygsh7sxplh8e",
      tagline: "A complete financial suite",
      pros: [
        "Lower FX conversion fees",
        "Global payouts in 130+ currencies",
        "All-in-one financial platform",
      ],
      cons: ["Smaller payment method support", "Newer platform"],
      savings: "$1,000",
    },
    {
      id: "alt-2",
      name: "Square",
      logo: "https://res.cloudinary.com/secretsaas/image/upload/ar_1.0,c_pad,dpr_auto,f_auto,fl_progressive,h_48,q_auto:good,w_48/v1/production/nvvdtx9rafultlbld9ov6vtu2vas",
      tagline: "The simplest way to run your business",
      pros: [
        "Great for physical retail",
        "Simple setup process",
        "All-in-one business solutions",
      ],
      cons: ["Less developer-friendly", "Fewer international options"],
      savings: "$500",
    },
    {
      id: "alt-3",
      name: "PayPal",
      logo: "https://www.google.com/s2/favicons?domain=paypal.com&sz=128",
      tagline: "World's most reliable payment platform",
      pros: [
        "Well-established trust",
        "Global reach",
        "Multiple payment options",
      ],
      cons: ["Higher fees", "Slower payouts", "Complex pricing structure"],
      savings: "$300",
    },
  ],

  relatedDeals: [
    {
      id: "airwallex",
      name: "Airwallex",
      logo: "https://res.cloudinary.com/secretsaas/image/upload/ar_1.0,c_pad,dpr_auto,f_auto,fl_progressive,h_48,q_auto:good,w_48/v1/production/ggtyduaya1yiymcbygsh7sxplh8e",
      dealText: "Waived fees on your first $50,000 in FX conversions",
      savings: "$1,000",
      memberCount: 843,
    },
    {
      id: "memberstack",
      name: "Memberstack",
      logo: "https://www.google.com/s2/favicons?domain=memberstack.com&sz=128",
      dealText: "50% off for 6 months",
      savings: "$450",
      memberCount: 2100,
    },
    {
      id: "stripe-atlas",
      name: "Stripe Atlas",
      logo: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
      dealText: "$50 off for the incorporation of your company",
      savings: "$50",
      memberCount: 5432,
    },
  ],

  resources: [
    {
      id: "resource-1",
      type: "blog",
      title: "Best Black Friday SaaS Deals for 2025 to Scale Your Startup",
      description:
        "From AI writing assistants to automation platforms and cloud hosting. This year's 2025 Black Friday deals are a straightforward way to upgrade your tech stack while keeping your spend under control.",
      link: "https://joinsecret.com/blog/best-black-friday-saas-deals-for-2025-to-scale-your-startup",
      date: "November 2024",
    },
    {
      id: "resource-2",
      type: "guide",
      title: "Best Simple Payments Software for Small Businesses",
      description:
        "Learn how the right payment tools can save time, reduce stress, and keep your cash flow strong.",
      link: "https://joinsecret.com/blog/best-simple-payments-software-for-small-businesses",
      date: "March 2024",
    },
    {
      id: "resource-3",
      type: "guide",
      title: "Optimizing the B2B Software Buying Process for Startups",
      description:
        "Explore key steps to streamline your B2B buying process and avoid costly software mistakes.",
      link: "https://joinsecret.com/blog/optimizing-the-b2b-software-buying-process-for-startups",
      date: "February 2024",
    },
  ],

  seoKeywords: [
    "Stripe promo code",
    "Stripe discount",
    "Stripe coupon",
    "payment processing",
    "startup deals",
  ],
  seoDescription:
    "Get exclusive Stripe promo code: waived fees on your next $20,000 in payment processing. Save up to $500 on payment gateway fees with PerksNest.",
};
