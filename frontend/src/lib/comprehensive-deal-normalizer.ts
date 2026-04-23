import type {
  Alternative,
  ComprehensiveDealDetail,
  FAQItem,
  Feature,
  PopularDeal,
  PricingPlan,
  Resource,
  Review,
} from "@/data/deal-details-schema";
import { isPremiumDeal } from "@/lib/deal-types";

type RawDeal = Partial<ComprehensiveDealDetail> & Record<string, unknown>;

const RESOURCE_TYPE_PRIORITIES: Record<string, number> = {
  "get-started": 1,
  guide: 2,
  tutorial: 3,
  documentation: 4,
  docs: 4,
  academy: 5,
  course: 5,
  video: 6,
  webinar: 6,
  template: 7,
  templates: 7,
  "hands-on lab": 8,
  community: 9,
};

const RESOURCE_CTA_LABELS: Record<string, string> = {
  "get-started": "Get Started",
  guide: "View Guide",
  tutorial: "Start Tutorial",
  documentation: "View Docs",
  docs: "View Docs",
  academy: "Start Learning",
  course: "Start Course",
  video: "Watch Video",
  webinar: "Watch Webinar",
  template: "Browse Templates",
  templates: "Browse Templates",
  "hands-on lab": "Open Lab",
  community: "Open Community",
};

const normalizeString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(normalizeString).filter(Boolean) : [];

const normalizeUrl = (value: unknown): string | null => {
  const url = normalizeString(value);
  if (!url || url === "#") return null;

  try {
    return new URL(url).toString();
  } catch {
    return null;
  }
};

const getUrlObject = (value: unknown): URL | null => {
  const normalized = normalizeUrl(value);
  if (!normalized) return null;

  try {
    return new URL(normalized);
  } catch {
    return null;
  }
};

const getPrimaryDealUrl = (rawDeal: RawDeal): URL | null => {
  return (
    getUrlObject(rawDeal.general && typeof rawDeal.general === "object" ? (rawDeal.general as Record<string, unknown>).website : undefined) ||
    getUrlObject(rawDeal.generalInfo && typeof rawDeal.generalInfo === "object" ? (rawDeal.generalInfo as Record<string, unknown>).website : undefined) ||
    getUrlObject(rawDeal.website) ||
    getUrlObject(rawDeal.redeemUrl)
  );
};

const isHomepageFallback = (resourceUrl: string, primaryDealUrl: URL | null): boolean => {
  if (!primaryDealUrl) return false;

  try {
    const candidate = new URL(resourceUrl);
    const candidatePath = candidate.pathname.replace(/\/+$/, "");
    const primaryPath = primaryDealUrl.pathname.replace(/\/+$/, "");

    return candidate.hostname === primaryDealUrl.hostname && candidatePath === "" && primaryPath === "";
  } catch {
    return false;
  }
};

const normalizeResourceType = (rawType: unknown, rawTitle: unknown, resourceUrl: string): string => {
  const combined = `${normalizeString(rawType)} ${normalizeString(rawTitle)} ${resourceUrl}`.toLowerCase();

  if (combined.includes("get started")) return "get-started";
  if (combined.includes("tutorial")) return "tutorial";
  if (combined.includes("docs") || combined.includes("documentation") || combined.includes("api")) return "documentation";
  if (combined.includes("academy")) return "academy";
  if (combined.includes("course")) return "course";
  if (combined.includes("template")) return "template";
  if (combined.includes("community") || combined.includes("forum")) return "community";
  if (combined.includes("video") || combined.includes("webinar")) return "video";
  if (combined.includes("lab")) return "hands-on lab";
  if (combined.includes("guide")) return "guide";

  return "guide";
};

const buildResourceDescription = (type: string, title: string, dealName: string): string => {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("api")) {
    return `Official API and developer reference for integrating ${dealName}.`;
  }

  switch (type) {
    case "get-started":
      return `Official onboarding to help your team start using ${dealName} quickly.`;
    case "tutorial":
      return `Step-by-step walkthrough for setting up and using ${dealName} effectively.`;
    case "documentation":
      return `Official documentation covering setup, workflows, and implementation details for ${dealName}.`;
    case "academy":
    case "course":
      return `Structured learning resources from the ${dealName} team.`;
    case "template":
      return `Official templates and starter assets to speed up adoption of ${dealName}.`;
    case "community":
      return `Community-led best practices, answers, and implementation help for ${dealName}.`;
    case "video":
      return `Official video walkthrough to help your team get productive with ${dealName}.`;
    case "hands-on lab":
      return `Hands-on exercises and guided practice for learning ${dealName}.`;
    default:
      return `Official guide to help your team get more value from ${dealName}.`;
  }
};

