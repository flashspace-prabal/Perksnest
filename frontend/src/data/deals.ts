// Centralized deals data with reliable logo URLs
export interface Deal {
  id: string;
  slug?: string;
  name: string;
  company?: string;
  logo: string;
  description: string;
  dealText: string;
  savings: string;
  memberCount: number;
  isPremium?: boolean;
  isFree?: boolean;
  isPick?: boolean;
  featured?: boolean;
  category: string;
  subcategory?: string; // More specific categorization within parent category
  lastAdded?: string;
  expiresAt?: string;  // ISO date string, undefined = no expiry
  collection?: string; // e.g. "yc-starter-kit", "free-tools", "growth-stack"
  redeemUrl?: string;  // URL to redeem the deal
  promoCode?: string;  // Promo code if applicable
  steps?: string[];    // Redemption steps
  website?: string;    // External website URL for redemption
  eligibility?: string[]; // Eligibility requirements
  expiresIn?: string;   // Expiration timeframe
}

// Startup deals have been merged into dealsData below

export const dealsData: Deal[] = [
  {
    id: "google-cloud",
    name: "Google Cloud",
    logo: "https://www.google.com/s2/favicons?domain=cloud.google.com&sz=128",
    description: "Google Cloud provides scalable infrastructure, AI/ML tools, storage, and computing services to help startups build, deploy, and scale applications globally with enterprise-grade reliability.",
    dealText: "Up to $350,000 in cloud & AI credits",
    savings: "$350,000",
    memberCount: 8200,
    category: "data",
    subcategory: "cloud",
    redeemUrl: "https://cloud.google.com/startup",
    website: "https://cloud.google.com/startup",
    steps: [
      "Visit https://cloud.google.com/startup",
      "Click on Apply now under Google for Startups Cloud Program",
      "Sign in with your Google account",
      "Fill startup details (team, product, funding stage)",
      "Submit application",
      "Wait 3–5 days for review",
      "Credits are added automatically after approval"
    ]
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    logo: "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=128",
    description: "Cloudflare provides CDN, security, DDoS protection, and developer tools to improve performance and reliability of websites and applications.",
    dealText: "Up to $250,000 in credits",
    savings: "$250,000",
    memberCount: 7400,
    category: "infrastructure",
    subcategory: "cloud",
    redeemUrl: "https://www.cloudflare.com/forstartups",
    website: "https://www.cloudflare.com/forstartups",
    steps: [
      "Visit Cloudflare for Startups page",
      "Click Apply now",
      "Fill company and usage details",
      "Submit application",
      "Wait for review",
      "Credits added after approval"
    ]
  },
  {
    id: "microsoft-azure",
    name: "Microsoft Azure",
    logo: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
    description: "Microsoft Azure is a cloud platform offering compute, AI, databases, and developer tools with strong enterprise integration and global infrastructure.",
    dealText: "Up to $150,000 credits + tools",
    savings: "$150,000",
    memberCount: 6900,
    category: "data",
    subcategory: "cloud",
    redeemUrl: "https://foundershub.startups.microsoft.com",
    website: "https://foundershub.startups.microsoft.com",
    steps: [
      "Visit Microsoft Founders Hub",
      "Sign in or create account",
      "Click Apply",
      "Fill startup profile",
      "Submit application",
      "Credits added after approval"
    ]
  },
  {
    id: "aws",
    name: "AWS",
    logo: "https://www.google.com/s2/favicons?domain=aws.amazon.com&sz=128",
    description: "Amazon Web Services offers scalable cloud computing, storage, databases, and AI tools for startups building high-performance applications.",
    dealText: "Up to $100,000 AWS Activate credits",
    savings: "$100,000",
    memberCount: 9100,
    category: "data",
    subcategory: "cloud",
    redeemUrl: "https://aws.amazon.com/startups",
    website: "https://aws.amazon.com/startups",
    steps: [
      "Visit AWS Startups page",
      "Choose program (Founders or Portfolio)",
      "Sign in to AWS",
      "Fill startup details",
      "Submit application",
      "Credits applied after approval"
    ]
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    logo: "https://www.google.com/s2/favicons?domain=digitalocean.com&sz=128",
    description: "DigitalOcean is a simple and developer-friendly cloud platform offering compute, databases, and scalable infrastructure.",
    dealText: "Up to $100,000 credits",
    savings: "$100,000",
    memberCount: 5200,
    category: "data",
    subcategory: "cloud",
    redeemUrl: "https://digitalocean.com/hatch",
    website: "https://digitalocean.com/hatch",
    steps: [
      "Visit DigitalOcean Hatch program",
      "Click Apply",
      "Fill startup details",
      "Submit application",
      "Wait for review",
      "Credits applied"
    ]
  },
  {
    id: "ovhcloud",
    name: "OVHCloud",
    logo: "https://www.google.com/s2/favicons?domain=ovhcloud.com&sz=128",
    description: "OVHCloud provides scalable infrastructure, hosting, and cloud services with strong European compliance and cost efficiency.",
    dealText: "Up to €100,000 credits",
    savings: "€100,000",
    memberCount: 3100,
    category: "infrastructure",
    subcategory: "cloud",
    redeemUrl: "https://startup.ovhcloud.com",
    website: "https://startup.ovhcloud.com",
    steps: [
      "Visit OVHCloud startup program",
      "Click Join Program",
      "Fill application form",
      "Submit details",
      "Attend onboarding call",
      "Receive credits"
    ]
  },
  {
    id: "vercel",
    name: "Vercel",
    logo: "https://www.google.com/s2/favicons?domain=vercel.com&sz=128",
    description: "Vercel is a frontend cloud platform for deploying modern web applications with edge performance and developer-first workflows.",
    dealText: "Credits + Pro plan access",
    savings: "$5,000",
    memberCount: 6100,
    category: "development",
    subcategory: "frontend",
    redeemUrl: "https://vercel.com/startups",
    website: "https://vercel.com/startups",
    steps: [
      "Visit Vercel startup page",
      "Check eligibility via partner",
      "Apply",
      "Submit startup details",
      "Wait for approval",
      "Credits applied"
    ]
  },
  {
    id: "render",
    name: "Render",
    logo: "https://www.google.com/s2/favicons?domain=render.com&sz=128",
    description: "Render is a modern cloud platform to deploy apps, APIs, and databases with minimal configuration.",
    dealText: "$5,000 credits",
    savings: "$5,000",
    memberCount: 4200,
    category: "infrastructure",
    subcategory: "cloud",
    redeemUrl: "https://render.com/startups",
    website: "https://render.com/startups",
    steps: [
      "Visit Render startup page",
      "Fill application",
      "Submit details",
      "Wait for approval",
      "Credits added"
    ]
  },
  {
    id: "anthropic",
    name: "Anthropic",
    logo: "https://www.google.com/s2/favicons?domain=anthropic.com&sz=128",
    description: "Anthropic provides advanced AI models like Claude for building intelligent applications.",
    dealText: "$25,000 API credits",
    savings: "$25,000",
    memberCount: 3800,
    category: "ai",
    subcategory: "ai-tools",
    redeemUrl: "https://anthropic.com/startups",
    website: "https://anthropic.com/startups",
    steps: [
      "Visit Anthropic startups page",
      "Click Apply",
      "Submit AI use case",
      "Wait for approval",
      "Credits activated"
    ]
  },
  {
    id: "perplexity-ai",
    name: "Perplexity AI",
    logo: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128",
    description: "Perplexity AI is an AI-powered search engine providing real-time answers and research insights.",
    dealText: "6 months free + $5,000 credits",
    savings: "$5,000",
    memberCount: 4600,
    category: "ai",
    subcategory: "ai-tools",
    redeemUrl: "https://www.perplexity.ai/startups",
    website: "https://www.perplexity.ai/startups",
    steps: [
      "Visit Perplexity startups page",
      "Open application form",
      "Submit details",
      "Wait for approval",
      "Credits added"
    ]
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    logo: "https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128",
    description: "ElevenLabs is an advanced AI voice generation platform offering realistic speech synthesis for content, products, and applications.",
    dealText: "$4,000 value (Scale plan)",
    savings: "$4,000",
    memberCount: 2800,
    category: "ai",
    subcategory: "ai-audio",
    redeemUrl: "https://elevenlabs.io/startup-grants",
    website: "https://elevenlabs.io/startup-grants",
    steps: [
      "Visit ElevenLabs startup grants page",
      "Click Apply",
      "Submit startup details",
      "Wait for approval",
      "Plan activated"
    ]
  },
  {
    id: "openai",
    name: "OpenAI",
    logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128",
    description: "OpenAI provides powerful AI models like GPT for building chatbots, automation tools, and intelligent apps.",
    dealText: "Up to $2,500 credits",
    savings: "$2,500",
    memberCount: 8700,
    category: "ai",
    subcategory: "ai-tools",
    redeemUrl: "https://ramp.com/rewards/openai",
    website: "https://ramp.com/rewards/openai",
    steps: [
      "Visit Ramp rewards page",
      "Create Ramp account",
      "Claim OpenAI offer",
      "Connect OpenAI account",
      "Credits applied"
    ]
  },
  {
    id: "anam-ai",
    name: "Anam AI",
    logo: "https://www.google.com/s2/favicons?domain=anam.ai&sz=128",
    description: "Anam AI provides AI persona tools to simulate human-like interactions for business and product use cases.",
    dealText: "45% discount on platform",
    savings: "45% OFF",
    memberCount: 1200,
    category: "ai",
    subcategory: "ai-tools",
    redeemUrl: "https://lab.anam.ai/register",
    website: "https://lab.anam.ai/register",
    steps: [
      "Visit Anam AI website",
      "Create account",
      "Choose plan",
      "Apply code ANAM45WELCOME",
      "Discount applied"
    ]
  },
  {
    id: "meetgeek",
    name: "MeetGeek",
    logo: "https://www.google.com/s2/favicons?domain=meetgeek.ai&sz=128",
    description: "MeetGeek is an AI meeting assistant that records, summarizes, and extracts insights from meetings.",
    dealText: "50% discount",
    savings: "50% OFF",
    memberCount: 2100,
    category: "ai",
    subcategory: "ai-productivity",
    redeemUrl: "https://meetgeek.ai/pricing",
    website: "https://meetgeek.ai/pricing",
    steps: [
      "Visit pricing page",
      "Select plan",
      "Apply code ANTLER50MG",
      "Checkout"
    ]
  },
  {
    id: "deepinfra",
    name: "DeepInfra",
    logo: "https://www.google.com/s2/favicons?domain=deepinfra.com&sz=128",
    description: "DeepInfra provides scalable infrastructure for running open-source AI models including LLMs, image, and speech models.",
    dealText: "AI inference credits",
    savings: "$5,000+",
    memberCount: 1900,
    category: "ai",
    subcategory: "ai-infra",
    redeemUrl: "https://deepinfra.com/deepstart",
    website: "https://deepinfra.com/deepstart",
    steps: [
      "Visit DeepInfra page",
      "Create account",
      "Fill startup details",
      "Submit application",
      "Wait for approval",
      "Credits added",
      "Start using APIs"
    ]
  },
  {
    id: "mongodb",
    name: "MongoDB",
    logo: "https://www.google.com/s2/favicons?domain=mongodb.com&sz=128",
    description: "MongoDB is a NoSQL database platform designed for scalability, flexibility, and modern applications.",
    dealText: "$20,000 credits",
    savings: "$20,000",
    memberCount: 5000,
    category: "development",
    subcategory: "database",
    redeemUrl: "https://mongodb.com/startups",
    website: "https://mongodb.com/startups",
    steps: [
      "Visit MongoDB startups page",
      "Apply",
      "Fill details",
      "Submit",
      "Credits added"
    ]
  },
  {
    id: "couchbase",
    name: "Couchbase",
    logo: "https://www.google.com/s2/favicons?domain=couchbase.com&sz=128",
    description: "Couchbase provides a distributed NoSQL database with strong performance for real-time applications.",
    dealText: "$12,750 starter credits",
    savings: "$12,750",
    memberCount: 1700,
    category: "development",
    subcategory: "database",
    redeemUrl: "https://aws.amazon.com/marketplace/",
    website: "https://aws.amazon.com/marketplace/",
    steps: [
      "Visit AWS marketplace",
      "Search Couchbase Capella",
      "Sign up with AWS",
      "Apply offer",
      "Credits activated"
    ]
  },
  {
    id: "supabase",
    name: "Supabase",
    logo: "https://www.google.com/s2/favicons?domain=supabase.com&sz=128",
    description: "Supabase is an open-source backend-as-a-service providing database, auth, and APIs.",
    dealText: "$300 credits",
    savings: "$300",
    memberCount: 4100,
    category: "development",
    subcategory: "backend",
    redeemUrl: "https://supabase.com/solutions/startups",
    website: "https://supabase.com/solutions/startups",
    steps: [
      "Visit Supabase startups page",
      "Apply",
      "Submit form",
      "Approval",
      "Credits added"
    ]
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    logo: "https://www.google.com/s2/favicons?domain=planetscale.com&sz=128",
    description: "PlanetScale is a serverless MySQL database platform built for scalability and reliability.",
    dealText: "Custom credits",
    savings: "$5,000+",
    memberCount: 2600,
    category: "development",
    subcategory: "database",
    redeemUrl: "https://planetscale.com/startups",
    website: "https://planetscale.com/startups",
    steps: [
      "Visit PlanetScale page",
      "Apply",
      "Submit details",
      "Wait for approval",
      "Credits assigned"
    ]
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    logo: "https://www.google.com/s2/favicons?domain=mixpanel.com&sz=128",
    description: "Mixpanel is a product analytics platform to track user behavior, funnels, and retention.",
    dealText: "$50,000 benefits",
    savings: "$50,000",
    memberCount: 6200,
    category: "analytics",
    subcategory: "product-analytics",
    redeemUrl: "https://mixpanel.com/startups",
    website: "https://mixpanel.com/startups",
    steps: [
      "Visit Mixpanel page",
      "Apply",
      "Submit details",
      "Approval",
      "Plan activated"
    ]
  },
  {
    id: "posthog",
    name: "PostHog",
    logo: "https://www.google.com/s2/favicons?domain=posthog.com&sz=128",
    description: "PostHog is an open-source product analytics platform offering event tracking, feature flags, and session recordings for data-driven teams.",
    dealText: "$50,000 in credits",
    savings: "$50,000",
    memberCount: 3500,
    category: "analytics",
    subcategory: "product-analytics",
    redeemUrl: "https://posthog.com/startups",
    website: "https://posthog.com/startups",
    steps: [
      "Visit PostHog startups page",
      "Apply",
      "Submit details",
      "Wait for approval",
      "Credits activated"
    ]
  },
  {
    id: "twilio-segment",
    name: "Twilio Segment",
    logo: "https://www.google.com/s2/favicons?domain=twilio.com&sz=128",
    description: "Twilio Segment is a customer data platform that helps collect, unify, and activate customer data across tools.",
    dealText: "$25,000 benefits",
    savings: "$25,000",
    memberCount: 2800,
    category: "analytics",
    subcategory: "customer-data",
    redeemUrl: "https://www.twilio.com/en-us/segment",
    website: "https://www.twilio.com/en-us/segment",
    steps: [
      "Visit Twilio Segment page",
      "Apply",
      "Submit details",
      "Wait for approval",
      "Access granted"
    ]
  },
  {
    id: "amplitude",
    name: "Amplitude",
    logo: "https://www.google.com/s2/favicons?domain=amplitude.com&sz=128",
    description: "Amplitude is a product analytics platform for tracking user journeys, funnels, and retention.",
    dealText: "1 year free access",
    savings: "$10,000",
    memberCount: 4300,
    category: "analytics",
    subcategory: "product-analytics",
    redeemUrl: "https://amplitude.com/startups",
    website: "https://amplitude.com/startups",
    steps: [
      "Visit Amplitude startups page",
      "Click Apply now",
      "Create account",
      "Fill startup details",
      "Submit application",
      "Plan activated after approval"
    ]
  },
  {
    id: "datadog",
    name: "Datadog",
    logo: "https://www.google.com/s2/favicons?domain=datadoghq.com&sz=128",
    description: "Datadog provides monitoring, logs, and infrastructure insights for applications.",
    dealText: "1 year free access",
    savings: "$15,000",
    memberCount: 5100,
    category: "infrastructure",
    subcategory: "monitoring",
    redeemUrl: "https://www.datadoghq.com/startups",
    website: "https://www.datadoghq.com/startups",
    steps: [
      "Visit Datadog startups page",
      "Apply",
      "Submit infrastructure details",
      "Wait for approval",
      "Monitoring tools activated"
    ]
  },
  {
    id: "sentry",
    name: "Sentry",
    logo: "https://www.google.com/s2/favicons?domain=sentry.io&sz=128",
    description: "Sentry is an error tracking and performance monitoring platform for developers.",
    dealText: "Free tier + startup discounts",
    savings: "$2,000",
    memberCount: 4700,
    category: "development",
    subcategory: "monitoring",
    redeemUrl: "https://sentry.io/for/startups",
    website: "https://sentry.io/for/startups",
    steps: [
      "Visit Sentry startups page",
      "Click Apply",
      "Fill details",
      "Submit",
      "Discount applied"
    ]
  },
  {
    id: "retool",
    name: "Retool",
    logo: "https://www.google.com/s2/favicons?domain=retool.com&sz=128",
    description: "Retool is a low-code platform for building internal tools and dashboards.",
    dealText: "$60,000 credits",
    savings: "$60,000",
    memberCount: 3400,
    category: "development",
    subcategory: "internal-tools",
    redeemUrl: "https://retool.com/startups",
    website: "https://retool.com/startups",
    steps: [
      "Visit Retool startups page",
      "Click Apply",
      "Create account",
      "Fill startup details",
      "Submit",
      "Credits added"
    ]
  },
  {
    id: "algolia",
    name: "Algolia",
    logo: "https://www.google.com/s2/favicons?domain=algolia.com&sz=128",
    description: "Algolia is a powerful search API platform for fast and relevant search experiences.",
    dealText: "$10,000 credits",
    savings: "$10,000",
    memberCount: 3900,
    category: "development",
    subcategory: "api",
    redeemUrl: "https://www.algolia.com/industries/startups",
    website: "https://www.algolia.com/industries/startups",
    steps: [
      "Visit Algolia startups page",
      "Click Apply",
      "Create account",
      "Submit details",
      "Wait for approval",
      "Credits added"
    ]
  },
  {
    id: "github",
    name: "GitHub",
    logo: "https://www.google.com/s2/favicons?domain=github.com&sz=128",
    description: "GitHub is the leading platform for version control, collaboration, and DevOps workflows.",
    dealText: "20 Enterprise seats free",
    savings: "$4,500",
    memberCount: 12000,
    category: "development",
    subcategory: "devops",
    redeemUrl: "https://github.com/enterprise/startups",
    website: "https://github.com/enterprise/startups",
    steps: [
      "Visit GitHub startups page",
      "Click Apply",
      "Sign in",
      "Fill startup details",
      "Submit",
      "Seats added after approval"
    ]
  },
  {
    id: "bastion",
    name: "Bastion",
    logo: "https://www.google.com/s2/favicons?domain=bastion.tech&sz=128",
    description: "Bastion provides SOC 2 compliance solutions for startups.",
    dealText: "20% discount",
    savings: "$5,000",
    memberCount: 900,
    category: "security",
    subcategory: "compliance",
    redeemUrl: "https://www.bastion.tech/demo",
    website: "https://www.bastion.tech/demo",
    steps: [
      "Visit Bastion page",
      "Book demo",
      "Discuss requirements",
      "Get discounted quote",
      "Proceed with contract"
    ]
  },
  {
    id: "notion",
    name: "Notion",
    logo: "https://www.google.com/s2/favicons?domain=notion.so&sz=128",
    description: "Notion is an all-in-one workspace for notes, docs, and collaboration.",
    dealText: "6 months free",
    savings: "$1,000",
    memberCount: 10000,
    category: "productivity",
    subcategory: "collaboration",
    redeemUrl: "https://www.notion.so/startups",
    website: "https://www.notion.so/startups",
    steps: [
      "Visit Notion startups page",
      "Click Apply",
      "Sign in",
      "Submit details",
      "Wait for approval",
      "Plan activated"
    ]
  },
  {
    id: "miro",
    name: "Miro",
    logo: "https://www.google.com/s2/favicons?domain=miro.com&sz=128",
    description: "Miro is an online collaborative whiteboard platform for brainstorming, planning, and team collaboration.",
    dealText: "$1,000 in credits",
    savings: "$1,000",
    memberCount: 9100,
    category: "productivity",
    subcategory: "collaboration",
    redeemUrl: "https://miro.com/startups",
    website: "https://miro.com/startups",
    steps: [
      "Visit Miro startups page",
      "Click Apply now",
      "Create or login account",
      "Fill startup details",
      "Submit application",
      "Credits activated after approval"
    ]
  },
  {
    id: "linear",
    name: "Linear",
    logo: "https://www.google.com/s2/favicons?domain=linear.app&sz=128",
    description: "Linear is a modern issue tracking and project management tool built for high-performance teams.",
    dealText: "6 months free",
    savings: "$500",
    memberCount: 8420,
    category: "project",
    subcategory: "task-management",
    redeemUrl: "https://linear.app/startups",
    website: "https://linear.app/startups",
    steps: [
      "Visit Linear startups page",
      "Click Apply",
      "Sign in",
      "Fill startup details",
      "Submit",
      "Free plan activated"
    ]
  },
  {
    id: "atlassian",
    name: "Atlassian",
    logo: "https://www.google.com/s2/favicons?domain=atlassian.com&sz=128",
    description: "Atlassian offers tools like Jira and Confluence for project tracking and team collaboration.",
    dealText: "Free or discounted plans",
    savings: "$10,000",
    memberCount: 7200,
    category: "project",
    subcategory: "collaboration",
    redeemUrl: "https://www.atlassian.com/software/startups",
    website: "https://www.atlassian.com/software/startups",
    steps: [
      "Visit Atlassian startups page",
      "Click Apply",
      "Login",
      "Fill startup details",
      "Submit",
      "Access granted"
    ]
  },
  {
    id: "whimsical",
    name: "Whimsical",
    logo: "https://www.google.com/s2/favicons?domain=whimsical.com&sz=128",
    description: "Whimsical is a visual collaboration tool for flowcharts, wireframes, and brainstorming.",
    dealText: "Up to 12 months free",
    savings: "$1,200",
    memberCount: 2600,
    category: "design",
    subcategory: "visual-collaboration",
    redeemUrl: "https://whimsical.com/startups",
    website: "https://whimsical.com/startups",
    steps: [
      "Visit Whimsical page",
      "Click Apply",
      "Login or signup",
      "Fill details",
      "Submit",
      "Plan upgraded after approval"
    ]
  },
  {
    id: "lightfield-crm",
    name: "Lightfield CRM",
    logo: "https://www.google.com/s2/favicons?domain=lightfield.app&sz=128",
    description: "Lightfield CRM is a customer relationship management tool designed for startups.",
    dealText: "6 months free",
    savings: "$1,800",
    memberCount: 900,
    category: "customer",
    subcategory: "crm",
    redeemUrl: "https://crm.lightfield.app/signup",
    website: "https://crm.lightfield.app/signup",
    steps: [
      "Visit signup page",
      "Create account",
      "Select startup plan",
      "Apply code ANTLER6",
      "Plan activated"
    ]
  },
  {
    id: "canva",
    name: "Canva",
    logo: "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
    description: "Canva is a design platform for creating graphics, presentations, and marketing materials.",
    dealText: "Startup discounts",
    savings: "$500",
    memberCount: 11000,
    category: "design",
    subcategory: "graphic-design",
    redeemUrl: "https://www.canva.com/en_in/solutions/startups/",
    website: "https://www.canva.com/en_in/solutions/startups/",
    steps: [
      "Visit Canva startups page",
      "Create account",
      "Upgrade to Teams plan",
      "Apply for discount",
      "Plan activated"
    ]
  },
  {
    id: "intercom",
    name: "Intercom",
    logo: "https://www.google.com/s2/favicons?domain=intercom.com&sz=128",
    description: "Intercom is a customer messaging platform for support, onboarding, and engagement.",
    dealText: "Up to 95% discount",
    savings: "$10,000",
    memberCount: 5300,
    category: "customer",
    subcategory: "support",
    redeemUrl: "https://www.intercom.com/early-stage",
    website: "https://www.intercom.com/early-stage",
    steps: [
      "Visit Intercom page",
      "Click Apply",
      "Fill startup details",
      "Submit",
      "Discount applied"
    ]
  },
  {
    id: "hubspot",
    name: "HubSpot",
    logo: "https://www.google.com/s2/favicons?domain=hubspot.com&sz=128",
    description: "HubSpot provides CRM, marketing automation, and sales tools for startups.",
    dealText: "Up to 90% discount",
    savings: "$7,000",
    memberCount: 8000,
    category: "customer",
    subcategory: "crm",
    redeemUrl: "https://www.hubspot.com/startups",
    website: "https://www.hubspot.com/startups",
    steps: [
      "Visit HubSpot startups page",
      "Click Apply",
      "Check eligibility",
      "Submit details",
      "Approval granted",
      "Discount applied"
    ]
  },
  {
    id: "zendesk",
    name: "Zendesk",
    logo: "https://www.google.com/s2/favicons?domain=zendesk.com&sz=128",
    description: "Zendesk is a customer support platform for managing support tickets and conversations.",
    dealText: "6 months free",
    savings: "$5,000",
    memberCount: 4200,
    category: "customer",
    subcategory: "support",
    redeemUrl: "https://www.zendesk.com/startups",
    website: "https://www.zendesk.com/startups",
    steps: [
      "Visit Zendesk page",
      "Click Apply",
      "Fill details",
      "Submit",
      "Free plan activated"
    ]
  },
  {
    id: "salesforce",
    name: "Salesforce",
    logo: "https://www.google.com/s2/favicons?domain=salesforce.com&sz=128",
    description: "Salesforce provides CRM tools for managing sales, marketing, and customer relationships.",
    dealText: "Startup-friendly pricing",
    savings: "$5,000",
    memberCount: 6700,
    category: "customer",
    subcategory: "crm",
    redeemUrl: "https://www.salesforce.com/crm/startup-crm/",
    website: "https://www.salesforce.com/crm/startup-crm/",
    steps: [
      "Visit Salesforce page",
      "Click Get Started",
      "Create account",
      "Fill company details",
      "Choose plan",
      "Activate tools"
    ]
  },
  {
    id: "stripe-atlas",
    name: "Stripe Atlas",
    logo: "https://www.google.com/s2/favicons?domain=stripe.com&sz=128",
    description: "Stripe Atlas helps founders incorporate companies, set up banking, and access startup perks ecosystem.",
    dealText: "$150K+ partner perks + incorporation",
    savings: "$150,000",
    memberCount: 9000,
    category: "finance",
    subcategory: "payments",
    redeemUrl: "https://stripe.com/atlas",
    website: "https://stripe.com/atlas",
    steps: [
      "Visit Stripe Atlas",
      "Click Start your company",
      "Fill founder details",
      "Pay incorporation fee",
      "Company setup completed",
      "Access perks dashboard"
    ]
  },
  {
    id: "brex",
    name: "Brex",
    logo: "https://www.google.com/s2/favicons?domain=brex.com&sz=128",
    description: "Brex offers corporate cards and startup rewards with access to credits across tools.",
    dealText: "Startup rewards marketplace",
    savings: "$5,000",
    memberCount: 3000,
    category: "finance",
    subcategory: "payments",
    redeemUrl: "https://brex.com/startups",
    website: "https://brex.com/startups",
    steps: [
      "Visit Brex page",
      "Click Apply",
      "Enter company details",
      "Submit application",
      "Complete KYC",
      "Access rewards dashboard"
    ]
  },
  {
    id: "ramp",
    name: "Ramp",
    logo: "https://www.google.com/s2/favicons?domain=ramp.com&sz=128",
    description: "Ramp provides corporate cards and expense management with startup perks and rewards.",
    dealText: "Startup perks + rewards",
    savings: "$5,000",
    memberCount: 3200,
    category: "finance",
    subcategory: "payments",
    redeemUrl: "https://ramp.com/startups",
    website: "https://ramp.com/startups",
    steps: [
      "Visit Ramp page",
      "Click Get started",
      "Fill company details",
      "Submit application",
      "Complete verification",
      "Access rewards section"
    ]
  },
  {
    id: "revolut-business",
    name: "Revolut Business",
    logo: "https://www.google.com/s2/favicons?domain=revolut.com&sz=128",
    description: "Revolut Business provides global banking and financial tools for startups.",
    dealText: "6 months free plan",
    savings: "$600",
    memberCount: 2100,
    category: "finance",
    subcategory: "banking",
    redeemUrl: "mailto:hannah.bernasconi@revolut.com",
    website: "https://revolut.com",
    steps: [
      "Email Revolut team",
      "Request startup access",
      "Complete verification",
      "Get free plan activated"
    ]
  },
  {
    id: "gusto",
    name: "Gusto",
    logo: "https://www.google.com/s2/favicons?domain=gusto.com&sz=128",
    description: "Gusto provides payroll, HR, and employee management solutions.",
    dealText: "Startup discounts",
    savings: "$2,000",
    memberCount: 2700,
    category: "finance",
    subcategory: "hr",
    redeemUrl: "https://gusto.com/startups",
    website: "https://gusto.com/startups",
    steps: [
      "Visit Gusto page",
      "Click Get started",
      "Fill employee details",
      "Submit",
      "Discount applied"
    ]
  },
  {
    id: "revsh",
    name: "RevSh",
    logo: "https://www.google.com/s2/favicons?domain=revsh.com&sz=128",
    description: "RevSh provides revenue-sharing tools for partnerships and collaborations.",
    dealText: "$1,000 grant + 25% discount",
    savings: "$1,000",
    memberCount: 800,
    category: "finance",
    subcategory: "revenue",
    redeemUrl: "https://revsh.com/",
    website: "https://revsh.com/",
    steps: [
      "Visit RevSh",
      "Create account",
      "Use code REVSH25",
      "Set up revenue split",
      "Discount applied"
    ]
  },
  {
    id: "backblaze",
    name: "Backblaze",
    logo: "https://www.google.com/s2/favicons?domain=backblaze.com&sz=128",
    description: "Backblaze provides cloud storage and backup solutions for data-heavy startups.",
    dealText: "Up to $100,000 credits",
    savings: "$100,000",
    memberCount: 1900,
    category: "infrastructure",
    subcategory: "storage",
    redeemUrl: "https://www.backblaze.com/contact-sales/startup",
    website: "https://www.backblaze.com/contact-sales/startup",
    steps: [
      "Visit Backblaze page",
      "Apply for startup program",
      "Submit application",
      "Wait for review",
      "Credits allocated"
    ]
  },
  {
    id: "zoho",
    name: "Zoho",
    logo: "https://www.google.com/s2/favicons?domain=zoho.com&sz=128",
    description: "Zoho offers a suite of business tools including CRM, email, and accounting.",
    dealText: "1 year free suite",
    savings: "$1,000",
    memberCount: 4800,
    category: "productivity",
    subcategory: "business-tools",
    redeemUrl: "https://zoho.com/startups",
    website: "https://zoho.com/startups",
    steps: [
      "Visit Zoho startups page",
      "Click Apply",
      "Fill details",
      "Submit",
      "Suite activated"
    ]
  },
  {
    id: "typeform",
    name: "Typeform",
    logo: "https://www.google.com/s2/favicons?domain=typeform.com&sz=128",
    description: "Typeform helps create engaging forms and surveys for lead generation and feedback.",
    dealText: "Up to 75% discount",
    savings: "75% OFF",
    memberCount: 5300,
    category: "marketing",
    subcategory: "lead-generation",
    redeemUrl: "https://www.typeform.com/typeform-startups",
    website: "https://www.typeform.com/typeform-startups",
    steps: [
      "Visit Typeform page",
      "Apply for discount",
      "Submit startup details",
      "Get discount code",
      "Apply during checkout"
    ]
  },
  {
    id: "deel",
    name: "Deel",
    logo: "https://www.google.com/s2/favicons?domain=deel.com&sz=128",
    description: "Deel provides global hiring, payroll, and compliance solutions.",
    dealText: "Startup discounts",
    savings: "$2,000",
    memberCount: 3100,
    category: "finance",
    subcategory: "hr",
    redeemUrl: "https://deel.com/startups",
    website: "https://deel.com/startups",
    steps: [
      "Visit Deel page",
      "Click Apply",
      "Fill details",
      "Submit",
      "Discount activated"
    ]
  },
  {
    id: "box-ai",
    name: "Box AI Startup Program",
    logo: "https://www.google.com/s2/favicons?domain=box.com&sz=128",
    description: "Box provides enterprise cloud storage with AI integrations and startup partnership support.",
    dealText: "Enterprise tools + GTM support",
    savings: "$10,000+",
    memberCount: 1200,
    category: "infrastructure",
    subcategory: "storage",
    redeemUrl: "https://community.box.com/p/aistartups",
    website: "https://community.box.com/p/aistartups",
    steps: [
      "Visit Box AI startup page",
      "Click Apply",
      "Fill startup + AI use case",
      "Submit application",
      "Wait for review",
      "Onboarding starts after approval"
    ]
  },
  {
    id: "statsig",
    name: "Statsig",
    logo: "https://www.google.com/s2/favicons?domain=statsig.com&sz=128",
    description: "Statsig provides feature flags, experimentation, and analytics tools.",
    dealText: "$50,000 credits",
    savings: "$50,000",
    memberCount: 1800,
    category: "analytics",
    subcategory: "experimentation",
    redeemUrl: "https://statsig.com",
    website: "https://statsig.com",
    steps: [
      "Visit Statsig",
      "Sign up",
      "Create project",
      "Apply for startup credits",
      "Credits activated"
    ]
  },
  {
    id: "circleci",
    name: "CircleCI",
    logo: "https://www.google.com/s2/favicons?domain=circleci.com&sz=128",
    description: "CircleCI provides CI/CD pipelines for automating builds and deployments.",
    dealText: "400,000 free build minutes",
    savings: "$5,000",
    memberCount: 2600,
    category: "development",
    subcategory: "devops",
    redeemUrl: "https://circleci.com/open-source/",
    website: "https://circleci.com/open-source/",
    steps: [
      "Visit CircleCI page",
      "Apply for open source program",
      "Connect GitHub",
      "Submit repo",
      "Approval",
      "Minutes allocated"
    ]
  },
  {
    id: "scaleway",
    name: "Scaleway",
    logo: "https://www.google.com/s2/favicons?domain=scaleway.com&sz=128",
    description: "Scaleway provides cloud infrastructure including compute, storage, and AI workloads.",
    dealText: "€36,000 credits",
    savings: "€36,000",
    memberCount: 1500,
    category: "infrastructure",
    subcategory: "cloud",
    redeemUrl: "https://www.scaleway.com/en/startup-program/",
    website: "https://www.scaleway.com/en/startup-program/",
    steps: [
      "Visit Scaleway page",
      "Apply",
      "Submit details",
      "Wait approval",
      "Credits added"
    ]
  },
  {
    id: "gitlab",
    name: "GitLab",
    logo: "https://www.google.com/s2/favicons?domain=gitlab.com&sz=128",
    description: "GitLab is a DevOps platform for CI/CD, security, and collaboration.",
    dealText: "Free Ultimate licenses (1 year)",
    savings: "$19,000",
    memberCount: 4500,
    category: "development",
    subcategory: "devops",
    redeemUrl: "https://about.gitlab.com/solutions/startups/",
    website: "https://about.gitlab.com/solutions/startups/",
    steps: [
      "Visit GitLab startups page",
      "Apply",
      "Fill details",
      "Submit",
      "Licenses activated"
    ]
  },
  {
    id: "alchemy",
    name: "Alchemy",
    logo: "https://www.google.com/s2/favicons?domain=alchemy.com&sz=128",
    description: "Alchemy provides blockchain infrastructure and APIs for Web3 development.",
    dealText: "Web3 credits",
    savings: "$5,000",
    memberCount: 2200,
    category: "development",
    subcategory: "web3",
    redeemUrl: "https://www.alchemy.com/startup-program",
    website: "https://www.alchemy.com/startup-program",
    steps: [
      "Visit Alchemy page",
      "Apply",
      "Submit use case",
      "Wait approval",
      "Credits granted"
    ]
  },
  {
    id: "snowflake",
    name: "Snowflake",
    logo: "https://www.google.com/s2/favicons?domain=snowflake.com&sz=128",
    description: "Snowflake provides cloud data platform for analytics and AI workloads.",
    dealText: "Startup credits",
    savings: "$20,000",
    memberCount: 3000,
    category: "data",
    subcategory: "analytics",
    redeemUrl: "https://www.snowflake.com/en/why-snowflake/startup-program/",
    website: "https://www.snowflake.com/en/why-snowflake/startup-program/",
    steps: [
      "Visit Snowflake page",
      "Click Apply",
      "Submit details",
      "Approval",
      "Credits activated"
    ]
  },
  {
    id: "new-relic",
    name: "New Relic",
    logo: "https://www.google.com/s2/favicons?domain=newrelic.com&sz=128",
    description: "New Relic provides monitoring and observability tools for applications.",
    dealText: "100GB free data/month",
    savings: "$5,000",
    memberCount: 2600,
    category: "infrastructure",
    subcategory: "monitoring",
    redeemUrl: "https://newrelic.com/pricing/free-tier",
    website: "https://newrelic.com/pricing/free-tier",
    steps: [
      "Visit New Relic page",
      "Sign up",
      "Verify email",
      "Set up project",
      "Start using"
    ]
  },
  {
    id: "cleura",
    name: "Cleura",
    logo: "https://www.google.com/s2/favicons?domain=cleura.com&sz=128",
    description: "Cleura provides privacy-focused cloud infrastructure and credits for startups.",
    dealText: "Cloud credits",
    savings: "$10,000",
    memberCount: 900,
    category: "infrastructure",
    subcategory: "cloud",
    redeemUrl: "https://cleura.com/cleura-startup-program/",
    website: "https://cleura.com/cleura-startup-program/",
    steps: [
      "Visit Cleura page",
      "Apply",
      "Submit details",
      "Approval",
      "Start using credits"
    ]
  },
  {
    id: "fireworks-ai",
    name: "Fireworks AI",
    logo: "https://www.google.com/s2/favicons?domain=fireworks.ai&sz=128",
    description: "Fireworks provides AI inference infrastructure for generative AI startups.",
    dealText: "AI credits",
    savings: "$5,000",
    memberCount: 1300,
    category: "ai",
    subcategory: "ai-infra",
    redeemUrl: "https://fireworks.ai/startups",
    website: "https://fireworks.ai/startups",
    steps: [
      "Visit Fireworks page",
      "Apply",
      "Submit use case",
      "Approval",
      "Credits granted"
    ]
  },
  {
    id: "infura",
    name: "Infura",
    logo: "https://www.google.com/s2/favicons?domain=infura.io&sz=128",
    description: "Infura provides blockchain APIs for Ethereum and decentralized apps.",
    dealText: "API credits",
    savings: "$3,000",
    memberCount: 1800,
    category: "development",
    subcategory: "web3",
    redeemUrl: "https://www.infura.io/",
    website: "https://www.infura.io/",
    steps: [
      "Visit Infura",
      "Sign up",
      "Create project",
      "Get API keys",
      "Start building"
    ]
  },
  {
    id: "inworld-ai",
    name: "Inworld AI",
    logo: "https://www.google.com/s2/favicons?domain=inworld.ai&sz=128",
    description: "Inworld provides conversational AI tools for building virtual agents.",
    dealText: "AI credits",
    savings: "$4,000",
    memberCount: 1500,
    category: "ai",
    subcategory: "ai-agents",
    redeemUrl: "https://inworld.ai/",
    website: "https://inworld.ai/",
    steps: [
      "Visit Inworld AI",
      "Sign up",
      "Submit use case",
      "Approval",
      "Credits activated"
    ]
  },
  {
    id: "oracle",
    name: "Oracle for Startups",
    logo: "https://www.google.com/s2/favicons?domain=oracle.com&sz=128",
    description: "Oracle provides cloud credits and enterprise tools for startups.",
    dealText: "Cloud credits + support",
    savings: "$100,000",
    memberCount: 2400,
    category: "data",
    subcategory: "cloud",
    redeemUrl: "https://www.oracle.com/cloud/oracle-for-startups/",
    website: "https://www.oracle.com/cloud/oracle-for-startups/",
    steps: [
      "Visit Oracle page",
      "Apply",
      "Submit details",
      "Approval",
      "Credits granted"
    ]
  },
  {
    id: "siemens",
    name: "Siemens for Startups",
    logo: "https://www.google.com/s2/favicons?domain=siemens.com&sz=128",
    description: "Siemens offers industrial tools and partnership opportunities for startups.",
    dealText: "Industrial tools + partnerships",
    savings: "$20,000",
    memberCount: 1100,
    category: "infrastructure",
    subcategory: "industrial",
    redeemUrl: "https://www.siemens.com/en-us/company/innovation/startups/",
    website: "https://www.siemens.com/en-us/company/innovation/startups/",
    steps: [
      "Visit Siemens page",
      "Explore programs",
      "Apply",
      "Submit details",
      "Get shortlisted"
    ]
  },
  {
    id: "together-ai",
    name: "Together AI",
    logo: "https://www.google.com/s2/favicons?domain=together.ai&sz=128",
    description: "Together AI provides GPU infrastructure and inference credits for AI startups.",
    dealText: "GPU credits",
    savings: "$10,000",
    memberCount: 2000,
    category: "ai",
    subcategory: "ai-infra",
    redeemUrl: "https://www.together.ai/",
    website: "https://www.together.ai/",
    steps: [
      "Visit Together AI",
      "Sign up",
      "Apply for credits",
      "Submit use case",
      "Approval"
    ]
  },
  {
    id: "wiz",
    name: "Wiz",
    logo: "https://www.google.com/s2/favicons?domain=wiz.io&sz=128",
    description: "Wiz provides cloud security tools to detect vulnerabilities and secure infrastructure.",
    dealText: "Cloud security tools",
    savings: "$5,000",
    memberCount: 1700,
    category: "security",
    subcategory: "cloud-security",
    redeemUrl: "http://wiz.io/lp/startups",
    website: "http://wiz.io/lp/startups",
    steps: [
      "Visit Wiz page",
      "Click Get Started",
      "Fill details",
      "Submit application",
      "Access granted"
    ]
  },
  {
    id: "0x",
    name: "0x JumpStart",
    logo: "https://www.google.com/s2/favicons?domain=0x.org&sz=128",
    description: "0x provides APIs and infrastructure for Web3 and DeFi applications.",
    dealText: "$5,000 credits",
    savings: "$5,000",
    memberCount: 1400,
    category: "development",
    subcategory: "web3",
    redeemUrl: "https://0x.org/",
    website: "https://0x.org/",
    steps: [
      "Visit 0x",
      "Sign up",
      "Apply for JumpStart",
      "Get API keys",
      "Start building"
    ]
  },
  {
    id: "browserbase",
    name: "Browserbase",
    logo: "https://www.google.com/s2/favicons?domain=browserbase.com&sz=128",
    description: "Browserbase provides infrastructure for browser automation.",
    dealText: "Automation credits",
    savings: "$3,000",
    memberCount: 800,
    category: "development",
    subcategory: "automation",
    redeemUrl: "https://www.browserbase.com/startups",
    website: "https://www.browserbase.com/startups",
    steps: [
      "Visit Browserbase",
      "Sign up",
      "Apply for credits",
      "Submit use case",
      "Approval"
    ]
  },
  {
    id: "mercury",
    name: "Mercury",
    logo: "https://www.google.com/s2/favicons?domain=mercury.com&sz=128",
    description: "Mercury provides startup banking and access to curated perks.",
    dealText: "Startup perks ecosystem",
    savings: "$5,000",
    memberCount: 3600,
    category: "finance",
    subcategory: "banking",
    redeemUrl: "https://mercury.com/perks",
    website: "https://mercury.com/perks",
    steps: [
      "Visit Mercury perks page",
      "Sign up",
      "Browse perks",
      "Select deal",
      "Activate benefits"
    ]
  }
];

