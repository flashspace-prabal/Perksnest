// Extended deal information for all products
// Contains tagline, features, use cases, and premium testimonials
// This data will eventually come from Supabase

export interface ExtendedDealInfo {
  tagline: string;
  longDescription: string;
  subcategory: string;
  rating: number;
  reviewCount: number;
  features?: string[];
  useCases?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export const dealExtendedInfoMap: Record<string, ExtendedDealInfo> = {
  "notion": {
    tagline: "The all-in-one workspace for your notes, tasks, wikis, and databases",
    longDescription: "Notion is a unified workspace where knowledge and teamwork come together. It combines note-taking, project management, database creation, and wikis in one collaborative platform. Perfect for startups, teams, and individuals who want to organize their work, documents, and ideas in a centralized hub with powerful AI capabilities.",
    subcategory: "Collaboration Software",
    rating: 4.5,
    reviewCount: 50,
    features: [
      "Flexible workspace with blocks and components",
      "Database creation and powerful filtering",
      "Team collaboration and comments",
      "AI-powered writing assistant",
      "Integration with 100+ apps",
      "Version history and backups"
    ],
    useCases: [
      "Project management and tracking",
      "Team documentation and wikis",
      "Product roadmaps",
      "Meeting notes and action items",
      "CRM and lead tracking",
      "Content planning calendars"
    ],
  },
  "stripe": {
    tagline: "Payment infrastructure for the internet",
    longDescription: "Stripe is a financial infrastructure platform that enables businesses of all sizes to accept payments, manage their finances, and scale globally. Built for developers and business teams, Stripe handles complex payment processing, fraud prevention, and compliance so you can focus on growth.",
    subcategory: "Payment Processing",
    rating: 4.8,
    reviewCount: 120,
    features: [
      "Accept payments from customers worldwide",
      "Support for 135+ currencies",
      "Advanced fraud detection and prevention",
      "Detailed analytics and reporting",
      "Subscription and billing management",
      "Marketplace and split payouts"
    ],
    useCases: [
      "E-commerce and online stores",
      "SaaS and subscription billing",
      "Marketplace platforms",
      "In-app purchases",
      "Invoice and payment links",
      "Global expansion with local payments"
    ],
  },
  "google-cloud": {
    tagline: "Build on the world's most reliable cloud infrastructure",
    longDescription: "Google Cloud Platform (GCP) is a comprehensive suite of cloud computing services that powers some of the world's largest applications and businesses. Built on Google's own infrastructure, GCP offers compute, storage, databases, networking, AI/ML, and analytics solutions.",
    subcategory: "Cloud Computing",
    rating: 4.6,
    reviewCount: 85,
    features: [
      "Compute Engine for virtual machines",
      "Cloud Storage with 99.99% availability",
      "BigQuery for data analytics",
      "Cloud SQL and Firestore databases",
      "Cloud Run for serverless containers",
      "Vertex AI for machine learning"
    ],
    useCases: [
      "Web and mobile app hosting",
      "Data warehousing and analytics",
      "Machine learning model training",
      "Real-time data processing",
      "Backup and disaster recovery",
      "Microservices architectures"
    ],
  },
  "make": {
    tagline: "Connect your favorite apps with powerful automations",
    longDescription: "Make (formerly Integromat) is a visual lowcode automation platform that connects apps and automates businesses processes. With an intuitive drag-and-drop interface, anyone can build complex workflows without coding, saving time and reducing manual errors across the organization.",
    subcategory: "Automation Platform",
    rating: 4.4,
    reviewCount: 65,
    features: [
      "Drag-and-drop workflow builder",
      "1000+ pre-built app integrations",
      "Advanced logic and data transformation",
      "Conditional branching and loops",
      "Error handling and retry logic",
      "Real-time monitoring and logging"
    ],
    useCases: [
      "Lead management automation",
      "Data synchronization between apps",
      "CRM and marketing automation",
      "Invoice and billing automation",
      "Slack notifications and alerts",
      "Social media posting automation"
    ],
  },
  "brevo": {
    tagline: "All-in-one marketing and sales automation",
    longDescription: "Brevo (formerly Sendinblue) is a unified marketing and sales automation platform combining email marketing, SMS campaigns, CRM, and customer data tools. It helps businesses reach customers at every stage of their journey with powerful segmentation and personalization.",
    subcategory: "Marketing Automation",
    rating: 4.3,
    reviewCount: 78,
    features: [
      "Email marketing with advanced segmentation",
      "SMS and WhatsApp messaging",
      "CRM and contact management",
      "Transactional SMS and emails",
      "Marketing automation workflows",
      "Detailed analytics and reporting"
    ],
    useCases: [
      "Email campaign management",
      "Customer retention campaigns",
      "Transactional communications",
      "Lead nurturing workflows",
      "Abandoned cart recovery",
      "Customer reactivation"
    ],
  },
  "zoom": {
    tagline: "Meeting, webinar, and messaging platform",
    longDescription: "Zoom is the leading video conferencing solution enabling seamless communication for remote teams, meetings, webinars, and events. With crystal-clear HD video and audio, screen sharing, and collaboration features, Zoom connects teams anywhere.",
    subcategory: "Communication Platform",
    rating: 4.5,
    reviewCount: 140,
    features: [
      "HD video and audio conferencing",
      "Screen sharing and annotation",
      "Recording and transcription",
      "Breakout rooms for group discussions",
      "Virtual backgrounds and filters",
      "Integration with calendar and chat"
    ],
    useCases: [
      "Team meetings and standup",
      "Client presentations",
      "Webinars and training",
      "One-on-one interviews",
      "Town halls and all-hands",
      "Remote team collaboration"
    ],
  },
  "hubspot": {
    tagline: "CRM platform for sales, marketing, and service",
    longDescription: "HubSpot is a leading CRM platform that combines sales, marketing, and customer service tools in one integrated system. HubSpot helps teams align around the customer and deliver exceptional experiences throughout their journey.",
    subcategory: "CRM Platform",
    rating: 4.6,
    reviewCount: 95,
    features: [
      "Contact and company management",
      "Sales pipeline and forecasting",
      "Email tracking and automation",
      "Landing page and form builder",
      "Ticketing and customer support",
      "Reporting and analytics"
    ],
    useCases: [
      "Sales pipeline management",
      "Lead scoring and nurturing",
      "Customer support and retention",
      "Marketing campaign tracking",
      "Revenue forecasting",
      "Team collaboration on deals"
    ],
  },
  "slack": {
    tagline: "Where work happens",
    longDescription: "Slack is the leading team communication platform that brings all your team communication into one searchable space. Replace scattered emails and messages with organized channels, direct messages, and integrations that keep your team connected.",
    subcategory: "Messaging Platform",
    rating: 4.4,
    reviewCount: 110,
    features: [
      "Organized channels for topics",
      "Direct and group messaging",
      "Full-text search across history",
      "File sharing and previews",
      "1000+ app integrations",
      "Workflow automation"
    ],
    useCases: [
      "Team communication hub",
      "Project collaboration",
      "Customer support channels",
      "Company announcements",
      "Workflow automation",
      "Integration hub for tools"
    ],
  },
  "figma": {
    tagline: "The collaborative design tool",
    longDescription: "Figma is a cloud-based design and prototyping platform that brings design teams together. Real-time collaboration, powerful design tools, and seamless handoff to developers make Figma the modern design platform.",
    subcategory: "Design Platform",
    rating: 4.5,
    reviewCount: 88,
    features: [
      "Real-time collaborative design",
      "Vector editing and prototyping",
      "Design systems and components",
      "Interactive prototype preview",
      "Developer handoff with code",
      "Version history and branching"
    ],
    useCases: [
      "UI/UX design",
      "Design system creation",
      "Interactive prototyping",
      "Product design workflows",
      "Design asset management",
      "Cross-functional collaboration"
    ],
  },
  "airtable": {
    tagline: "Low-code platform to build custom apps",
    longDescription: "Airtable is a low-code platform combining the simplicity of spreadsheets with powerful database capabilities. Create custom apps, automate workflows, and manage data with flexibility that adapts to your business.",
    subcategory: "Database Platform",
    rating: 4.4,
    reviewCount: 72,
    features: [
      "Spreadsheet-like interface",
      "Powerful database with relationships",
      "Multiple view types (grid, calendar, gallery)",
      "Automation triggers and actions",
      "API for custom integrations",
      "Collaborative workspace"
    ],
    useCases: [
      "Project management",
      "Inventory tracking",
      "Lead and opportunity management",
      "Content calendar management",
      "Event planning",
      "HR and hiring workflows"
    ],
  },
  "aws": {
    tagline: "Cloud computing services at scale",
    longDescription: "Amazon Web Services (AWS) is the world's most comprehensive and broadly adopted cloud platform offering 200+ fully featured services. Build, deploy, and scale applications with EC2, S3, Lambda, RDS, and more.",
    subcategory: "Cloud Infrastructure",
    rating: 4.5,
    reviewCount: 150,
    features: [
      "Compute services (EC2, Lambda)",
      "Storage solutions (S3, EBS)",
      "Database options (RDS, DynamoDB)",
      "Networking and security",
      "AI and machine learning",
      "Analytics and big data"
    ],
    useCases: [
      "Web application hosting",
      "Data warehousing",
      "Machine learning inference",
      "Batch processing jobs",
      "Mobile and IoT backends",
      "Disaster recovery"
    ],
  },
  "intercom": {
    tagline: "Customer communication platform",
    longDescription: "Intercom is a customer communication platform that brings live chat, email, and customer data together. Deliver real-time support and personalized messaging that drives customer satisfaction and growth.",
    subcategory: "Customer Communication",
    rating: 4.5,
    reviewCount: 85,
    features: [
      "Live chat and visitor tracking",
      "Email messaging and campaigns",
      "Customer data platform",
      "Automated conversations (bots)",
      "Support ticket management",
      "Analytics and customer insights"
    ],
    useCases: [
      "Customer support",
      "Sales conversations",
      "Onboarding and product tours",
      "Customer engagement",
      "Support ticket management",
      "Customer data unification"
    ],
  },
  "digitalocean": {
    tagline: "Cloud hosting made simple",
    longDescription: "DigitalOcean is a cloud hosting provider focused on simplicity and affordability. Build, test, and deploy applications with virtual machines, serverless functions, managed databases, and app platform.",
    subcategory: "Cloud Hosting",
    rating: 4.3,
    reviewCount: 92,
    features: [
      "Droplets (virtual machines)",
      "App Platform (PaaS)",
      "Managed databases",
      "Kubernetes container orchestration",
      "Static site hosting",
      "Firewall and DDoS protection"
    ],
    useCases: [
      "Website and app hosting",
      "API deployment",
      "Database hosting",
      "Container deployment",
      "Static site hosting",
      "Development and staging"
    ],
  },
  "monday": {
    tagline: "The online operating system for work",
    longDescription: "Monday.com is a work operating system that lets teams build custom workflows and manage projects visually. Replace spreadsheets and multiple tools with one intuitive platform for managing all your work.",
    subcategory: "Project Management",
    rating: 4.4,
    reviewCount: 98,
    features: [
      "Customizable workflows",
      "Multiple view types",
      "Team collaboration",
      "Automation and integrations",
      "Resource planning",
      "Time tracking"
    ],
    useCases: [
      "Project management",
      "Workflow automation",
      "Sales pipeline",
      "HR and recruiting",
      "Marketing campaigns",
      "Product roadmaps"
    ],
  },
  "semrush": {
    tagline: "Online visibility management platform",
    longDescription: "Semrush is a comprehensive online visibility platform combining SEO, PPC, social media, and competitor research tools. Improve your search visibility, drive qualified traffic, and grow your revenue.",
    subcategory: "Marketing Intelligence",
    rating: 4.4,
    reviewCount: 108,
    features: [
      "Keyword research and analysis",
      "Website SEO audit",
      "Backlink analysis",
      "Competitor research",
      "PPC advertising insights",
      "Social media tracking"
    ],
    useCases: [
      "SEO optimization",
      "Keyword research",
      "Competitor analysis",
      "Content planning",
      "PPC campaign optimization",
      "Market research"
    ],
  },
  "zendesk": {
    tagline: "Customer service software and ticketing",
    longDescription: "Zendesk is a customer service platform providing ticketing, live chat, knowledge base, and analytics. Help your team deliver exceptional support experiences and build loyal customers.",
    subcategory: "Support Platform",
    rating: 4.4,
    reviewCount: 115,
    features: [
      "Ticket management system",
      "Live chat and messaging",
      "Knowledge base builder",
      "Customer feedback",
      "Automation and workflows",
      "Analytics and reporting"
    ],
    useCases: [
      "Customer support",
      "Ticket management",
      "Help desk operations",
      "Customer feedback collection",
      "Support automation",
      "Knowledge management"
    ],
  },
  "clickup": {
    tagline: "The all-in-one project management platform",
    longDescription: "ClickUp is an all-in-one project management platform consolidating tasks, docs, goals, and chat. Replace multiple tools with one flexible platform that adapts to your team's workflow.",
    subcategory: "Project Management",
    rating: 4.3,
    reviewCount: 87,
    features: [
      "Task and project management",
      "Document collaboration",
      "Goal tracking",
      "Time tracking",
      "Automation and integrations",
      "Custom automations"
    ],
    useCases: [
      "Project planning and tracking",
      "Team collaboration",
      "Documentation",
      "Goal management",
      "Agile and Scrum",
      "Product development"
    ],
  },
  "perplexity": {
    tagline: "Where you ask anything",
    longDescription: "Perplexity AI is an AI-powered search engine that provides accurate, cited answers by searching the web in real-time. Get comprehensive answers for any question with source citations.",
    subcategory: "AI Search",
    rating: 4.4,
    reviewCount: 76,
    features: [
      "Real-time web search",
      "AI-powered answers",
      "Source citations",
      "Follow-up questions",
      "Collections for topics",
      "API for developers"
    ],
    useCases: [
      "Research and discovery",
      "Learning and education",
      "Business research",
      "Product research",
      "Competitive analysis",
      "Content creation research"
    ],
  },
  "webflow": {
    tagline: "Build amazing websites visually",
    longDescription: "Webflow is a visual website builder giving you production-ready code without writing HTML/CSS. Design, build, and launch responsive websites with a visual interface that generates clean code.",
    subcategory: "Website Builder",
    rating: 4.4,
    reviewCount: 94,
    features: [
      "Visual website builder",
      "Responsive design",
      "CMS for dynamic content",
      "Code generation",
      "SEO optimization",
      "Web hosting included"
    ],
    useCases: [
      "Portfolio websites",
      "Marketing websites",
      "Landing pages",
      "Blog and CMS sites",
      "ecommerce stores",
      "Design agency projects"
    ],
  },
  "shopify": {
    tagline: "The leading ecommerce platform",
    longDescription: "Shopify is the leading ecommerce platform enabling businesses to start, grow, and manage online stores. With everything from payments to shipping, Shopify handles the complexities of selling online.",
    subcategory: "Ecommerce Platform",
    rating: 4.5,
    reviewCount: 120,
    features: [
      "Online store builder",
      "Payment processing",
      "Inventory management",
      "Shipping integration",
      "Marketing tools",
      "Analytics and reporting"
    ],
    useCases: [
      "Online store creation",
      "ecommerce fulfillment",
      "Multimarket selling",
      "Subscription products",
      "Digital products",
      "B2B ecommerce"
    ],
  },
  "linear": {
    tagline: "Issue tracking for software teams",
    longDescription: "Linear is a modern issue tracker for software teams. Built for speed and collaboration, Linear helps teams move fast with powerful workflows, integrations, and an intuitive interface.",
    subcategory: "Issue Tracking",
    rating: 4.5,
    reviewCount: 82,
    features: [
      "Fast issue creation",
      "Powerful search",
      "Cycle and sprint management",
      "Automation workflows",
      "GitHub integration",
      "Team collaboration"
    ],
    useCases: [
      "Product development",
      "Bug tracking",
      "Feature planning",
      "Sprint management",
      "Team coordination",
      "Release planning"
    ],
  },
  "loom": {
    tagline: "Async video messaging for work",
    longDescription: "Loom is the easiest way to share video messages, walkthrough guides, and feedback. Record your screen, camera, and microphone, then share instantly with anyone.",
    subcategory: "Video Recording",
    rating: 4.4,
    reviewCount: 89,
    features: [
      "Screen and camera recording",
      "Instant sharing",
      "Comments and reactions",
      "Transcript generation",
      "Video library",
      "Team workspace"
    ],
    useCases: [
      "Async communication",
      "Tutorial creation",
      "Bug reporting",
      "Feedback and reviews",
      "Onboarding videos",
      "Customer support"
    ],
  },
  "n8n": {
    tagline: "Workflow automation for technical teams",
    longDescription: "n8n is an open-source workflow automation platform for technical teams. Connect your tools and automate complex workflows with a powerful editor and 400+ integrations.",
    subcategory: "Automation",
    rating: 4.3,
    reviewCount: 68,
    features: [
      "Visual workflow editor",
      "400+ integrations",
      "JavaScript support",
      "Conditional logic",
      "Error handling",
      "Deploy anywhere"
    ],
    useCases: [
      "Data synchronization",
      "Lead management",
      "Contract automation",
      "Inventory automation",
      "Customer data sync",
      "API workflows"
    ],
  },
};

export function getExtendedDealInfo(dealId: string): ExtendedDealInfo | null {
  return dealExtendedInfoMap[dealId] || null;
}
