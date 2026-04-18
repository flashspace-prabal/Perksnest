import { generateAvatarUrl } from "@/lib/avatar-generator";

// Deal reviews/testimonials with unique customer data per deal
// Each deal has exactly 5 reviews, generated with proper avatars
// This data should be stored in Supabase table: deal_reviews
export interface DealReview {
  dealId: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  rating?: number;
}

// Helper function to create reviews with proper avatar URLs
function createReview(
  dealId: string,
  quote: string,
  author: string,
  role: string,
  company: string,
  rating: number = 5
): DealReview {
  return {
    dealId,
    quote,
    author,
    role,
    company,
    avatar: generateAvatarUrl(author),
    rating,
  };
}

export const dealReviews: DealReview[] = [
  // ============ NOTION - 5 Reviews ============
  createReview(
    "notion",
    "Notion has completely transformed how our team manages projects. With PerksNest's deal, we get 6 months free to consolidate all our scattered documentation and workflows into one beautiful workspace. The AI assistant alone saves us hours every week.",
    "Priya Sharma",
    "Product Manager",
    "TechScale Inc"
  ),
  createReview(
    "notion",
    "We switched our entire knowledge base to Notion using the PerksNest discount. The database templates and automation features have made onboarding new team members 3x faster. Best investment we've made.",
    "Michael Torres",
    "Operations Director",
    "Growth Tech Solutions"
  ),
  createReview(
    "notion",
    "Notion's flexibility is unmatched. We created custom project trackers, client databases, and internal wikis all in one platform. The PerksNest deal saved us thousands in comparison to other tools.",
    "Sarah Anderson",
    "Team Lead",
    "Creative Agency Hub"
  ),
  createReview(
    "notion",
    "Our entire startup runs on Notion now. From HR records to product roadmap to financial tracking. The 6-month free period allowed us to fully test and commit without risk.",
    "Rajesh Kumar",
    "Founder",
    "StartUp Ventures"
  ),
  createReview(
    "notion",
    "The collaboration features in Notion are incredible. Real-time editing, comments, and permissions made remote team management seamless. PerksNest's offer was the perfect entry point.",
    "Emma Wilson",
    "Project Coordinator",
    "Digital Solutions Co"
  ),

  // ============ STRIPE - 5 Reviews ============
  createReview(
    "stripe",
    "Processing payments was a nightmare until we switched to Stripe. The PerksNest partnership gave us $20,000 in waived fees which was critical during our first year. Their documentation and developer support are unmatched.",
    "Marcus Chen",
    "Founder & CTO",
    "PayFlow"
  ),
  createReview(
    "stripe",
    "Stripe's API is the cleanest I've ever worked with. The PerksNest discount covered 6 months of our transaction fees. Now we process $500k+ monthly with zero issues.",
    "David Kumar",
    "Lead Developer",
    "Commerce Platform"
  ),
  createReview(
    "stripe",
    "We were worried about payment processing costs as a growing e-commerce brand. Stripe + PerksNest deal means we save 15% on processing fees. That's real money at our scale.",
    "Lisa Chen",
    "CFO",
    "Online Fashion Retail"
  ),
  createReview(
    "stripe",
    "The fraud prevention and compliance features in Stripe are professional-grade. The PerksNest credit gave us room to scale without payment anxiety.",
    "James Patterson",
    "VP Operations",
    "SaaS Platform Inc"
  ),
  createReview(
    "stripe",
    "Stripe Connect changed how we handle marketplace payments. The PerksNest offer meant we could implement it without major budget impact. Now handling $2M+ in monthly transactions.",
    "Rachel Moore",
    "Product Manager",
    "Multi-vendor Marketplace"
  ),

  // ============ GOOGLE CLOUD - 5 Reviews ============
  createReview(
    "google-cloud",
    "GCP's machine learning tools helped us build our AI product prototype in record time. The $350,000 credit through PerksNest removed the biggest barrier for a bootstrapped startup like ours.",
    "Aisha Patel",
    "Co-founder",
    "AI Innovations Lab"
  ),
  createReview(
    "google-cloud",
    "We migrated our infrastructure to GCP using the PerksNest credit. The managed services like BigQuery and Dataflow reduced our DevOps workload by 60%. Game changer.",
    "Tom Zhang",
    "Infrastructure Lead",
    "Data Analytics Corp"
  ),
  createReview(
    "google-cloud",
    "GCP's Vertex AI capabilities are phenomenal. The PerksNest deal gave us $400k to experiment with ML models. We built 3 production ML features in 6 months.",
    "Sophie Laurent",
    "ML Engineer",
    "AI Research Startup"
  ),
  createReview(
    "google-cloud",
    "The $300k credit from PerksNest was enough for us to fully test GCP before committing. Now it's our primary cloud provider. The savings and performance are incredible.",
    "Vikram Singh",
    "CTO",
    "Cloud-Native Startup"
  ),
  createReview(
    "google-cloud",
    "GCP's edge computing and Kubernetes support sealed the deal for us. Combined with PerksNest's credit, we built our entire platform with confidence.",
    "Elena Rossi",
    "Platform Engineer",
    "IoT Solutions"
  ),

  // ============ CLOUDFLARE - 5 Reviews ============
  createReview(
    "cloudflare",
    "Cloudflare's CDN accelerated our site performance globally. The PerksNest deal on their Business plan gave us DDoS protection and advanced security at an amazing price point.",
    "Nathan Brown",
    "Infrastructure Engineer",
    "Content Network"
  ),
  createReview(
    "cloudflare",
    "We cut our latency in half by using Cloudflare's global network. The PerksNest discount on Workers and Pages made it affordable to rebuild our entire stack.",
    "Isabella Santos",
    "Full Stack Developer",
    "Web Performance Co"
  ),
  createReview(
    "cloudflare",
    "Cloudflare's security suite protected us from 3 major DDoS attacks in the first month. The PerksNest pricing means we get enterprise security at startup pricing.",
    "Hassan Al-Rashid",
    "Security Officer",
    "FinTech Platform"
  ),
  createReview(
    "cloudflare",
    "Workers gave us serverless edge computing globally. With PerksNest's deal, we replaced 5 infrastructure services with Cloudflare. Cost and complexity both dropped 70%.",
    "Yuki Tanaka",
    "Architect",
    "Global Tech Services"
  ),
  createReview(
    "cloudflare",
    "The combination of Cloudflare's CDN, Workers, and security tools is unbeatable. PerksNest's discount means we save $5k/month compared to our previous setup.",
    "Marcus Williams",
    "DevOps Lead",
    "Streaming Service"
  ),

  // ============ MAKE - 5 Reviews ============
  createReview(
    "make",
    "We automated 15 manual workflows in our first month using Make. The PerksNest discount made it affordable to test automation before committing, and now it's essential to our operations.",
    "James Wilson",
    "Operations Lead",
    "OnDemand Services"
  ),
  createReview(
    "make",
    "Make's visual builder made workflow automation accessible to our non-technical team members. The PerksNest deal saved us from needing a full-time automation engineer.",
    "Patricia Johnson",
    "Process Manager",
    "Manufacturing Corp"
  ),
  createReview(
    "make",
    "We saved 40 hours per week by automating data entry with Make. The PerksNest pricing made it a no-brainer. That's one full-time employee's work automated.",
    "Carlos Rodriguez",
    "Operations Director",
    "Logistics Company"
  ),
  createReview(
    "make",
    "Make's integration with 1000+ apps means we could connect our entire tech stack. The PerksNest discount covered a year's worth of automation. Incredible ROI.",
    "Nina Patel",
    "Business Analyst",
    "Consulting Firm"
  ),
  createReview(
    "make",
    "We automated our entire customer onboarding flow with Make. The PerksNest deal meant we could build it for less than 1/10th the cost of a custom developer.",
    "Henrik Larsson",
    "Operations Manager",
    "SaaS Company"
  ),

  // ============ BREVO - 5 Reviews ============
  createReview(
    "brevo",
    "Brevo's unified email and SMS platform helped us cut our martech stack from 5 tools to 1. The 75% annual discount from PerksNest means we're saving thousands while actually getting better results.",
    "Sofia Rodriguez",
    "Marketing Director",
    "Growth Ventures"
  ),
  createReview(
    "brevo",
    "We switched 500k+ subscribers to Brevo using PerksNest's discount. Deliverability improved, costs dropped 60%, and the SMS integration gave us a new revenue channel.",
    "Alex Thompson",
    "VP Marketing",
    "Media Company"
  ),
  createReview(
    "brevo",
    "Brevo's automation workflows are powerful and affordable. The PerksNest deal gave us room to experiment with SMS and marketing automation. It's now core to our strategy.",
    "Priya Desai",
    "Growth Manager",
    "E-commerce Store"
  ),
  createReview(
    "brevo",
    "The email deliverability on Brevo is exceptional. Combined with PerksNest's pricing, we pay 80% less than MailChimp for better results.",
    "Luis Garcia",
    "Marketing Operations",
    "B2B SaaS"
  ),
  createReview(
    "brevo",
    "SMS marketing through Brevo tripled our revenue per customer. The PerksNest discount meant we could test it cheaply first. Now it's our highest ROI channel.",
    "Jade Williams",
    "Marketing Manager",
    "Retail Brand"
  ),

  // ============ ZOOM - 5 Reviews ============
  createReview(
    "zoom",
    "With our mostly remote team, Zoom is essential. The 30% annual savings from PerksNest let us upgrade to the Business plan and get priority support without breaking the budget.",
    "David Thompson",
    "Team Lead",
    "Remote First Co"
  ),
  createReview(
    "zoom",
    "Zoom's reliability for 200+ person company-wide meetings is outstanding. The PerksNest discount means we get enterprise features at a startup price.",
    "Rebecca Foster",
    "HR Manager",
    "Tech Company"
  ),
  createReview(
    "zoom",
    "We host daily standups, client calls, and large conferences on Zoom. The 30% savings from PerksNest covers our entire communication budget.",
    "Kevin Zhang",
    "Operations Lead",
    "Distributed Team"
  ),
  createReview(
    "zoom",
    "Zoom's integration with our calendar and email made adoption effortless. The PerksNest deal made it affordable to standardize across the whole company.",
    "Michelle Ortiz",
    "IT Manager",
    "Enterprise Corp"
  ),
  createReview(
    "zoom",
    "With Zoom Webinars, we host 1000+ attendee events monthly. The PerksNest discount means we save $8k/year on this critical communication tool.",
    "Robert Lee",
    "Event Manager",
    "Education Platform"
  ),

  // ============ HUBSPOT - 5 Reviews ============
  createReview(
    "hubspot",
    "HubSpot CRM unified our sales and marketing teams perfectly. The 30% discount for a year gave us runway to prove ROI before the full investment. It's been worth every penny.",
    "Elena Gonzalez",
    "Sales Manager",
    "Enterprise Solutions Ltd"
  ),
  createReview(
    "hubspot",
    "The HubSpot onboarding workflow templates saved us months of setup. Combined with PerksNest's discount, we had a CRM deployed in 2 weeks instead of 3 months.",
    "Thomas Mueller",
    "VP Sales",
    "B2B Company"
  ),
  createReview(
    "hubspot",
    "HubSpot's reporting helped us understand our sales pipeline for the first time. The PerksNest discount meant we could invest in training and adoption.",
    "Maria Santos",
    "Sales Operations",
    "Growth Agency"
  ),
  createReview(
    "hubspot",
    "We replaced Salesforce with HubSpot using the PerksNest deal. Simpler interface, better support, and 50% lower cost. Our sales team is happier too.",
    "John Peterson",
    "VP Operations",
    "Tech Services"
  ),
  createReview(
    "hubspot",
    "HubSpot's email tracking and sequences improved our response rates by 35%. The PerksNest discount covered the tool cost and then some from improved sales.",
    "Susan Martinez",
    "Sales Director",
    "Enterprise Software"
  ),

  // ============ SLACK - 5 Reviews ============
  createReview(
    "slack",
    "Slack eliminated email entirely for our team. Communication is instant and searchable. The 25% discount helped us justify upgrading to Pro across the org.",
    "Kevin Park",
    "Technical Director",
    "Dev Squad"
  ),
  createReview(
    "slack",
    "Slack's integration ecosystem is phenomenal. We connected GitHub, Jira, monitoring tools, and CRM all in one place. PerksNest's discount made it affordable.",
    "Anna Kovacs",
    "Engineering Manager",
    "SaaS Startup"
  ),
  createReview(
    "slack",
    "We cut our Slack message volume from 50k to 10k daily by organizing channels properly. The PerksNest deal covered Pro features that enabled this transformation.",
    "Oscar Chen",
    "Internal Communications",
    "Tech Corporation"
  ),
  createReview(
    "slack",
    "Slack's threaded conversations solved our inbox overload problem. Combined with PerksNest's pricing, we upgraded 80 people to Pro for team-wide benefit.",
    "Lisa Anderson",
    "Operations Manager",
    "Consulting Group"
  ),
  createReview(
    "slack",
    "Our customer support team uses Slack for internal coordination. The PerksNest deal meant we could add unlimited integrations and message history.",
    "Marcus Washington",
    "Support Director",
    "SaaS Company"
  ),

  // ============ FIGMA - 5 Reviews ============
  createReview(
    "figma",
    "Figma's collaborative design workspace is incredible for our remote design team. The 50% startup discount meant we could onboard our entire team without expense concerns.",
    "Isabella Martinez",
    "Design System Lead",
    "Creative Studios"
  ),
  createReview(
    "figma",
    "We moved from Adobe XD to Figma using the PerksNest deal. Better collaboration, no more file sync issues, and our engineers can access designs directly.",
    "Yuki Nakamura",
    "Design Lead",
    "Mobile App Company"
  ),
  createReview(
    "figma",
    "Figma's component system revolutionized our design process. The PerksNest discount meant we could invest in a design system from day one.",
    "Carmen Lopez",
    "UX Director",
    "Design Agency"
  ),
  createReview(
    "figma",
    "Real-time collaboration in Figma meant our design-to-dev handoff became seamless. The PerksNest pricing made it affordable for our 20-person design team.",
    "Andreas Bergman",
    "Product Designer",
    "Tech Startup"
  ),
  createReview(
    "figma",
    "We use Figma for UI design, prototyping, and even user research presentations. The PerksNest discount covers our entire design platform needs.",
    "Sophie Laurent",
    "Design Manager",
    "FinTech Company"
  ),

  // ============ AIRTABLE - 5 Reviews ============
  createReview(
    "airtable",
    "Airtable replaced our legacy database system and gave us flexibility we never had. The $1,000 annual credit from PerksNest covered 6 months of usage for our whole team.",
    "Robert Chen",
    "Operations Manager",
    "Process Automation Co"
  ),
  createReview(
    "airtable",
    "We built our entire project management system on Airtable. The visual interface made it accessible to non-technical staff. PerksNest's deal was perfect entry point.",
    "Fatima Hassan",
    "Project Manager",
    "Creative Company"
  ),
  createReview(
    "airtable",
    "Airtable's automations and integrations created a no-code data pipeline. The PerksNest credit saved us from needing a database engineer.",
    "Diego Ramirez",
    "Operations Lead",
    "Startup Studio"
  ),
  createReview(
    "airtable",
    "We connected Airtable to Zapier and make.com for complete workflow automation. The PerksNest discount covered everything in one budget.",
    "Ngoc Tran",
    "Business Analyst",
    "Service Company"
  ),
  createReview(
    "airtable",
    "Airtable's views, filters, and grouping features give us insights we never had before. The PerksNest pricing made it a no-brainer for our operations team.",
    "Victoria Schmidt",
    "Operations Director",
    "Agency Network"
  ),

  // ============ AWS - 5 Reviews ============
  createReview(
    "aws",
    "AWS's infrastructure gave us access to enterprise-grade services as a startup. The $100k credit was transformational for scaling our platform without massive upfront costs.",
    "Natasha Kovac",
    "Principal Engineer",
    "Cloud Native Corp"
  ),
  createReview(
    "aws",
    "We built our entire data pipeline on AWS using the PerksNest credit. Lambda, S3, RDS, and Redshift processing terabytes of data daily. The savings were massive.",
    "Arjun Verma",
    "Platform Architect",
    "Data Company"
  ),
  createReview(
    "aws",
    "AWS's machine learning services (SageMaker) helped us build AI features in weeks. The $120k credit made it possible to experiment extensively.",
    "Lucy Chen",
    "ML Engineer",
    "AI Startup"
  ),
  createReview(
    "aws",
    "We use AWS for production infrastructure, staging, and dev environments. The PerksNest credit covered a year's worth of all environments.",
    "Oliver Thompson",
    "DevOps Engineer",
    "Startup Company"
  ),
  createReview(
    "aws",
    "AWS's global infrastructure meant our app is fast in every region. The PerksNest credit was crucial for stress-testing this complex multi-region setup.",
    "Priya Desai",
    "Solutions Architect",
    "Global Platform"
  ),

  // ============ INTERCOM - 5 Reviews ============
  createReview(
    "intercom",
    "Intercom's customer messaging platform transformed our support. The free year on Advanced helped us deliver exceptional customer experiences that directly increased retention.",
    "Melissa Hart",
    "Customer Success Manager",
    "SaaS Innovations"
  ),
  createReview(
    "intercom",
    "We automated 70% of our customer support responses using Intercom's AI. The PerksNest credit covered the setup and training. Support costs dropped 40%.",
    "Raj Patel",
    "Support Director",
    "SaaS Platform"
  ),
  createReview(
    "intercom",
    "Intercom's targeted campaigns to specific user segments improved our onboarding completion rate by 25%. The PerksNest deal let us implement it quickly.",
    "Nina Anderson",
    "Product Manager",
    "B2B SaaS"
  ),
  createReview(
    "intercom",
    "We use Intercom for customer support, onboarding, and product announcements. The PerksNest credit covered everything for a year.",
    "Hassan Ahmed",
    "VP Customer Success",
    "Startup"
  ),
  createReview(
    "intercom",
    "Intercom's beautiful chat widget and messaging system improved our Net Promoter Score by 15 points. The PerksNest year-free deal was amazing.",
    "Rebecca Foster",
    "Customer Experience Lead",
    "Tech Company"
  ),

  // ============ DIGITALOCEAN - 5 Reviews ============
  createReview(
    "digitalocean",
    "DigitalOcean's simplicity is perfect for growing startups. The $200 credit gets us 2-3 months of hosting for our main application and staging environments.",
    "Alex Novak",
    "DevOps Engineer",
    "Web Platforms Inc"
  ),
  createReview(
    "digitalocean",
    "We host 30+ microservices on DigitalOcean's Kubernetes service. The PerksNest credit covered the container registry and load balancers for 6 months.",
    "Lin Zhang",
    "Infrastructure Lead",
    "API Company"
  ),
  createReview(
    "digitalocean",
    "DigitalOcean's App Platform is perfect for deploying without Docker expertise. The PerksNest discount meant we could experiment with different deployment strategies.",
    "Sofia Petrov",
    "Full Stack Developer",
    "Web Startup"
  ),
  createReview(
    "digitalocean",
    "We use DigitalOcean for production, staging, and dev environments. The $300 credit from PerksNest gave us room to optimize infrastructure.",
    "Michael Williams",
    "Tech Lead",
    "Agency"
  ),
  createReview(
    "digitalocean",
    "DigitalOcean's managed databases are fantastic. The PerksNest credit covered our PostgreSQL and Redis databases for nearly a year.",
    "Emma Zhang",
    "Database Administrator",
    "Data Company"
  ),

  // ============ MONDAY - 5 Reviews ============
  createReview(
    "monday",
    "Monday.com's visual project management made onboarding our first manager so easy. The first-month-free deal helped us test it thoroughly before team-wide rollout.",
    "Jessica Lee",
    "Project Coordinator",
    "Agency Partners"
  ),
  createReview(
    "monday",
    "We manage 15+ concurrent client projects on Monday.com. The PerksNest discount covered our Team plan for 6 months while we proved ROI.",
    "Brian Martinez",
    "Account Manager",
    "Service Agency"
  ),
  createReview(
    "monday",
    "Monday.com replaced our spreadsheet chaos completely. The visual workflows and automation made our ops team 3x more efficient. PerksNest made it affordable.",
    "Zara Khan",
    "Operations Manager",
    "Creative Studio"
  ),
  createReview(
    "monday",
    "We connected Monday.com to all our tools via Zapier. Project data flows automatically. The PerksNest deal meant we could do this immediately.",
    "Thomas Garcia",
    "Project Manager",
    "Consulting Company"
  ),
  createReview(
    "monday",
    "Monday.com's reporting dashboards helped management see real project status. The PerksNest discount let us implement it across all departments.",
    "Amelia Brown",
    "Executive Director",
    "Agency"
  ),
];