// Helper functions to filter deals
export const getMostPopularDeals = () => 
  [...dealsData].sort((a, b) => b.memberCount - a.memberCount).slice(0, 12);

export const getFreeDeals = () => 
  dealsData.filter(deal => deal.isFree).slice(0, 12);

export const getPremiumDeals = () => 
  dealsData.filter(deal => deal.isPremium).slice(0, 12);

export const getRecentlyAddedDeals = () => 
  [...dealsData].reverse().slice(0, 12);

export const getDaysUntilExpiry = (expiresAt?: string): number | null => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getExpiryLabel = (expiresAt?: string): { label: string; urgent: boolean } | null => {
  const days = getDaysUntilExpiry(expiresAt);
  if (days === null) return null;
  if (days < 0) return { label: "Expired", urgent: true };
  if (days === 0) return { label: "Expires today!", urgent: true };
  if (days <= 3) return { label: `Expires in ${days}d`, urgent: true };
  if (days <= 14) return { label: `${days} days left`, urgent: false };
  return { label: `${days} days left`, urgent: false };
};

export const getDealsByCollection = (collection: string) =>
  dealsData.filter(d => d.collection === collection);

export const getCollections = () => {
  const map: Record<string, { id: string; name: string; description: string; icon: string; count: number }> = {
    "yc-starter-kit": { id: "yc-starter-kit", name: "YC Starter Kit", description: "Essential tools for YC & early-stage founders", icon: "ðŸš€", count: 0 },
    "growth-stack":   { id: "growth-stack",   name: "Growth Stack",   description: "Best deals for scaling marketing & sales",       icon: "ðŸ“ˆ", count: 0 },
    "free-tools":     { id: "free-tools",     name: "Free Tools",     description: "Zero cost â€” 100% free plans & trials",           icon: "ðŸŽ", count: 0 },
    "dev-essentials": { id: "dev-essentials", name: "Dev Essentials", description: "Must-have tools for every engineering team",     icon: "âš™ï¸", count: 0 },
    "ai-stack":       { id: "ai-stack",       name: "AI Stack",       description: "Best AI tools with exclusive startup discounts", icon: "ðŸ¤–", count: 0 },
  };
  dealsData.forEach(d => { if (d.collection && map[d.collection]) map[d.collection].count++; });
  return Object.values(map).filter(c => c.count > 0);
};


export const getDealsByCategory = (category: string) => 
  dealsData.filter(deal => deal.category === category);

export const getSecretPicks = () => 
  dealsData.filter(deal => deal.isPick);

