/**
 * Notion Deal - Comprehensive Product Page Data
 * Template example for implementing other deals
 */

import { ComprehensiveDealDetail } from "./deal-details-schema";

export const notionDealDetail: ComprehensiveDealDetail = {
  id: "notion",
  name: "Notion",
  logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
  rating: 4.8,
  reviewCount: 156,
  memberCount: 14307,

  title: "Notion Deal",
  subtitle: "6 months free on Business plan with Unlimited AI",
  shortDescription:
    "Get 6 months completely free on Notion's Business plan, including unlimited AI usage. Perfect for teams that want enterprise features without the enterprise price. Start building your knowledge base today.",

  dealHighlight: {
    savings: "$12,000",
    headline: "6 months free on the Business plan with Unlimited AI",
  },

  socialProof: {
    redeemedCount: 14307,
    avatars: [
      "https://randomuser.me/api/portraits/women/32.jpg",
      "https://randomuser.me/api/portraits/men/45.jpg",
      "https://randomuser.me/api/portraits/women/58.jpg",
    ],
    testimonialQuote:
      "Notion unified all our documentation, databases, and workflows in one beautiful workspace. The deal was the cherry on top!",
    testimonialAuthor: "Amanda Shah",
    testimonialRole: "Operations Lead, B2B SaaS",
  },

  deals: {
    title: "Notion Deal: 6 months free Business plan",
    explanation:
      "Access Notion's Business plan for 6 months completely free through our exclusive partnership. Simply sign up with the link provided, verify your business eligibility, and unlock unlimited AI capabilities, advanced permissions, and priority support for half a year with no commitment required.",
    howCanBenefit:
      "With 6 months of Business plan access, you'll save $12,000 while gaining unlimited AI content generation, advanced rolling databases, synced blocks, and team collaboration features. This gives your team time to build comprehensive knowledge management systems, streamline workflows, and explore all of Notion's powerful capabilities. After 6 months, you can choose to continue or switch to a plan that fits your needs.",
    whyChooseThis:
      "Notion is the world's most popular all-in-one workspace with 14,000+ satisfied users through our marketplace. It combines documents, databases, wikis, and project management in one unified platform. With a 4.8/5 rating and powerful AI integration, Notion helps teams work faster, stay organized, and eliminate tool fragmentation across your entire organization.",
  },

  general: {
    overview:
      "Notion is an all-in-one workspace that combines note-taking, project management, database creation, and wikis in a single collaborative platform. It enables teams to organize work, centralize knowledge, and streamline processes with flexible building blocks and powerful AI capabilities. Trusted by over 1 million teams worldwide, Notion is the go-to platform for companies that want to consolidate scattered tools and data into one beautiful, interconnected workspace.",
    useCases: [
      "Project and product management",
      "Team documentation and internal wikis",
      "Product roadmap planning and tracking",
      "Meeting notes and action tracking",
      "CRM and lead management",
      "Content calendars and editorial planning",
      "Employee onboarding documentation",
      "Bug tracking and issue management",
      "Financial tracking and budgeting",
      "HR processes and policies",
    ],
    features: [
      {
        id: "feature-1",
        icon: "Blocks",
        title: "Flexible Block System",
        description:
          "Build exactly what you need with 50+ customizable blocks including databases, tables, calendars, galleries, and more.",
      },
      {
        id: "feature-2",
        icon: "Database",
        title: "Powerful Databases",
        description:
          "Create intelligent databases with custom properties, relations, rollups, and formulas for advanced data organization.",
      },
      {
        id: "feature-3",
        icon: "Users",
        title: "Real-Time Collaboration",
        description:
          "Work together seamlessly with real-time editing, comments, mentions, and activity tracking for team alignment.",
      },
      {
        id: "feature-4",
        icon: "Zap",
        title: "AI-Powered Writing",
        description:
          "Generate content, brainstorm ideas, summarize text, and translate with Notion AI powered by advanced language models.",
      },
      {
        id: "feature-5",
        icon: "Grid",
        title: "Multiple Views",
        description:
          "Display the same database as table, board, gallery, calendar, or timeline view for flexible data visualization.",
      },
      {
        id: "feature-6",
        icon: "Share2",
        title: "Integrations",
        description:
          "Connect 100+ apps including Slack, Gmail, Figma, GitHub, and more for seamless workflow automation.",
      },
      {
        id: "feature-7",
        icon: "Lock",
        title: "Advanced Permissions",
        description:
          "Control team access with workspace, page, and database-level permissions for security and privacy.",
      },
      {
        id: "feature-8",
        icon: "Code",
        title: "Developer APIs",
        description:
          "Build custom integrations and automation with Notion's public APIs and extensive developer documentation.",
      },
    ],
    technicalInfo:
      "Notion runs on a robust cloud infrastructure with 99.9% uptime SLA. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. SOC 2 Type II certified for enterprise security. Available on web, iOS, Android, Windows, and Mac. Supports unlimited file storage and collaborative editing with conflict resolution.",
    website: "https://www.notion.so",
  },

  eligibility: {
    requirements: [
      "Have a valid business email address",
      "Not currently using Notion for active workspaces",
      "Sign up through the provided link",
      "Verify your business within 7 days",
    ],
    limitations: [
      "Offer limited to new Notion users only",
      "Free 6-month period cannot be combined with other promotions",
      "After 6 months, standard pricing applies",
      "Team members can be added during the trial period",
    ],
    applicationProcess:
      "1. Click 'Get Deal' to access the signup link. 2. Create your Notion account with your business email. 3. Select Business plan during signup. 4. Verify your business email within 7 days. 5. Discount automatically applied to your workspace. 6. Start building immediately!",
    contactEmail: "support@notion.so",
  },

  faq: [
    {
      id: "faq-1",
      question: "Can I add team members during the free trial?",
      answer:
        "Yes! You can add unlimited team members to your workspace during the 6-month free trial. All team members will have access to Business plan features at no additional cost during the trial period.",
    },
    {
      id: "faq-2",
      question: "Do I need a credit card to start the free trial?",
      answer:
        "No, you don't need a credit card to start your 6-month free trial. Simply sign up with your business email through our link, verify your email, and you're ready to go.",
    },
    {
      id: "faq-3",
      question: "What happens after the 6 months are free?",
      answer:
        "After your 6-month free trial ends, you can choose to: 1) Upgrade to a paid Business plan with monthly billing, 2) Downgrade to a free Personal plan, or 3) Cancel your workspace entirely. We'll notify you 30 days before your trial ends so you have time to decide.",
    },
    {
      id: "faq-4",
      question: "Can I export my data if I decide to leave?",
      answer:
        "Absolutely! Notion allows you to export all your data in multiple formats including CSV, JSON, Markdown, and PDF. You own all your data and can export or migrate it anytime.",
    },
    {
      id: "faq-5",
      question: "Is the Notion AI included in this deal?",
      answer:
        "Yes! The Business plan includes unlimited Notion AI access. You can use AI features like content generation, summarization, editing, and translation without any additional cost during your 6-month trial.",
    },
    {
      id: "faq-6",
      question: "Can I upgrade to a higher plan during the trial?",
      answer:
        "You can upgrade to Notion's Team plan anytime during or after your trial. This would incur additional charges, but gives you advanced features like unlimited synced blocks and custom branding.",
    },
  ],

  pricing: {
    description:
      "Notion offers transparent, flexible pricing without hidden fees. Choose the plan that fits your team's needs.",
    plans: [
      {
        name: "Free",
        price: "$0",
        description: "Great for personal use",
        features: [
          "Unlimited blocks and pages",
          "Unlimited file uploads",
          "Basic sharing and permissions",
          "Mobile apps",
          "AI features limited to 20 monthly",
        ],
      },
      {
        name: "Plus",
        price: "$10",
        billingPeriod: "per user/month",
        description: "Best for small teams",
        features: [
          "Everything in Free",
          "Advanced permissions and security",
          "Unlimited AI usage",
          "Version history",
          "Advanced database features",
          "Priority support",
        ],
      },
      {
        name: "Business",
        price: "$20",
        billingPeriod: "per user/month",
        description: "For growing companies",
        features: [
          "Everything in Plus",
          "Advanced admin controls",
          "Team analytics",
          "Audit logs",
          "Approved integrations",
          "Advanced API access",
        ],
        highlighted: true,
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations",
        features: [
          "Everything in Business",
          "Dedicated support",
          "Custom contracts",
          "SSO and SAML",
          "Advanced security",
          "SLA guarantee",
        ],
      },
    ],
  },

  features: [
    {
      id: "f1",
      icon: "Zap",
      title: "Launch faster with templates",
      description:
        "Start with pre-built templates for projects, wikis, and workflows instead of starting from scratch.",
    },
    {
      id: "f2",
      icon: "Grid",
      title: "Database views that fit your workflow",
      description:
        "Switch between table, board, gallery, calendar, and timeline views to organize information the way you think.",
    },
    {
      id: "f3",
      icon: "Share2",
      title: "Connect your favorite tools",
      description:
        "Integrate with Slack, Gmail, Figma, GitHub, and 100+ other apps for seamless workflow automation.",
    },
    {
      id: "f4",
      icon: "Users",
      title: "Built for collaboration",
      description:
        "Real-time co-editing, comments, and mentions keep your team aligned and productive together.",
    },
    {
      id: "f5",
      icon: "Sparkles",
      title: "AI that works for you",
      description:
        "Notion AI helps with writing, brainstorming, summarization, translation, and more across your workspace.",
    },
    {
      id: "f6",
      icon: "Lock",
      title: "Security you can trust",
      description:
        "SOC 2 Type II certified with AES-256 encryption, advanced permissions, and audit logs for enterprise security.",
    },
  ],

  reviews: [
    {
      id: "r1",
      author: "Jessica Chen",
      role: "Founder & CEO",
      company: "TechScale Inc",
      avatar: "https://randomuser.me/api/portraits/women/41.jpg",
      rating: 5,
      quote:
        "Notion consolidated our entire tech stack. We ditched 5 different tools and everything just works beautifully together now.",
      date: "April 10, 2026",
    },
    {
      id: "r2",
      author: "Marcus Johnson",
      role: "Product Manager",
      company: "Growth Labs",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      quote:
        "The AI features save our team hours every week on documentation and content creation. This deal made it even better.",
      date: "April 5, 2026",
    },
    {
      id: "r3",
      author: "Sofia Perez",
      role: "Operations Lead",
      company: "StartupHub",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
      rating: 5,
      quote:
        "Finally found a platform where our entire team can work without constant context switching between apps.",
      date: "March 28, 2026",
    },
  ],

  alternatives: [
    {
      id: "a1",
      name: "Confluence",
      logo: "https://www.google.com/s2/favicons?domain=confluence.atlassian.com&sz=128",
      tagline: "Enterprise collaboration and documentation",
      pros: [
        "Deep Jira integration",
        "Enterprise-grade security",
        "Content versioning",
      ],
      cons: ["Higher learning curve", "Expensive for small teams"],
      savings: "$300",
    },
    {
      id: "a2",
      name: "Coda",
      logo: "https://www.google.com/s2/favicons?domain=coda.io&sz=128",
      tagline: "Document workspace with built-in apps",
      pros: [
        "Code-first approach",
        "Powerful automations",
        "Custom packs",
      ],
      cons: ["Steeper learning curve", "Smaller ecosystem"],
      savings: "$200",
    },
  ],

  relatedDeals: [
    {
      id: "make",
      name: "Make",
      logo: "https://www.google.com/s2/favicons?domain=make.com&sz=128",
      dealText: "$100 in free credits",
      savings: "$100",
      memberCount: 8900,
    },
    {
      id: "slack",
      name: "Slack",
      logo: "https://www.google.com/s2/favicons?domain=slack.com&sz=128",
      dealText: "25% off annual Pro plan",
      savings: "$600",
      memberCount: 12400,
    },
    {
      id: "figma",
      name: "Figma",
      logo: "https://www.google.com/s2/favicons?domain=figma.com&sz=128",
      dealText: "3 months free on Pro plan",
      savings: "$360",
      memberCount: 7200,
    },
  ],

  resources: [
    {
      id: "r1",
      type: "guide",
      title: "Getting Started Guide: From Basics to Advanced Notion Setup",
      description:
        "Learn how to set up your first Notion workspace, create databases, and implement advanced workflows in our comprehensive guide.",
      link: "https://notion.com/resources/guides",
      date: "March 2026",
    },
    {
      id: "r2",
      type: "video",
      title: "Notion Template Showcase: Real Business Use Cases",
      description:
        "Watch how successful teams use Notion for project management, CRMs, and more in real-world scenarios.",
      link: "https://youtube.com/watch?v=notion-templates",
      date: "April 2026",
    },
    {
      id: "r3",
      type: "blog",
      title: "Notion AI Tips: 10 Ways to Automate Your Workflow",
      description:
        "Discover practical tips for using Notion AI to save time on writing, editing, and content creation.",
      link: "https://notion.com/blog/ai-automation-tips",
      date: "April 2026",
    },
  ],

  seoKeywords: [
    "Notion deal",
    "Notion discount",
    "Notion promo code",
    "free Notion",
    "Business plan free trial",
  ],
  seoDescription:
    "Get 6 months free on Notion Business plan with unlimited AI. Perfect for teams building connected workspaces. Save $12,000 with our exclusive deal.",
};