const buildResourceCtaLabel = (type: string): string => {
  return RESOURCE_CTA_LABELS[type] || "Open Resource";
};

const normalizeResources = (rawDeal: RawDeal, dealName: string): Resource[] => {
  const primaryDealUrl = getPrimaryDealUrl(rawDeal);
  const rawResources = Array.isArray(rawDeal.resources) ? rawDeal.resources : [];

  const normalized = rawResources
    .map((entry, index) => {
      const rawEntry = (entry || {}) as Record<string, unknown>;
      const link = normalizeUrl(rawEntry.link || rawEntry.url || rawEntry.href);
      const title = normalizeString(rawEntry.title);

      if (!link || !title || isHomepageFallback(link, primaryDealUrl)) {
        return null;
      }

      const type = normalizeResourceType(rawEntry.type, rawEntry.title, link);

      return {
        id: normalizeString(rawEntry.id) || `resource-${index + 1}`,
        title,
        type,
        description: normalizeString(rawEntry.description) || buildResourceDescription(type, title, dealName),
        link,
        url: link,
        image: normalizeString(rawEntry.image) || undefined,
        date: normalizeString(rawEntry.date) || undefined,
        ctaLabel: normalizeString(rawEntry.ctaLabel) || buildResourceCtaLabel(type),
      } satisfies Resource;
    })
    .filter((resource): resource is Resource => Boolean(resource));

  const deduped = normalized.filter(
    (resource, index, allResources) =>
      allResources.findIndex((candidate) => candidate.link === resource.link) === index
  );

  return deduped
    .sort((left, right) => {
      const leftPriority = RESOURCE_TYPE_PRIORITIES[left.type] ?? 99;
      const rightPriority = RESOURCE_TYPE_PRIORITIES[right.type] ?? 99;
      return leftPriority - rightPriority;
    })
    .slice(0, 3);
};

const normalizeFeature = (feature: unknown, index: number): Feature | null => {
  const rawFeature = (feature || {}) as Record<string, unknown>;
  const title = normalizeString(rawFeature.title);
  const description = normalizeString(rawFeature.description);

  if (!title && !description) return null;

  return {
    id: normalizeString(rawFeature.id) || `feature-${index + 1}`,
    icon: normalizeString(rawFeature.icon) || "Sparkles",
    title: title || `Feature ${index + 1}`,
    description: description || "Feature details coming soon.",
  };
};

const normalizePricingPlan = (plan: unknown, index: number): PricingPlan | null => {
  const rawPlan = (plan || {}) as Record<string, unknown>;
  const name = normalizeString(rawPlan.name);

  if (!name) return null;

  return {
    name,
    price: normalizeString(rawPlan.price) || "Custom",
    billingPeriod: normalizeString(rawPlan.billingPeriod) || undefined,
    description: normalizeString(rawPlan.description) || "Pricing details available on the official website.",
    features: normalizeStringArray(rawPlan.features),
    highlighted: Boolean(rawPlan.highlighted),
  };
};

const normalizeFaqItem = (item: unknown, index: number): FAQItem | null => {
  const rawItem = (item || {}) as Record<string, unknown>;
  const question = normalizeString(rawItem.question);
  const answer = normalizeString(rawItem.answer);

  if (!question || !answer) return null;

  return {
    id: normalizeString(rawItem.id) || `faq-${index + 1}`,
    question,
    answer,
  };
};

const normalizeReview = (item: unknown, index: number): Review | null => {
  const rawReview = (item || {}) as Record<string, unknown>;
  const author = normalizeString(rawReview.author);

  if (!author) return null;

  return {
    id: normalizeString(rawReview.id) || `review-${index + 1}`,
    author,
    role: normalizeString(rawReview.role) || "Customer",
    company: normalizeString(rawReview.company) || undefined,
    avatar: normalizeString(rawReview.avatar) || undefined,
    rating: Number(rawReview.rating || 5),
    quote: normalizeString(rawReview.quote || rawReview.text) || "Great experience.",
    date: normalizeString(rawReview.date) || new Date().toISOString().slice(0, 10),
  };
};

