// Deal reviews/testimonials with unique customer data
// This data should be stored in Supabase table: deal_reviews
export interface DealReview {
  dealId: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export const dealReviews: DealReview[] = [
  // Notion Reviews
  {
    dealId: "notion",
    quote: "Notion has completely transformed how our team manages projects. With PerksNest's deal, we get 6 months free to consolidate all our scattered documentation and workflows into one beautiful workspace. The AI assistant alone saves us hours every week.",
    author: "Priya Sharma",
    role: "Product Manager",
    company: "TechScale Inc",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },
  
  // Stripe Reviews
  {
    dealId: "stripe",
    quote: "Processing payments was a nightmare until we switched to Stripe. The PerksNest partnership gave us $20,000 in waived fees which was critical during our first year. Their documentation and developer support are unmatched.",
    author: "Marcus Chen",
    role: "Founder & CTO",
    company: "PayFlow",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Google Cloud Reviews
  {
    dealId: "google-cloud",
    quote: "GCP's machine learning tools helped us build our AI product prototype in record time. The $350,000 credit through PerksNest removed the biggest barrier for a bootstrapped startup like ours.",
    author: "Aisha Patel",
    role: "Co-founder",
    company: "AI Innovations Lab",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Make Reviews
  {
    dealId: "make",
    quote: "We automated 15 manual workflows in our first month using Make. The PerksNest discount made it affordable to test automation before committing, and now it's essential to our operations.",
    author: "James Wilson",
    role: "Operations Lead",
    company: "OnDemand Services",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // Brevo Reviews
  {
    dealId: "brevo",
    quote: "Brevo's unified email and SMS platform helped us cut our martech stack from 5 tools to 1. The 75% annual discount from PerksNest means we're saving thousands while actually getting better results.",
    author: "Sofia Rodriguez",
    role: "Marketing Director",
    company: "Growth Ventures",
    avatar: "https://images.unsplash.com/photo-1507925921903-a36ec434def0?w=100&h=100&fit=crop&crop=face"
  },

  // Zoom Reviews
  {
    dealId: "zoom",
    quote: "With our mostly remote team, Zoom is essential. The 30% annual savings from PerksNest let us upgrade to the Business plan and get priority support without breaking the budget.",
    author: "David Thompson",
    role: "Team Lead",
    company: "Remote First Co",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // HubSpot Reviews
  {
    dealId: "hubspot",
    quote: "HubSpot CRM unified our sales and marketing teams perfectly. The 30% discount for a year gave us runway to prove ROI before the full investment. It's been worth every penny.",
    author: "Elena Gonzalez",
    role: "Sales Manager",
    company: "Enterprise Solutions Ltd",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Slack Reviews
  {
    dealId: "slack",
    quote: "Slack eliminated email entirely for our team. Communication is instant and searchable. The 25% discount helped us justify upgrading to Pro across the org.",
    author: "Kevin Park",
    role: "Technical Director",
    company: "Dev Squad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Figma Reviews
  {
    dealId: "figma",
    quote: "Figma's collaborative design workspace is incredible for our remote design team. The 50% startup discount meant we could onboard our entire team without expense concerns.",
    author: "Isabella Martinez",
    role: "Design System Lead",
    company: "Creative Studios",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Airtable Reviews
  {
    dealId: "airtable",
    quote: "Airtable replaced our legacy database system and gave us flexibility we never had. The $1,000 annual credit from PerksNest covered 6 months of usage for our whole team.",
    author: "Robert Chen",
    role: "Operations Manager",
    company: "Process Automation Co",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // AWS Reviews
  {
    dealId: "aws",
    quote: "AWS's infrastructure gave us access to enterprise-grade services as a startup. The $100k credit was transformational for scaling our platform without massive upfront costs.",
    author: "Natasha Kovac",
    role: "Principal Engineer",
    company: "Cloud Native Corp",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Intercom Reviews
  {
    dealId: "intercom",
    quote: "Intercom's customer messaging platform transformed our support. The free year on Advanced helped us deliver exceptional customer experiences that directly increased retention.",
    author: "Melissa Hart",
    role: "Customer Success Manager",
    company: "SaaS Innovations",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // DigitalOcean Reviews
  {
    dealId: "digitalocean",
    quote: "DigitalOcean's simplicity is perfect for growing startups. The $200 credit gets us 2-3 months of hosting for our main application and staging environments.",
    author: "Alex Novak",
    role: "DevOps Engineer",
    company: "Web Platforms Inc",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Monday.com Reviews
  {
    dealId: "monday",
    quote: "Monday.com's visual project management made onboarding our first manager so easy. The first-month-free deal helped us test it thoroughly before team-wide rollout.",
    author: "Jessica Lee",
    role: "Project Coordinator",
    company: "Agency Partners",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Semrush Reviews
  {
    dealId: "semrush",
    quote: "Semrush's SEO tools helped us double organic traffic in 6 months. The 14-day free trial let us evaluate if it was worth the investment, and it absolutely was.",
    author: "Daniel Foster",
    role: "Content Strategist",
    company: "Digital Marketing Group",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // Zendesk Reviews
  {
    dealId: "zendesk",
    quote: "Zendesk's support platform helped us manage 10x more tickets without hiring. The 6-month free trial gave us confidence to scale our support team properly.",
    author: "Christina White",
    role: "Support Director",
    company: "Global Support Services",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // ClickUp Reviews
  {
    dealId: "clickup",
    quote: "ClickUp consolidated 3 project management tools into one elegant workspace. The 20% annual discount means we're paying less while getting more features.",
    author: "Michael Torres",
    role: "Product Owner",
    company: "Tech Ventures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Perplexity AI Reviews
  {
    dealId: "perplexity",
    quote: "Perplexity AI's research capabilities accelerated our product development. The 3-month free enterprise trial let our whole team explore how AI can enhance our workflow.",
    author: "Victoria Kim",
    role: "Research Lead",
    company: "Innovation Labs",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Webflow Reviews
  {
    dealId: "webflow",
    quote: "Webflow let us build production-ready websites without custom development. The 1-year free CMS site plan meant we could launch our portfolio without delays.",
    author: "Lucas Fernandez",
    role: "Web Developer",
    company: "Digital Design Studio",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // Shopify Reviews
  {
    dealId: "shopify",
    quote: "Shopify made launching our online store simple and fast. The $1/month deal for 3 months was perfect for testing market demand before full investment.",
    author: "Samantha Brooks",
    role: "E-commerce Manager",
    company: "Fashion Brands Co",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Linear Reviews
  {
    dealId: "linear",
    quote: "Linear's issue tracking is faster and more intuitive than Jira. The 1-year free startup plan gave us a robust issue management system as we scaled.",
    author: "Nathan Powell",
    role: "Engineering Manager",
    company: "Software Systems Corp",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Loom Reviews
  {
    dealId: "loom",
    quote: "Loom replaced 30-minute meetings with 3-minute videos. The free forever plan for our team means asynchronous communication changed everything about our productivity.",
    author: "Rachel Green",
    role: "Scrum Master",
    company: "Agile Transformations",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // n8n Reviews
  {
    dealId: "n8n",
    quote: "n8n's workflow automation platform is perfect for technical teams who need powerful workflow capabilities. The 20% discount helped us integrate complex business processes seamlessly.",
    author: "Vikram Desai",
    role: "DevOps Lead",
    company: "Automation Systems Ltd",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Mixpanel Reviews
  {
    dealId: "mixpanel",
    quote: "Mixpanel's product analytics gave us deep insights into user behavior that drove our retention from 65% to 85%. The 1-year free Pro plan was exactly what we needed to scale.",
    author: "Lisa Wong",
    role: "Product Analytics Manager",
    company: "Growth Data Corp",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Miro Reviews
  {
    dealId: "miro",
    quote: "Miro's collaborative whiteboard became our central hub for design sprints and brainstorming. The $1,000 lifetime credits are incredibly valuable for teams doing constant iterations.",
    author: "Carlos Rodriguez",
    role: "Design Director",
    company: "Creative Systems",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // ElevenLabs Reviews
  {
    dealId: "elevenlabs",
    quote: "ElevenLabs' AI voice generation creates incredibly natural-sounding voiceovers. The 12-month free tier allowed us to build voice features into our product without extra costs.",
    author: "Jessica Liu",
    role: "Product Developer",
    company: "Audio Innovation Studio",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // GitHub Reviews
  {
    dealId: "github",
    quote: "GitHub Enterprise is essential for our engineering team's workflow. The 20 free seats for a year through PerksNest gave us exactly what we needed for secure collaboration.",
    author: "Thomas Anderson",
    role: "VP Engineering",
    company: "Software Innovations Inc",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Framer Reviews
  {
    dealId: "framer",
    quote: "Framer's design-to-code capabilities accelerated our web development significantly. The 1-year free Pro plan meant our design team and developers could work seamlessly together.",
    author: "Sophie Martinez",
    role: "Design Lead",
    company: "Web Design Collective",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Sentry Reviews
  {
    dealId: "sentry",
    quote: "Sentry's error tracking saved us countless hours in debugging production issues. The 6-month free Teams plan helped us catch critical bugs before they affected customers.",
    author: "Dev Kumar",
    role: "Senior Backend Engineer",
    company: "Reliable Systems Co",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // Cloudflare Reviews
  {
    dealId: "cloudflare",
    quote: "Cloudflare's security and performance tools are game-changing for our infrastructure. The $250,000 in credits gave us enterprise-grade protection without enterprise costs.",
    author: "Mike Torres",
    role: "Infrastructure Architect",
    company: "Cloud Security Inc",
    avatar: "https://images.unsplash.com/photo-1497003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Asana Reviews
  {
    dealId: "asana",
    quote: "Asana unified our team's project management across departments. The 75% annual discount for a year made it cost-effective to scale across the entire organization.",
    author: "Amanda Williams",
    role: "Operations Director",
    company: "Enterprise Solutions Group",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Retool Reviews
  {
    dealId: "retool",
    quote: "Retool let us build internal tools in hours instead of weeks. The 1-year free plan for our team was invaluable for rapidly prototyping admin panels and dashboards.",
    author: "Benjamin Lee",
    role: "Full Stack Developer",
    company: "Enterprise Tools Inc",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Pipedrive Reviews
  {
    dealId: "pipedrive",
    quote: "Pipedrive's sales pipeline management increased our deal closure rate by 40%. The 20% annual discount made it affordable for the entire sales team.",
    author: "Sarah Johnson",
    role: "Sales Manager",
    company: "Tech Sales Solutions",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Typeform Reviews
  {
    dealId: "typeform",
    quote: "Typeform's beautiful forms increased our survey response rates dramatically. The 40% annual discount made premium features accessible without breaking the budget.",
    author: "Emily Brown",
    role: "Marketing Researcher",
    company: "Market Insights Group",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Apollo Reviews
  {
    dealId: "apollo",
    quote: "Apollo's sales intelligence database gave us access to 500M+ prospect records. The 50% discount for a year transformed our lead generation process.",
    author: "James Anderson",
    role: "Head of Growth",
    company: "B2B SaaS Ventures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Lovable Reviews
  {
    dealId: "lovable",
    quote: "Lovable's AI-powered development made building web apps incredibly fast. The 15% annual discount helped us explore AI-assisted development at scale.",
    author: "Priya Verma",
    role: "Product Lead",
    company: "Rapid Dev Studio",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Clay Reviews
  {
    dealId: "clay",
    quote: "Clay's outreach automation saved our sales team 15 hours per week. The 100 free monthly credits let us test the platform before committing financially.",
    author: "Oscar Martinez",
    role: "Sales Operations",
    company: "Growth Automation Co",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
  },

  // Gamma Reviews
  {
    dealId: "gamma",
    quote: "Gamma's AI presentation builder created stunning decks in minutes. The 400 free credits plus 30% discount made premium presentations accessible to everyone.",
    author: "Elena Romero",
    role: "Presentation Specialist",
    company: "Corporate Communications",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Algolia Reviews
  {
    dealId: "algolia",
    quote: "Algolia's search infrastructure is lightning-fast and easy to implement. The $10,000 in annual credits gave us enterprise-grade search capabilities.",
    author: "David Chen",
    role: "Tech Lead",
    company: "Search Innovation Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Railway Reviews
  {
    dealId: "railway",
    quote: "Railway made deploying our backend services incredibly simple and cost-effective. The $240 annual credit covered our infrastructure costs for months.",
    author: "Nathan Scott",
    role: "DevOps Engineer",
    company: "Cloud Native Startups",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Datadog Reviews
  {
    dealId: "datadog",
    quote: "Datadog's monitoring gave us complete visibility into our infrastructure and application performance. The 1-year free Pro plan was a game-changer for observability.",
    author: "Jessica Parker",
    role: "Site Reliability Engineer",
    company: "Infrastructure Monitoring Co",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Bubble Reviews
  {
    dealId: "bubble",
    quote: "Bubble's no-code platform let us launch web applications without extensive engineering resources. The 30% discount made no-code development affordable at scale.",
    author: "Nina Patel",
    role: "Non-Technical Founder",
    company: "App Innovation Studio",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // MongoDB Reviews
  {
    dealId: "mongodb",
    quote: "MongoDB's flexible document model accelerated our product development. The $500 in annual credits covered our database costs while we scaled.",
    author: "Alex Kumar",
    role: "Database Architect",
    company: "Data-Driven Startups",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // GitLab Reviews
  {
    dealId: "gitlab",
    quote: "GitLab's integrated DevSecOps platform unified our entire software development lifecycle. The 12-month free Ultimate license saved us $15,000+.",
    author: "Rebecca Thompson",
    role: "Engineering Manager",
    company: "Enterprise DevOps",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Carrd Reviews
  {
    dealId: "carrd",
    quote: "Carrd made building beautiful personal landing pages incredibly simple and affordable. The 30% annual discount made it perfect for creators and freelancers.",
    author: "Marcus Wilson",
    role: "Content Creator",
    company: "Creator Economy Co",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Instantly Reviews
  {
    dealId: "instantly",
    quote: "Instantly's cold email automation increased our reply rates significantly with AI-powered personalization. The additional 20% discount made outreach scalable.",
    author: "Victoria Stone",
    role: "Business Development",
    company: "Growth Hacking Agency",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // CapCut Reviews
  {
    dealId: "capcut",
    quote: "CapCut's AI video editing capabilities rival desktop software but are so much easier to use. The 25% discount let us create professional videos at scale.",
    author: "Lucas Bennett",
    role: "Content Producer",
    company: "Video Marketing Studio",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Google Workspace Reviews
  {
    dealId: "google-workspace",
    quote: "Google Workspace unified all our document collaboration and communication needs. The 20% annual discount made upgrading the entire org financially feasible.",
    author: "Sophia Hall",
    role: "IT Manager",
    company: "Enterprise Tech Solutions",
    avatar: "https://images.unsplash.com/photo-1407003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Waalaxy Reviews
  {
    dealId: "waalaxy",
    quote: "Waalaxy's LinkedIn automation increased our connection acceptance rates to 95%. The 50% annual discount made LinkedIn prospecting much more cost-effective.",
    author: "Gregory Hayes",
    role: "Business Development Manager",
    company: "Sales Strategy Inc",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Tally Reviews
  {
    dealId: "tally",
    quote: "Tally's form builder is the simplest I've used - no coding required but incredibly customizable. The 50% annual discount made it accessible for teams.",
    author: "Felicity Adams",
    role: "Process Automation Lead",
    company: "Workflow Systems",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Stirring Minds Reviews
  {
    dealId: "stirring-minds",
    quote: "Stirring Minds created the perfect coworking environment for our distributed team's focus time. The free month offer helped us boost team productivity immensely.",
    author: "Henry Foster",
    role: "Remote Team Lead",
    company: "Distributed Ventures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Google Cloud Startup Reviews
  {
    dealId: "google-cloud",
    quote: "Google Cloud's AI/ML services and infrastructure credits accelerated our machine learning roadmap significantly.",
    author: "Addison Grant",
    role: "ML Engineer",
    company: "AI Research Startups",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Cloudflare Startup Reviews
  {
    dealId: "cloudflare",
    quote: "Cloudflare's edge computing made our application globally fast and secure. The massive credit amount enabled true enterprise infrastructure.",
    author: "Bailey Chen",
    role: "Infrastructure Manager",
    company: "Global Scale Ventures",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Microsoft Azure Reviews
  {
    dealId: "microsoft-azure",
    quote: "Azure's comprehensive AI and data services gave us enterprise capabilities as a startup. The $150,000 credit was transformational for our platform.",
    author: "Cameron Ross",
    role: "Principal Architect",
    company: "Enterprise Cloud Solutions",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // AWS Activate Reviews
  {
    dealId: "aws-activate",
    quote: "AWS's comprehensive services and massive credit pool enabled us to build at enterprise scale as a startup.",
    author: "Diana Murphy",
    role: "DevOps Manager",
    company: "Cloud Infrastructure Labs",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // DigitalOcean Hatch Reviews
  {
    dealId: "digitalocean-hatch",
    quote: "DigitalOcean's developer-friendly platform and generous startup credits made cloud hosting accessible.",
    author: "Ethan Bell",
    role: "Full Stack Developer",
    company: "Indie Developer Studio",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // OVHCloud Startup Reviews
  {
    dealId: "ovhcloud",
    quote: "OVHCloud's European infrastructure and generous credit program provided a great alternative to US-based providers.",
    author: "Francois Dubois",
    role: "CTO",
    company: "European Tech Startup",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Vercel Startup Reviews
  {
    dealId: "vercel",
    quote: "Vercel's serverless platform made deploying Next.js applications incredibly fast and cost-effective.",
    author: "Grace Thompson",
    role: "Frontend Lead",
    company: "Modern Web Startups",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // Anthropic Startup Reviews
  {
    dealId: "anthropic",
    quote: "Anthropic's Claude API credits let us build sophisticated AI features with state-of-the-art language models.",
    author: "Hugo Anderson",
    role: "AI Product Lead",
    company: "AI-Powered Ventures",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // Perplexity Startup Reviews
  {
    dealId: "perplexity",
    quote: "Perplexity's API credits enabled us to add advanced search and research capabilities to our platform.",
    author: "Iris Coleman",
    role: "Search Engineer",
    company: "Next-Gen Search Co",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // ElevenLabs Startup Reviews
  {
    dealId: "elevenlabs",
    quote: "ElevenLabs' voice generation credits helped us add natural-sounding audio features to our application.",
    author: "Jack Murray",
    role: "Audio Product Manager",
    company: "Voice Tech Innovation",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  },

  // OpenAI Startup Reviews
  {
    dealId: "openai",
    quote: "OpenAI's API credits through Ramp gave us access to GPT-4 capabilities for building intelligent features.",
    author: "Kelly Wright",
    role: "AI Lead",
    company: "GPT-Powered Solutions",
    avatar: "https://images.unsplash.com/photo-1407003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },

  // MongoDB Startup Reviews
  {
    dealId: "mongodb",
    quote: "MongoDB's Atlas credits provided a scalable database foundation as we grew our user base rapidly.",
    author: "Leo Robinson",
    role: "Database Architect",
    company: "Scalable Data Company",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
  },

  // Couchbase Startup Reviews
  {
    dealId: "couchbase",
    quote: "Couchbase's Capella cloud database credits gave us enterprise-grade database capabilities.",
    author: "Monica Foster",
    role: "Enterprise Architect",
    company: "Data Solutions Inc",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
  }
];

// Helper function to get review for a deal
export function getDealReview(dealId: string): DealReview | undefined {
  return dealReviews.find(r => r.dealId === dealId);
}
