import { Link } from "react-router-dom";

interface ComparisonItem {
  tool1: {
    name: string;
    logo: string;
    bgColor?: string;
  };
  tool2: {
    name: string;
    logo: string;
    bgColor?: string;
  };
  slug: string;
}

const comparisons: ComparisonItem[] = [
  {
    tool1: { name: "Freshdesk", logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Freshdesk-logo.png", bgColor: "bg-white" },
    tool2: { name: "Zendesk", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Zendesk_logo.svg", bgColor: "bg-white" },
    slug: "freshdesk-vs-zendesk"
  },
  {
    tool1: { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", bgColor: "bg-white" },
    tool2: { name: "Square", logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Square%2C_Inc._-_Square_logo.svg", bgColor: "bg-white" },
    slug: "stripe-vs-square"
  },
  {
    tool1: { name: "Asana", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg", bgColor: "bg-white" },
    tool2: { name: "Monday", logo: "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/monday-logo-x2.png", bgColor: "bg-white" },
    slug: "asana-vs-monday"
  },
  {
    tool1: { name: "Xero", logo: "https://upload.wikimedia.org/wikipedia/en/9/9f/Xero_software_logo.svg", bgColor: "bg-[#13B5EA]" },
    tool2: { name: "QuickBooks", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Intuit_QuickBooks_logo.svg", bgColor: "bg-white" },
    slug: "xero-vs-quickbooks"
  },
  {
    tool1: { name: "Obsidian", logo: "https://upload.wikimedia.org/wikipedia/commons/1/10/2023_Obsidian_logo.svg", bgColor: "bg-purple-600" },
    tool2: { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", bgColor: "bg-white" },
    slug: "obsidian-vs-notion"
  },
  {
    tool1: { name: "Upwork", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Upwork-logo.svg", bgColor: "bg-[#14A800]" },
    tool2: { name: "Fiverr", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Fiverr_Logo_09.2020.svg", bgColor: "bg-white" },
    slug: "upwork-vs-fiverr"
  },
  {
    tool1: { name: "Stripe", logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg", bgColor: "bg-white" },
    tool2: { name: "PayPal", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", bgColor: "bg-white" },
    slug: "stripe-vs-paypal"
  },
  {
    tool1: { name: "Azure", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg", bgColor: "bg-white" },
    tool2: { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg", bgColor: "bg-white" },
    slug: "azure-vs-aws"
  },
  {
    tool1: { name: "Webflow", logo: "https://upload.wikimedia.org/wikipedia/commons/9/92/Webflow_logo.svg", bgColor: "bg-white" },
    tool2: { name: "WordPress", logo: "https://upload.wikimedia.org/wikipedia/commons/9/98/WordPress_blue_logo.svg", bgColor: "bg-white" },
    slug: "webflow-vs-wordpress"
  },
  {
    tool1: { name: "Coda", logo: "https://upload.wikimedia.org/wikipedia/en/b/b1/Coda_%28document_editor%29_logo.png", bgColor: "bg-[#F46A54]" },
    tool2: { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", bgColor: "bg-white" },
    slug: "coda-vs-notion"
  },
  {
    tool1: { name: "Slack", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg", bgColor: "bg-white" },
    tool2: { name: "Discord", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Discord_icon.svg", bgColor: "bg-[#5865F2]" },
    slug: "slack-vs-discord"
  },
  {
    tool1: { name: "Pipedrive", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Pipedrive_Logo.svg", bgColor: "bg-white" },
    tool2: { name: "HubSpot", logo: "https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png", bgColor: "bg-[#FF7A59]" },
    slug: "pipedrive-vs-hubspot"
  },
  {
    tool1: { name: "Pipedrive", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Pipedrive_Logo.svg", bgColor: "bg-white" },
    tool2: { name: "Monday", logo: "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/monday-logo-x2.png", bgColor: "bg-white" },
    slug: "pipedrive-vs-monday"
  },
  {
    tool1: { name: "Perplexity AI", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.png", bgColor: "bg-white" },
    tool2: { name: "ChatGPT", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", bgColor: "bg-[#10A37F]" },
    slug: "perplexity-vs-chatgpt"
  },
  {
    tool1: { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", bgColor: "bg-white" },
    tool2: { name: "Asana", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Asana_logo.svg", bgColor: "bg-white" },
    slug: "notion-vs-asana"
  },
  {
    tool1: { name: "Claude AI", logo: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Claude_AI_logo.svg", bgColor: "bg-[#D97757]" },
    tool2: { name: "ChatGPT", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", bgColor: "bg-[#10A37F]" },
    slug: "claude-vs-chatgpt"
  },
  {
    tool1: { name: "Airtable", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Airtable_Logo.svg", bgColor: "bg-white" },
    tool2: { name: "Monday", logo: "https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/monday-logo-x2.png", bgColor: "bg-white" },
    slug: "airtable-vs-monday"
  },
  {
    tool1: { name: "Copilot", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Microsoft_365_Copilot_Icon.svg", bgColor: "bg-white" },
    tool2: { name: "ChatGPT", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg", bgColor: "bg-[#10A37F]" },
    slug: "copilot-vs-chatgpt"
  },
  {
    tool1: { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", bgColor: "bg-white" },
    tool2: { name: "Evernote", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Evernote_Icon.svg", bgColor: "bg-[#00A82D]" },
    slug: "notion-vs-evernote"
  },
  {
    tool1: { name: "ClickUp", logo: "https://clickup.com/landing/images/clickup-logo-gradient.png", bgColor: "bg-white" },
    tool2: { name: "Notion", logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png", bgColor: "bg-white" },
    slug: "clickup-vs-notion"
  },
  {
    tool1: { name: "Lovable", logo: "https://lovable.dev/favicon.ico", bgColor: "bg-white" },
    tool2: { name: "Bolt.new", logo: "https://bolt.new/favicon.ico", bgColor: "bg-white" },
    slug: "lovable-vs-bolt"
  },
];

const CompareToolsSection = () => {
  return (
    <section className="py-16 bg-primary/90">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Compare tools to make the right choices
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-3xl">
            Considering buying new software? PerksNest helps you choose the tools & services that best suit your business with our comparison pages.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisons.map((comparison, index) => (
            <Link
              key={index}
              to={`/compare/${comparison.slug}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all duration-200 hover:border-primary-foreground/30"
            >
              {/* Tool logos */}
              <div className="flex items-center -space-x-2">
                <div className={`w-10 h-10 rounded-lg ${comparison.tool1.bgColor} p-1.5 flex items-center justify-center border border-border/20`}>
                  <img 
                    src={comparison.tool1.logo} 
                    alt={comparison.tool1.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${comparison.tool1.name.charAt(0)}&background=random`;
                    }}
                  />
                </div>
                <div className={`w-10 h-10 rounded-lg ${comparison.tool2.bgColor} p-1.5 flex items-center justify-center border border-border/20`}>
                  <img 
                    src={comparison.tool2.logo} 
                    alt={comparison.tool2.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${comparison.tool2.name.charAt(0)}&background=random`;
                    }}
                  />
                </div>
              </div>

              {/* Comparison title */}
              <span className="text-primary-foreground font-medium text-sm">
                {comparison.tool1.name} vs {comparison.tool2.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompareToolsSection;