const normalizeAlternative = (item: unknown, index: number): Alternative | null => {
  const rawAlternative = (item || {}) as Record<string, unknown>;
  const name = normalizeString(rawAlternative.name);

  if (!name) return null;

  return {
    id: normalizeString(rawAlternative.id) || `alternative-${index + 1}`,
    name,
    logo: normalizeString(rawAlternative.logo),
    tagline:
      normalizeString(rawAlternative.tagline) ||
      normalizeString(rawAlternative.description) ||
      "Alternative option",
    pros: normalizeStringArray(rawAlternative.pros),
    cons: normalizeStringArray(rawAlternative.cons),
    savings: normalizeString(rawAlternative.savings) || undefined,
  };
};

const normalizeRelatedDeal = (item: unknown, index: number): PopularDeal | null => {
  const rawRelatedDeal = (item || {}) as Record<string, unknown>;
  const name = normalizeString(rawRelatedDeal.name);

  if (!name) return null;

  return {
    id: normalizeString(rawRelatedDeal.id) || `related-${index + 1}`,
    name,
    logo: normalizeString(rawRelatedDeal.logo),
    dealText: normalizeString(rawRelatedDeal.dealText || rawRelatedDeal.tagline) || "Exclusive offer",
    savings: normalizeString(rawRelatedDeal.savings) || "Special offer",
    memberCount: Number(rawRelatedDeal.memberCount || 0),
  };
};

