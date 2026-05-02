import type { Deal } from "@/data/deals";

export const categoryDealMapping: Record<string, string[]> = {
  ai: ["ai"],
  project: ["project", "productivity"],
  data: ["data", "cloud", "database", "storage", "infrastructure", "analytics", "monitoring"],
  customer: ["customer", "crm", "support"],
  development: ["development", "deployment", "ci-cd", "web3", "automation"],
  marketing: ["marketing"],
  finance: ["finance", "payments"],
  communication: ["communication"],
  sales: ["sales"],
  business: ["business"],
  it: ["it", "security", "tools", "backup", "forms"],
  hr: ["hr"],
  operations: ["operations", "automation"],
  lifestyle: ["lifestyle"],
  design: ["design"],
};

export const categoryHasDeals = (categoryId: string, deals: Pick<Deal, "category" | "subcategory">[]) => {
  if (categoryId === "all") return deals.length > 0;

  const mappedCategories = categoryDealMapping[categoryId] || [categoryId];

  return deals.some((deal) => (
    deal.category === categoryId ||
    deal.subcategory === categoryId ||
    mappedCategories.includes(deal.category)
  ));
};

export const getVisibleCategories = <T extends { id: string }>(
  categories: T[],
  deals: Pick<Deal, "category" | "subcategory">[],
) => categories.filter((category) => categoryHasDeals(category.id, deals));

export const getVisibleMegaCategories = <T extends { keys: string[] }>(
  categories: T[],
  deals: Pick<Deal, "category" | "subcategory">[],
) => categories.filter((category) => (
  category.keys.some((key) => categoryHasDeals(key, deals))
));
