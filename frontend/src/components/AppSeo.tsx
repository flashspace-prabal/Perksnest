import { useLocation } from "react-router-dom";

import { useSeo, type SeoOptions } from "@/lib/seo";

const staticSeoByPath: Record<string, SeoOptions> = {
  "/": {
    title: "PerksNest - Exclusive SaaS Deals for Startups",
    description: "Discover startup-friendly SaaS discounts, credits, and perks across cloud, AI, growth, support, and developer tools.",
    path: "/",
  },
  "/deals": {
    title: "Browse SaaS Deals | PerksNest",
    description: "Explore startup deals across cloud, AI, analytics, productivity, CRM, and developer tools with savings curated for founders and operators.",
    path: "/deals",
  },
  "/pricing": {
    title: "Pricing Plans | PerksNest",
    description: "See PerksNest membership plans and unlock startup software discounts, curated partner offers, and founder-friendly perks.",
    path: "/pricing",
  },
  "/blog": {
    title: "Insights & Guides | PerksNest",
    description: "Read practical guides for founders comparing tools, budgeting software spend, and building a cleaner SaaS stack.",
    path: "/blog",
  },
  "/categories": {
    title: "All Categories | PerksNest",
    description: "Browse software deals by category, from AI and cloud infrastructure to productivity, finance, support, and growth tools.",
    path: "/categories",
  },
  "/collections": {
    title: "Collections | PerksNest",
    description: "Explore curated collections of SaaS deals built around startup workflows, team needs, and high-value software stacks.",
    path: "/collections",
  },
  "/leaderboard": {
    title: "Top SaaS Deals Leaderboard | PerksNest",
    description: "See the most popular startup deals on PerksNest based on founder interest, usage, and marketplace momentum.",
    path: "/leaderboard",
  },
  "/invite": {
    title: "Refer & Earn $20 Credit | PerksNest",
    description: "Invite other founders to PerksNest and earn credits while helping startups discover better software pricing.",
    path: "/invite",
  },
  "/white-label": {
    title: "White-Label Perks Programs | PerksNest",
    description: "Launch a branded perks marketplace for your accelerator, community, or membership program with PerksNest white-label infrastructure.",
    path: "/white-label",
  },
  "/contact": {
    title: "Contact PerksNest",
    description: "Get in touch with PerksNest about partnerships, support questions, marketplace access, or white-label programs.",
    path: "/contact",
  },
  "/docs": {
    title: "Documentation | PerksNest",
    description: "Browse PerksNest documentation and help resources for claiming offers, understanding memberships, and using the platform.",
    path: "/docs",
  },
  "/help": {
    title: "Help Center | PerksNest",
    description: "Find answers to common PerksNest questions about claiming deals, account setup, billing, and support.",
    path: "/help",
  },
  "/terms": {
    title: "Terms of Service | PerksNest",
    description: "Read the PerksNest terms of service for marketplace usage, memberships, support, and platform policies.",
    path: "/terms",
  },
  "/privacy": {
    title: "Privacy Policy | PerksNest",
    description: "Review the PerksNest privacy policy to understand how account data, analytics, and user information are handled.",
    path: "/privacy",
  },
  "/login": {
    title: "Sign In | PerksNest",
    description: "Sign in to PerksNest to access your startup software deals, claimed offers, saved perks, and account dashboard.",
    path: "/login",
    noIndex: true,
  },
  "/signup": {
    title: "Create Your PerksNest Account",
    description: "Join PerksNest to unlock startup software discounts, curated SaaS perks, and a cleaner way to manage your stack.",
    path: "/signup",
    noIndex: true,
  },
};

function SeoConfigApplier({ config }: { config: SeoOptions }) {
  useSeo(config);
  return null;
}

const AppSeo = () => {
  const location = useLocation();
  const { pathname } = location;

  const privatePrefixes = ["/admin", "/partner", "/customer"];
  const privateRoute = privatePrefixes.find((prefix) => pathname.startsWith(prefix));

  if (privateRoute) {
    return (
      <SeoConfigApplier
        config={{
          title: "PerksNest",
          description: "PerksNest member area.",
          path: pathname,
          noIndex: true,
        }}
      />
    );
  }

  const config = staticSeoByPath[pathname];
  if (!config) return null;

  return <SeoConfigApplier config={config} />;
};

export default AppSeo;