export function normalizeComprehensiveDeal(rawDeal: RawDeal, dealId?: string): ComprehensiveDealDetail {
  const resolvedId =
    normalizeString(rawDeal.id) ||
    normalizeString(dealId) ||
    normalizeString(rawDeal.name).toLowerCase().replace(/\s+/g, "-");
  const name = normalizeString(rawDeal.name) || "Deal";
  const rawDeals = ((rawDeal.deals || {}) as Record<string, unknown>) || {};
  const rawGeneral = ((rawDeal.general || rawDeal.generalInfo || {}) as Record<string, unknown>) || {};
  const rawEligibility = rawDeal.eligibility;
  const pricingSource =
    Array.isArray(rawDeal.pricing)
      ? {
          description: "",
          plans: rawDeal.pricing,
        }
      : (((rawDeal.pricing || {}) as Record<string, unknown>) || {});

  return {
    id: resolvedId,
    name,
    logo: normalizeString(rawDeal.logo),
    rating: Number(rawDeal.rating || 4.5),
    reviewCount: Number(rawDeal.reviewCount || (Array.isArray(rawDeal.reviews) ? rawDeal.reviews.length : 0)),
    memberCount: Number(rawDeal.memberCount || ((rawDeal.socialProof || {}) as Record<string, unknown>).redeemedCount || 0),
    title: normalizeString(rawDeal.title) || normalizeString((rawDeal.dealHighlight as Record<string, unknown> | undefined)?.headline) || name,
    subtitle: normalizeString(rawDeal.subtitle) || normalizeString(rawDeal.shortDescription),
    shortDescription:
      normalizeString(rawDeal.shortDescription) ||
      normalizeString(rawDeal.subtitle) ||
      normalizeString(rawDeal.description) ||
      `${name} helps startups move faster with a trusted partner offer.`,
    dealHighlight: {
      savings:
        normalizeString((rawDeal.dealHighlight as Record<string, unknown> | undefined)?.savings) ||
        normalizeString(rawDeal.savings) ||
        "Special offer",
      headline:
        normalizeString((rawDeal.dealHighlight as Record<string, unknown> | undefined)?.headline) ||
        normalizeString(rawDeal.title) ||
        normalizeString(rawDeal.subtitle) ||
        normalizeString(rawDeal.description) ||
        `Exclusive ${name} offer`,
    },
    socialProof: {
      redeemedCount: Number(((rawDeal.socialProof || {}) as Record<string, unknown>).redeemedCount || rawDeal.memberCount || 0),
      avatars: normalizeStringArray(((rawDeal.socialProof || {}) as Record<string, unknown>).avatars),
      testimonialQuote: normalizeString(((rawDeal.socialProof || {}) as Record<string, unknown>).testimonialQuote) || undefined,
      testimonialAuthor: normalizeString(((rawDeal.socialProof || {}) as Record<string, unknown>).testimonialAuthor) || undefined,
      testimonialRole: normalizeString(((rawDeal.socialProof || {}) as Record<string, unknown>).testimonialRole) || undefined,
    },
    deals: {
      title: normalizeString(rawDeals.title || rawDeals.headline) || `About ${name}`,
      explanation:
        normalizeString(rawDeals.explanation) ||
        normalizeString(rawDeal.shortDescription) ||
        normalizeString(rawDeal.description) ||
        `${name} is a trusted solution for growing startups.`,
      howCanBenefit:
        normalizeString(rawDeals.howCanBenefit) ||
        normalizeStringArray(rawDeals.howCanIBenefit).join(" "),
      howCanIBenefit: normalizeStringArray(rawDeals.howCanIBenefit),
      whyChooseThis: normalizeStringArray(rawDeals.whyChooseThis),
    },
    general: {
      overview:
        normalizeString(rawGeneral.overview) ||
        normalizeString(rawDeal.description) ||
        `${name} is designed to help teams work faster and scale with confidence.`,
      useCases: normalizeStringArray(rawGeneral.useCases),
      features: (Array.isArray(rawGeneral.features) ? rawGeneral.features : [])
        .map(normalizeFeature)
        .filter((feature): feature is Feature => Boolean(feature)),
      technicalInfo: normalizeString(rawGeneral.technicalInfo) || undefined,
      website:
        normalizeString(rawGeneral.website) ||
        normalizeString(rawDeal.website) ||
        normalizeString(rawDeal.redeemUrl) ||
        undefined,
    },
    eligibility: Array.isArray(rawEligibility)
      ? {
          requirements: normalizeStringArray(rawEligibility),
        }
      : {
          requirements: normalizeStringArray((rawEligibility as Record<string, unknown> | undefined)?.requirements),
          limitations: normalizeStringArray((rawEligibility as Record<string, unknown> | undefined)?.limitations),
          applicationProcess: normalizeString((rawEligibility as Record<string, unknown> | undefined)?.applicationProcess) || undefined,
          contactEmail: normalizeString((rawEligibility as Record<string, unknown> | undefined)?.contactEmail) || undefined,
        },
    faq: (Array.isArray(rawDeal.faq) ? rawDeal.faq : [])
      .map(normalizeFaqItem)
      .filter((item): item is FAQItem => Boolean(item)),
    pricing: {
      description: normalizeString(pricingSource.description) || undefined,
      plans: (Array.isArray(pricingSource.plans) ? pricingSource.plans : [])
        .map(normalizePricingPlan)
        .filter((plan): plan is PricingPlan => Boolean(plan)),
    },
    features: (Array.isArray(rawDeal.features) ? rawDeal.features : [])
      .map(normalizeFeature)
      .filter((feature): feature is Feature => Boolean(feature)),
    reviews: (Array.isArray(rawDeal.reviews) ? rawDeal.reviews : [])
      .map(normalizeReview)
      .filter((review): review is Review => Boolean(review)),
    alternatives: (Array.isArray(rawDeal.alternatives) ? rawDeal.alternatives : [])
      .map(normalizeAlternative)
      .filter((alternative): alternative is Alternative => Boolean(alternative)),
    relatedDeals: (Array.isArray(rawDeal.relatedDeals) ? rawDeal.relatedDeals : [])
      .map(normalizeRelatedDeal)
      .filter((relatedDeal): relatedDeal is PopularDeal => Boolean(relatedDeal)),
    resources: normalizeResources(rawDeal, name),
    seoDescription:
      normalizeString(rawDeal.seoDescription) ||
      normalizeString(rawDeal.shortDescription) ||
      normalizeString(rawDeal.description) ||
      undefined,
    isPremium: Boolean(rawDeal.isPremium || (resolvedId && isPremiumDeal(resolvedId))),
  };
}
