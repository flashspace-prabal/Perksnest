/**
 * Make (Integromat) Deal - Comprehensive Product Page Data
 * Automation platform template
 */

import { ComprehensiveDealDetail } from "./deal-details-schema";

export const makeDealDetail: ComprehensiveDealDetail = {
  id: "make",
  name: "Make",
  logo: "https://www.google.com/s2/favicons?domain=make.com&sz=128",
  rating: 4.6,
  reviewCount: 98,
  memberCount: 8900,

  title: "Make Deal",
  subtitle: "Automation platform discount for startups",
  shortDescription:
    "Get exclusive savings on Make (formerly Integromat), the visual automation platform trusted by 2M+ users. Connect your favorite apps and automate repetitive tasks without code.",

  dealHighlight: {
    savings: "$240",
    headline: "Exclusive startup discount on automation plans",
  },

  socialProof: {
    redeemedCount: 8900,
    avatars: [
      "https://randomuser.me/api/portraits/men/12.jpg",
      "https://randomuser.me/api/portraits/women/24.jpg",
      "https://randomuser.me/api/portraits/men/36.jpg",
    ],
    testimonialQuote:
      "Make automated 80% of our manual workflows in the first month. The deal saved us thousands on automation costs.",
    testimonialAuthor: "David Kumar",
    testimonialRole: "Operations Manager, SaaS startup",
  },

  deals: {
    title: "Make Automation Platform - Exclusive Startup Deal",
    explanation:
      "Through our partnership with Make, we're offering exclusive discounts on automation workflows. Setup is simple: sign up through our link, verify your startup status, and select your plan. Our team will apply the discount to your account, and you'll be ready to automate within 24 hours.",
    howCanBenefit:
      "Make allows you to automate repetitive tasks across your entire tech stack without coding. Connect apps, set triggers, and let workflows run automatically. Save time on data entry, lead management, invoicing, notifications, and more. Our startup discount can save you $20-200/month depending on your usage, freeing up budget for core product development.",
    whyChooseThis:
      "Make is trusted by 2 million users globally with 1000+ app integrations. Unlike simple integration tools, Make's powerful automation engine allows complex multi-step workflows with conditional logic, data transformation, and error handling. Perfect for startups that want to automate without hiring additional ops staff or building custom integrations.",
  },

  general: {
    overview:
      "Make (formerly Integromat) is a visual automation platform that connects 1000+ applications and enables teams to automate business processes without coding. With an intuitive drag-and-drop interface, anyone can build complex workflows that save time, reduce errors, and scale operations. Whether you're syncing data between systems, notifying teams, or managing leads, Make eliminates manual work and lets your team focus on strategic tasks.",
    useCases: [
      "Lead management and CRM automation",
      "Data synchronization between apps",
      "Email and notification workflows",
      "Invoice generation and payment tracking",
      "Social media content scheduling",
      "Slack alerts and team notifications",
      "Customer onboarding automation",
      "Report generation and dashboards",
      "Database cleanup and maintenance",
      "Multi-step approval workflows",
    ],
    features: [
      {
        id: "f1",
        icon: "Workflow",
        title: "Drag-and-Drop Workflows",
        description:
          "Build complex automations with an intuitive visual interface. No coding experience required.",
      },
      {
        id: "f2",
        icon: "Zap",
        title: "1000+ App Integrations",
        description:
          "Connect Google Workspace, Slack, Salesforce, HubSpot, Stripe, and 1000+ other apps.",
      },
      {
        id: "f3",
        icon: "GitBranch",
        title: "Advanced Logic",
        description:
          "Use conditional branching, loops, and data transformation for sophisticated workflows.",
      },
      {
        id: "f4",
        icon: "AlertCircle",
        title: "Error Handling",
        description:
          "Robust retry logic, error notifications, and recovery options keep workflows reliable.",
      },
      {
        id: "f5",
        icon: "BarChart3",
        title: "Monitoring & Logging",
        description:
          "Real-time execution history, detailed logs, and analytics to track workflow performance.",
      },
      {
        id: "f6",
        icon: "Users",
        title: "Team Collaboration",
        description:
          "Share workflows with team members, assign owners, and collaborate on automation.",
      },
      {
        id: "f7",
        icon: "Lock",
        title: "Security & Compliance",
        description:
          "Enterprise security with encryption, API keys, and compliance certifications.",
      },
      {
        id: "f8",
        icon: "Code",
        title: "Developer API",
        description:
          "Custom integrations and webhooks for building your own connectors.",
      },
    ],
    technicalInfo:
      "Make runs on global infrastructure with 99.99% uptime. All data is encrypted in transit and at rest. SOC 2 Type II certified. Supports webhooks, API calls, OAuth, and API key authentication. Execution monitoring with detailed logs retained for 6 months. Supports 1000+ apps with regular additions.",
    website: "https://www.make.com",
  },

  eligibility: {
    requirements: [
      "Startup company currently in operation",
      "Team size: 2-100 employees",
      "Less than $10M annual revenue",
      "Sign up through provided link",
    ],
    limitations: [
      "Discount applies to Core, Pro, and Business plans",
      "Cannot be combined with other Make promotions",
      "Annual payment required for best savings",
      "Discount valid for 12 months from activation",
    ],
    applicationProcess:
      "Click 'Get Deal' to access the startup offer page. Fill out basic company information. Create your Make account. Select your plan and discount is automatically applied. No manual verification needed for plans under $500/month.",
    contactEmail: "startups@make.com",
  },

  faq: [
    {
      id: "faq-1",
      question: "How many apps can I connect with Make?",
      answer:
        "Make has 1000+ pre-built app integrations. If you need to connect to a custom app or API, you can build custom webhooks and REST API modules. Most teams use 5-20 apps depending on their workflow needs.",
    },
    {
      id: "faq-2",
      question: "Is there a limit to how many workflows I can create?",
      answer:
        "The number of workflows depends on your plan. Core plan: 10 workflows, Pro: Unlimited workflows, Business: Unlimited. Each workflow can run automatically based on your plan's operation limits.",
    },
    {
      id: "faq-3",
      question: "What if I have a complex workflow? Will Make support it?",
      answer:
        "Make supports complex multi-step workflows with conditional logic, loops, data transformation, and error handling. Most business processes can be automated. If you get stuck, Make has excellent documentation and community support.",
    },
    {
      id: "faq-4",
      question: "How much does it cost to run workflows?",
      answer:
        "Make uses a credit system where each task consumes credits. Core plan includes 10,000 operations/month. Our startup discount typically saves you $20-100/month on operations. You can monitor credit usage in real-time.",
    },
    {
      id: "faq-5",
      question: "Can I get technical support?",
      answer:
        "Yes, Make offers email support for all plans, plus chat support for Pro and Business plans. Response time is typically 24-48 hours. They also have extensive documentation and community forums.",
    },
    {
      id: "faq-6",
      question: "How long does it take to set up a workflow?",
      answer:
        "Simple workflows (2-3 steps): 5-10 minutes. Moderate workflows (5-8 steps): 30-60 minutes. Complex workflows: 1-3 hours depending on complexity. No coding skills required.",
    },
  ],

  pricing: {
    description:
      "Make offers flexible pricing based on your automation needs. Pay only for what you use with transparent pricing.",
    plans: [
      {
        name: "Core",
        price: "$9.99",
        billingPeriod: "per month",
        description: "Get started with automation",
        features: [
          "10 workflows",
          "10,000 operations/month",
          "Email support",
          "Basic app integrations",
          "Monthly billing",
          "Up to 3 team members",
        ],
      },
      {
        name: "Pro",
        price: "$19.99",
        billingPeriod: "per month",
        description: "Scale your automations",
        features: [
          "Unlimited workflows",
          "100,000 operations/month",
          "Chat & email support",
          "Advanced integrations",
          "Data transformers",
          "Up to 10 team members",
        ],
        highlighted: true,
      },
      {
        name: "Business",
        price: "$199",
        billingPeriod: "per month",
        description: "Enterprise automation",
        features: [
          "Unlimited workflows",
          "1,000,000 operations/month",
          "Priority support",
          "Advanced security",
          "Custom integrations",
          "Unlimited team members",
        ],
      },
    ],
  },

  features: [
    {
      id: "f1",
      icon: "Zap",
      title: "Eliminate manual work",
      description:
        "Automate repetitive tasks and let your team focus on high-value work instead of data entry.",
    },
    {
      id: "f2",
      icon: "GitBranch",
      title: "Build complex workflows",
      description:
        "Use conditional logic, loops, and transformations to handle sophisticated business processes.",
    },
    {
      id: "f3",
      icon: "Share2",
      title: "Connect any app",
      description:
        "Integrate with 1000+ apps through webhooks, APIs, and pre-built connectors.",
    },
    {
      id: "f4",
      icon: "BarChart3",
      title: "Monitor in real-time",
      description:
        "Track workflow execution, view detailed logs, and get alerts on failures.",
    },
    {
      id: "f5",
      icon: "Zap",
      title: "Scale without hiring",
      description:
        "Handle increasing workload with automation instead of adding headcount.",
    },
    {
      id: "f6",
      icon: "Lock",
      title: "Enterprise security",
      description:
        "SOC 2 certified with encryption, API keys, and comprehensive security controls.",
    },
  ],

  reviews: [
    {
      id: "r1",
      author: "Emma Rodriguez",
      role: "Operations Manager",
      company: "E-commerce startup",
      avatar: "https://randomuser.me/api/portraits/women/17.jpg",
      rating: 5,
      quote:
        "We saved 10 hours per week by automating our order-to-invoice process. Best investment we made.",
      date: "April 12, 2026",
    },
    {
      id: "r2",
      author: "Thomas Wright",
      role: "CTO",
      company: "SaaS platform",
      avatar: "https://randomuser.me/api/portraits/men/28.jpg",
      rating: 5,
      quote:
        "Incredible tool for handling data sync between systems. Saved us months of development time.",
      date: "April 8, 2026",
    },
    {
      id: "r3",
      author: "Nina Patel",
      role: "Founder",
      company: "Marketing agency",
      avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      rating: 5,
      quote:
        "Our team went from manual spreadsheet management to fully automated workflows. Game changer.",
      date: "March 30, 2026",
    },
  ],

  alternatives: [
    {
      id: "a1",
      name: "Zapier",
      logo: "https://www.google.com/s2/favicons?domain=zapier.com&sz=128",
      tagline: "Workflow automation without coding",
      pros: [
        "Largest app library (6000+)",
        "Easiest to use",
        "Good documentation",
      ],
      cons: ["More expensive", "Less powerful logic"],
      savings: "$150",
    },
    {
      id: "a2",
      name: "IFTTT",
      logo: "https://www.google.com/s2/favicons?domain=ifttt.com&sz=128",
      tagline: "Simple if-this-then-that automation",
      pros: [
        "Very beginner-friendly",
        "Good for simple workflows",
        "Affordable",
      ],
      cons: ["Limited to simple logic", "Fewer advanced features"],
      savings: "$50",
    },
  ],

  relatedDeals: [
    {
      id: "zapier",
      name: "Zapier",
      logo: "https://www.google.com/s2/favicons?domain=zapier.com&sz=128",
      dealText: "$50 off annual Starter plan",
      savings: "$50",
      memberCount: 12100,
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
      id: "notion",
      name: "Notion",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
      dealText: "6 months free on Business plan",
      savings: "$12,000",
      memberCount: 14307,
    },
  ],

  resources: [
    {
      id: "r1",
      type: "guide",
      title: "Make for Beginners: Building Your First Workflow",
      description:
        "Step-by-step guide to creating your first automation workflow using Make's visual builder.",
      link: "https://make.com/guides/beginners",
      date: "March 2026",
    },
    {
      id: "r2",
      type: "blog",
      title: "10 Popular Workflows for SaaS Startups",
      description:
        "Common automation patterns that save SaaS teams hours every week including lead management and data sync.",
      link: "https://make.com/blog/saas-automations",
      date: "April 2026",
    },
    {
      id: "r3",
      type: "template",
      title: "Lead Scoring & CRM Automation Template",
      description:
        "Ready-to-use workflow template for automating lead scoring and moving qualified leads to your CRM.",
      link: "https://make.com/templates/lead-scoring",
      date: "April 2026",
    },
  ],

  seoKeywords: [
    "Make automation",
    "Make.com deal",
    "workflow automation",
    "integromat discount",
    "startup automation tools",
  ],
  seoDescription:
    "Get exclusive Make automation platform discounts for startups. Automate workflows across 1000+ apps without coding. Save $20-240/month with our deal.",
};
