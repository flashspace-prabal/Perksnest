// Centralized deals data with reliable logo URLs
export interface Deal {
  id: string;
  name: string;
  logo: string;
  description: string;
  dealText: string;
  savings: string;
  memberCount: number;
  isPremium?: boolean;
  isFree?: boolean;
  isPick?: boolean;
  category: string;
}

export const dealsData: Deal[] = [
  {
    id: "notion",
    name: "Notion",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    description: "Organize teamwork and increase productivity",
    dealText: "6 months free on the Business plan with Unlimited AI",
    savings: "$12,000",
    memberCount: 14307,
    isFree: true,
    isPick: true,
    category: "project",
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    description: "Manage your online payments",
    dealText: "Waived Stripe fees on your next $20,000 in payment processing",
    savings: "$500",
    memberCount: 5721,
    isPremium: true,
    isFree: false,
    isPick: true,
    category: "finance",
  },
  {
    id: "google-cloud",
    name: "Google Cloud (GCP)",
    logo: "https://www.gstatic.com/devrel-devsite/prod/v0e0f589edd85502a40d78d7d0825db8ea5ef3b99ab4070381ee86977c9168730/cloud/images/favicons/onecloud/super_cloud.png",
    description: "Cloud services by Google",
    dealText: "$2,000 in credits for 1 year if you never raised funds // $350,000 in credits for 2 years if you did",
    savings: "$350,000",
    memberCount: 9663,
    isFree: true,
    category: "data",
  },
  {
    id: "make",
    name: "Make",
    logo: "https://www.make.com/en/apple-touch-icon.png",
    description: "A no-code AI platform for limitless automation",
    dealText: "First month free on Pro plan (10,000 credits) + 40% off Pro or Teams annual plans",
    savings: "$283",
    memberCount: 9806,
    isFree: true,
    category: "ai",
  },
  {
    id: "brevo",
    name: "Brevo (ex. Sendinblue)",
    logo: "https://www.brevo.com/wp-content/uploads/2024/01/Logo.svg",
    description: "Centralize marketing and sales tools to increase your growth",
    dealText: "75% off the annual Starter and Standard Plans",
    savings: "$5,661",
    memberCount: 4234,
    isFree: true,
    isPick: true,
    category: "marketing",
  },
  {
    id: "zoom",
    name: "Zoom Meetings",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg",
    description: "Communication and collaboration platform",
    dealText: "30% off Zoom One Pro or Zoom One Business for 1 year",
    savings: "$1,200",
    memberCount: 1862,
    isFree: true,
    category: "communication",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png",
    description: "CRM, marketing automation & customer service software suite",
    dealText: "30% off Professional and Enterprise plans for 1 year across all Hubspot products",
    savings: "$2,000",
    memberCount: 2616,
    isFree: true,
    category: "customer",
  },
  {
    id: "slack",
    name: "Slack",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
    description: "Enhance team communication and collaboration",
    dealText: "25% off new plan purchases",
    savings: "$9,000",
    memberCount: 3208,
    isFree: true,
    category: "communication",
  },
  {
    id: "figma",
    name: "Figma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    description: "Collaborative interface design tool",
    dealText: "50% off Professional plan for startups",
    savings: "$600",
    memberCount: 7821,
    isFree: true,
    category: "development",
  },
  {
    id: "airtable",
    name: "Airtable",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg",
    description: "Easily store and organize your data",
    dealText: "$1,000 in credits for 1 year",
    savings: "$1,000",
    memberCount: 7431,
    isPremium: true,
    isFree: false,
    category: "project",
  },
  {
    id: "aws",
    name: "AWS Activate",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    description: "Amazon's cloud services platform",
    dealText: "Up to $100,000 in credits or 20-50% off your monthly spend",
    savings: "$300,000",
    memberCount: 5729,
    isFree: true,
    isPick: true,
    category: "data",
  },
  {
    id: "intercom",
    name: "Intercom",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/Intercom_logo.svg",
    description: "Strengthen relationships with your customers",
    dealText: "1 year free on the Advanced plan",
    savings: "$3,108",
    memberCount: 2754,
    isFree: true,
    category: "customer",
  },
  {
    id: "digitalocean",
    name: "DigitalOcean",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg",
    description: "Cloud Computing Platform",
    dealText: "$200 in credits",
    savings: "$200",
    memberCount: 5788,
    isFree: true,
    category: "data",
  },
  {
    id: "monday",
    name: "Monday",
    logo: "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/monday-logo-x2.png",
    description: "Easily manage all your projects and become more productive",
    dealText: "First month free",
    savings: "$80",
    memberCount: 1315,
    isFree: true,
    category: "project",
  },
  {
    id: "semrush",
    name: "Semrush",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Semrush_logo.png",
    description: "Be more visible in search results and increase qualified traffic",
    dealText: "14 days free on the Pro and Guru plans",
    savings: "$125",
    memberCount: 2492,
    isFree: true,
    category: "marketing",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Zendesk_logo.svg",
    description: "Create a customer success support suite",
    dealText: "6 months free",
    savings: "$50,000",
    memberCount: 2382,
    isFree: true,
    category: "customer",
  },
  {
    id: "clickup",
    name: "ClickUp",
    logo: "https://clickup.com/landing/images/clickup-logo-gradient.png",
    description: "Boost your productivity",
    dealText: "20% off Unlimited and Business plans for 1 year",
    savings: "$1,000",
    memberCount: 3033,
    isFree: true,
    category: "project",
  },
  {
    id: "perplexity",
    name: "Perplexity AI",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.png",
    description: "From questions to clarity",
    dealText: "3 months free on the Enterprise Pro plan (up to 50 seats)",
    savings: "$6,000",
    memberCount: 1282,
    isFree: true,
    category: "ai",
  },
  {
    id: "webflow",
    name: "Webflow",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Webflow_logo.svg",
    description: "Build beautiful and powerful websites",
    dealText: "1 year free on a CMS site plan",
    savings: "$348",
    memberCount: 4158,
    isPremium: true,
    isFree: false,
    category: "development",
  },
  {
    id: "shopify",
    name: "Shopify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    description: "Optimize the creation and management of your e-commerce website",
    dealText: "$1/month for the first 3 months + 25% off annual plans",
    savings: "$2,734",
    memberCount: 1876,
    isFree: true,
    category: "sales",
  },
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

export const getDealsByCategory = (category: string) => 
  dealsData.filter(deal => deal.category === category);

export const getSecretPicks = () => 
  dealsData.filter(deal => deal.isPick);
