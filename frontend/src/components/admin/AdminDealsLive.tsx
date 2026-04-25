import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle, Edit, Eye, Plus, Search, Trash2, X, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  createAdminDeal,
  deleteAdminDeal,
  getAdminDeals,
  updateAdminDeal,
  updatePartnerDealStatusAdmin,
} from "@/lib/api";
import type { AdminPartnerDeal, AdminPlatformDeal } from "@/lib/admin";
import { relativeDateLabel } from "@/lib/admin";

type DealForm = {
  id?: string;
  name: string;
  slug: string;
  company: string;
  logo: string;
  category: string;
  subcategory: string;
  description: string;
  dealText: string;
  savings: string;
  dealType: "free" | "premium";
  memberCount: string;
  featured: boolean;
  isPick: boolean;
  benefits: string[];
  steps: string[];
  featureItems: string[];
  pricingDescription: string;
  pricingPlans: string[];
  faqs: string[];
  reviewItems: string[];
  redeemUrl: string;
  website: string;
  promoCode: string;
  expiresAt: string;
  expiresIn: string;
  collection: string;
};

const tabs = [
  { id: "basic", label: "Basic Info" },
  { id: "offer", label: "Offer" },
  { id: "content", label: "Content" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "faqs", label: "FAQs" },
  { id: "reviews", label: "Reviews" },
  { id: "steps", label: "Steps" },
  { id: "links", label: "Links" },
] as const;

type TabId = (typeof tabs)[number]["id"];
type DynamicListKey = "benefits" | "steps" | "featureItems" | "pricingPlans" | "faqs" | "reviewItems";

const categories = [
  "data",
  "productivity",
  "marketing",
  "sales",
  "design",
  "development",
  "finance",
  "analytics",
  "security",
  "collaboration",
  "other",
];

const defaultForm: DealForm = {
  name: "",
  slug: "",
  company: "",
  logo: "",
  category: "productivity",
  subcategory: "",
  description: "",
  dealText: "",
  savings: "",
  dealType: "free",
  memberCount: "0",
  featured: false,
  isPick: false,
  benefits: [""],
  steps: [""],
  featureItems: [""],
  pricingDescription: "",
  pricingPlans: [""],
  faqs: [""],
  reviewItems: [""],
  redeemUrl: "",
  website: "",
  promoCode: "",
  expiresAt: "",
  expiresIn: "",
  collection: "",
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);

const isValidUrl = (value: string) => {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isValidAssetUrl = (value: string) =>
  !value.trim() || isValidUrl(value) || /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/i.test(value);

const textArray = (value: unknown, fallback = [""]) =>
  Array.isArray(value) ? value.map((item) => String(item || "")).filter(Boolean) : fallback;

const featureLines = (value: unknown, fallback = [""]) =>
  Array.isArray(value)
    ? value.map((item: any) => typeof item === "string" ? item : [item?.title, item?.description].filter(Boolean).join(" | ")).filter(Boolean)
    : fallback;

const pricingPlanLines = (value: unknown, fallback = [""]) =>
  Array.isArray(value)
    ? value.map((item: any) => [item?.name, item?.price, item?.description, Array.isArray(item?.features) ? item.features.join("; ") : ""].filter(Boolean).join(" | ")).filter(Boolean)
    : fallback;

const faqLines = (value: unknown, fallback = [""]) =>
  Array.isArray(value)
    ? value.map((item: any) => [item?.question, item?.answer].filter(Boolean).join(" | ")).filter(Boolean)
    : fallback;

const reviewLines = (value: unknown, fallback = [""]) =>
  Array.isArray(value)
    ? value.map((item: any) => [item?.author, item?.role, item?.rating, item?.quote || item?.text].filter(Boolean).join(" | ")).filter(Boolean)
    : fallback;

const parseFeatures = (lines: string[]) =>
  lines.map((line, index) => {
    const [title, description] = line.split("|").map((part) => part.trim());
    if (!title) return null;
    return {
      id: `feature-${index + 1}`,
      icon: index % 3 === 0 ? "Zap" : index % 3 === 1 ? "ShieldCheck" : "Sparkles",
      title,
      description: description || `Includes ${title.toLowerCase()} for startup teams.`,
    };
  }).filter(Boolean);

const parsePricingPlans = (lines: string[]) =>
  lines.map((line, index) => {
    const [name, price, description, features] = line.split("|").map((part) => part.trim());
    if (!name || !price) return null;
    return {
      name,
      price,
      description: description || "Partner pricing details available on the official website.",
      features: features ? features.split(";").map((feature) => feature.trim()).filter(Boolean) : [],
      highlighted: index === 0,
    };
  }).filter(Boolean);

const parseFaqs = (lines: string[]) =>
  lines.map((line, index) => {
    const [question, answer] = line.split("|").map((part) => part.trim());
    if (!question || !answer) return null;
    return { id: `faq-${index + 1}`, question, answer };
  }).filter(Boolean);

const parseReviews = (lines: string[]) =>
  lines.map((line, index) => {
    const [author, role, rating, quote] = line.split("|").map((part) => part.trim());
    if (!author || !quote) return null;
    return {
      id: `review-${index + 1}`,
      author,
      role: role || "Customer",
      rating: Number(rating || 5),
      quote,
      date: new Date().toISOString().slice(0, 10),
    };
  }).filter(Boolean);

const normalizePlatformDeal = (deal: AdminPlatformDeal & Record<string, unknown>) => ({
  ...deal,
  description: String(deal.description || ""),
  dealText: String(deal.dealText || deal.deal_text || ""),
  savings: String(deal.savings || ""),
  category: String(deal.category || "other"),
  logo: String(deal.logo || ""),
  link: String(deal.link || deal.redeem_url || deal.website || ""),
});

const formFromDeal = (deal: AdminPlatformDeal & Record<string, unknown>): DealForm => ({
  id: String(deal.id || ""),
  name: String(deal.name || ""),
  slug: String(deal.slug || deal.id || slugify(String(deal.name || ""))),
  company: String(deal.company || deal.name || ""),
  logo: String(deal.logo || ""),
  category: String(deal.category || "other"),
  subcategory: String(deal.subcategory || ""),
  description: String(deal.description || ""),
  dealText: String(deal.deal_text || deal.dealText || ""),
  savings: String(deal.savings || ""),
  dealType: deal.is_premium || deal.isPremium ? "premium" : "free",
  memberCount: String(deal.member_count || deal.memberCount || 0),
  featured: Boolean(deal.featured),
  isPick: Boolean(deal.is_pick || deal.isPick),
  benefits: textArray(deal.eligibility),
  steps: textArray(deal.steps),
  featureItems: featureLines(deal.features),
  pricingDescription: String((deal.pricing as any)?.description || ""),
  pricingPlans: pricingPlanLines((deal.pricing as any)?.plans),
  faqs: faqLines(deal.faq),
  reviewItems: reviewLines(deal.reviews),
  redeemUrl: String(deal.redeem_url || deal.link || ""),
  website: String(deal.website || deal.redeem_url || ""),
  promoCode: String(deal.promo_code || ""),
  expiresAt: String(deal.expires_at || "").slice(0, 10),
  expiresIn: String(deal.expires_in || ""),
  collection: String(deal.collection || ""),
});

const buildPayload = (form: DealForm) => {
  const features = parseFeatures(form.featureItems.map((item) => item.trim()).filter(Boolean));
  const pricingPlans = parsePricingPlans(form.pricingPlans.map((item) => item.trim()).filter(Boolean));
  const faq = parseFaqs(form.faqs.map((item) => item.trim()).filter(Boolean));
  const reviews = parseReviews(form.reviewItems.map((item) => item.trim()).filter(Boolean));

  return {
    name: form.name.trim(),
    slug: form.slug.trim() || slugify(form.name),
    company: form.company.trim(),
    logo: form.logo.trim(),
    category: form.category,
    subcategory: form.subcategory.trim(),
    description: form.description.trim(),
    deal_text: form.dealText.trim(),
    savings: form.savings.trim(),
    dealType: form.dealType,
    member_count: Number(form.memberCount || 0),
    featured: form.featured,
    is_pick: form.isPick,
    eligibility: form.benefits.map((benefit) => benefit.trim()).filter(Boolean),
    steps: form.steps.map((step) => step.trim()).filter(Boolean),
    features,
    faq,
    reviews,
    pricing: {
      description: form.pricingDescription.trim(),
      plans: pricingPlans,
    },
    deal_highlight: {
      savings: form.savings.trim(),
      headline: form.dealText.trim(),
    },
    general: {
      overview: form.description.trim(),
      useCases: form.benefits.map((benefit) => benefit.trim()).filter(Boolean).slice(0, 4),
      features,
      website: (form.website || form.redeemUrl).trim(),
    },
    redeem_url: form.redeemUrl.trim(),
    website: (form.website || form.redeemUrl).trim(),
    promo_code: form.promoCode.trim(),
    expires_at: form.expiresAt,
    expires_in: form.expiresIn.trim(),
    collection: form.collection.trim(),
  };
};

const validateForm = (form: DealForm) => {
  const payload = buildPayload(form);
  const errors: string[] = [];

  if (!payload.name) errors.push("Deal name is required.");
  if (!payload.slug) errors.push("Slug is required.");
  if (!payload.company) errors.push("Company name is required.");
  if (!payload.description) errors.push("Description is required.");
  if (!payload.deal_text) errors.push("Deal text is required.");
  if (!payload.savings) errors.push("Savings is required.");
  if (!payload.redeem_url) errors.push("Claim URL is required.");
  if (payload.eligibility.length === 0) errors.push("Add at least one benefit.");
  if (payload.pricing.plans.length === 0) errors.push("Add at least one pricing plan.");
  if (payload.features.length === 0) errors.push("Add at least one detail page feature.");
  if (payload.faq.length === 0) errors.push("Add at least one FAQ.");
  if (payload.reviews.length === 0) errors.push("Add at least one review.");
  if (payload.steps.length === 0) errors.push("Add at least one redemption step.");
  if (!isValidAssetUrl(payload.logo)) errors.push("Logo must be a valid URL or uploaded image.");
  if (!isValidUrl(payload.redeem_url)) errors.push("Claim URL must be a valid URL.");
  if (!isValidUrl(payload.website)) errors.push("Website must be a valid URL.");

  return errors;
};

export const AdminDealsLive = () => {
  const [platformDeals, setPlatformDeals] = useState<(AdminPlatformDeal & Record<string, unknown>)[]>([]);
  const [partnerDeals, setPartnerDeals] = useState<AdminPartnerDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<DealForm>(defaultForm);
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await getAdminDeals();
      setPlatformDeals(Array.isArray(response.deals) ? response.deals.map((deal) => normalizePlatformDeal(deal as AdminPlatformDeal & Record<string, unknown>)) : []);
      setPartnerDeals(Array.isArray(response.partnerDeals) ? response.partnerDeals : []);
    } catch (err) {
      console.error("Failed to load deals:", err);
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const pendingDeals = useMemo(() => partnerDeals.filter((deal) => deal.status === "pending"), [partnerDeals]);
  const filteredPlatformDeals = useMemo(() => {
    const normalized = search.toLowerCase().trim();
    return platformDeals.filter((deal) => {
      if (!normalized) return true;
      return [deal.name, deal.description, deal.category, deal.company]
        .map((value) => String(value || "").toLowerCase())
        .some((value) => value.includes(normalized));
    });
  }, [platformDeals, search]);

  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;

  const updateForm = <Key extends keyof DealForm>(key: Key, value: DealForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(defaultForm);
    setActiveTab("basic");
    window.history.replaceState(null, "", "/admin/add-deal");
  };

  const startEdit = (deal: AdminPlatformDeal & Record<string, unknown>) => {
    setEditingId(String(deal.id));
    setForm(formFromDeal(deal));
    setActiveTab("basic");
    window.history.replaceState(null, "", `/admin/add-deal?deal=${deal.id}`);
    window.setTimeout(() => {
      document.getElementById("admin-deal-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm);
    setActiveTab("basic");
    window.history.replaceState(null, "", "/admin");
  };

  const updateDynamicList = (key: DynamicListKey, index: number, value: string) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const addDynamicListItem = (key: DynamicListKey) => {
    setForm((current) => ({ ...current, [key]: [...current[key], ""] }));
  };

  const removeDynamicListItem = (key: DynamicListKey, index: number) => {
    setForm((current) => ({
      ...current,
      [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleDynamicEnter = (event: KeyboardEvent<HTMLInputElement>, key: DynamicListKey, index: number) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = form[key][index]?.trim();
    if (value) addDynamicListItem(key);
  };

  const uploadImage = (file: File, onLoaded: (value: string) => void) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 750 * 1024) {
      toast.error("Image uploads must be under 750 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onLoaded(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const saveDeal = async () => {
    const errors = validateForm(form);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setSaving(true);
      const payload = buildPayload(form);
      if (editingId) {
        await updateAdminDeal(editingId, payload);
        toast.success("Deal updated");
      } else {
        await createAdminDeal(payload);
        toast.success("Deal created in Supabase");
      }
      resetForm();
      await loadDeals();
    } catch (err) {
      console.error("Failed to save deal:", err);
      toast.error(err instanceof Error ? err.message : "Failed to save deal");
    } finally {
      setSaving(false);
    }
  };

  const removeDeal = async (dealId: string) => {
    if (!window.confirm("Delete this deal?")) return;
    try {
      setActioningId(dealId);
      await deleteAdminDeal(dealId);
      toast.success("Deal deleted");
      if (editingId === dealId) resetForm();
      await loadDeals();
    } catch (err) {
      console.error("Failed to delete deal:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete deal");
    } finally {
      setActioningId(null);
    }
  };

  const updatePendingStatus = async (dealId: string, status: "approved" | "rejected") => {
    try {
      setActioningId(dealId);
      await updatePartnerDealStatusAdmin(dealId, status);
      toast.success(`Deal ${status}`);
      await loadDeals();
    } catch (err) {
      console.error(`Failed to ${status} partner deal:`, err);
      toast.error(`Failed to ${status} deal`);
    } finally {
      setActioningId(null);
    }
  };

  const goBack = () => {
    if (currentTabIndex > 0) setActiveTab(tabs[currentTabIndex - 1].id);
  };

  const goNext = () => {
    if (!isLastTab) setActiveTab(tabs[currentTabIndex + 1].id);
  };

  return (
    <div className="space-y-6">
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Deal Approvals</CardTitle>
          <Badge variant="secondary">{pendingDeals.length}</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading pending deals...</p>
          ) : pendingDeals.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending partner deals.</p>
          ) : pendingDeals.map((deal) => (
            <div key={deal.id} className="rounded-lg border bg-background p-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{deal.name}</p>
                  <Badge variant="outline" className="capitalize">{deal.category}</Badge>
                  <span className="text-xs text-muted-foreground">{relativeDateLabel(deal.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{deal.partnerName}</p>
                <p className="text-sm mt-2">{deal.dealText}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700" disabled={actioningId === deal.id} onClick={() => updatePendingStatus(deal.id, "approved")}>
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="destructive" disabled={actioningId === deal.id} onClick={() => updatePendingStatus(deal.id, "rejected")}>
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
        <Card id="admin-deal-editor">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{editingId ? "Edit Software Deal" : "Add Software Deal"}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Schema-aligned to the current Supabase deals table.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                  <Eye className="h-4 w-4 mr-2" /> Preview
                </Button>
                <Button onClick={saveDeal} disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Update Deal" : "Create Deal"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)} className="space-y-5">
              <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg p-1">
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="min-w-max px-3">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Deal Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value, slug: current.slug || slugify(value) }))} required />
                  <Field label="Slug / ID" value={form.slug} onChange={(value) => updateForm("slug", slugify(value))} required />
                  <Field label="Company" value={form.company} onChange={(value) => updateForm("company", value)} required />
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(value) => updateForm("category", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{categories.map((entry) => <SelectItem key={entry} value={entry}>{entry}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <Field label="Subcategory" value={form.subcategory} onChange={(value) => updateForm("subcategory", value)} />
                  <Field label="Member Count" value={form.memberCount} onChange={(value) => updateForm("memberCount", value)} />
                </div>
                <Field label="Logo URL" value={form.logo} onChange={(value) => updateForm("logo", value)} placeholder="https://..." />
                <div className="space-y-2">
                  <Label>Upload Logo</Label>
                  <Input type="file" accept="image/*" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) uploadImage(file, (value) => updateForm("logo", value));
                  }} />
                </div>
              </TabsContent>

              <TabsContent value="offer" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Deal Text" value={form.dealText} onChange={(value) => updateForm("dealText", value)} placeholder="Up to $5,000 in credits" required />
                  <Field label="Savings" value={form.savings} onChange={(value) => updateForm("savings", value)} placeholder="$5,000" required />
                  <div className="space-y-2">
                    <Label>Deal Type</Label>
                    <Select value={form.dealType} onValueChange={(value: DealForm["dealType"]) => updateForm("dealType", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ToggleField label="Featured" checked={form.featured} onChange={(checked) => updateForm("featured", checked)} />
                    <ToggleField label="Pick" checked={form.isPick} onChange={(checked) => updateForm("isPick", checked)} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Textarea rows={6} value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
                </div>
                <DynamicTextList label="Benefits / Eligibility" values={form.benefits} onAdd={() => addDynamicListItem("benefits")} onRemove={(index) => removeDynamicListItem("benefits", index)} onChange={(index, value) => updateDynamicList("benefits", index, value)} onEnter={(event, index) => handleDynamicEnter(event, "benefits", index)} />
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <DynamicTextList
                  label="Detail Page Features"
                  values={form.featureItems}
                  helper="Format: Feature title | Feature description"
                  onAdd={() => addDynamicListItem("featureItems")}
                  onRemove={(index) => removeDynamicListItem("featureItems", index)}
                  onChange={(index, value) => updateDynamicList("featureItems", index, value)}
                  onEnter={(event, index) => handleDynamicEnter(event, "featureItems", index)}
                />
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="space-y-2">
                  <Label>Pricing Description</Label>
                  <Textarea
                    rows={3}
                    value={form.pricingDescription}
                    onChange={(event) => updateForm("pricingDescription", event.target.value)}
                    placeholder="Summarize the real pricing, credit value, or partner offer terms."
                  />
                </div>
                <DynamicTextList
                  label="Pricing Plans"
                  values={form.pricingPlans}
                  helper="Format: Plan name | Price | Description | feature one; feature two"
                  onAdd={() => addDynamicListItem("pricingPlans")}
                  onRemove={(index) => removeDynamicListItem("pricingPlans", index)}
                  onChange={(index, value) => updateDynamicList("pricingPlans", index, value)}
                  onEnter={(event, index) => handleDynamicEnter(event, "pricingPlans", index)}
                />
              </TabsContent>

              <TabsContent value="faqs" className="space-y-4">
                <DynamicTextList
                  label="Deal FAQs"
                  values={form.faqs}
                  helper="Format: Question | Answer"
                  onAdd={() => addDynamicListItem("faqs")}
                  onRemove={(index) => removeDynamicListItem("faqs", index)}
                  onChange={(index, value) => updateDynamicList("faqs", index, value)}
                  onEnter={(event, index) => handleDynamicEnter(event, "faqs", index)}
                />
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <DynamicTextList
                  label="Reviews"
                  values={form.reviewItems}
                  helper="Format: Author | Role | Rating 1-5 | Quote"
                  onAdd={() => addDynamicListItem("reviewItems")}
                  onRemove={(index) => removeDynamicListItem("reviewItems", index)}
                  onChange={(index, value) => updateDynamicList("reviewItems", index, value)}
                  onEnter={(event, index) => handleDynamicEnter(event, "reviewItems", index)}
                />
              </TabsContent>

              <TabsContent value="steps" className="space-y-4">
                <DynamicTextList label="Redemption Steps" values={form.steps} onAdd={() => addDynamicListItem("steps")} onRemove={(index) => removeDynamicListItem("steps", index)} onChange={(index, value) => updateDynamicList("steps", index, value)} onEnter={(event, index) => handleDynamicEnter(event, "steps", index)} />
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <Field label="Claim URL / Redirect Link" value={form.redeemUrl} onChange={(value) => updateForm("redeemUrl", value)} placeholder="https://..." required />
                <Field label="Website" value={form.website} onChange={(value) => updateForm("website", value)} placeholder="https://..." />
                <Field label="Promo Code" value={form.promoCode} onChange={(value) => updateForm("promoCode", value)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Expires At" value={form.expiresAt} onChange={(value) => updateForm("expiresAt", value)} placeholder="YYYY-MM-DD" />
                  <Field label="Expires In" value={form.expiresIn} onChange={(value) => updateForm("expiresIn", value)} placeholder="30 days" />
                  <Field label="Collection" value={form.collection} onChange={(value) => updateForm("collection", value)} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <Button variant="outline" onClick={goBack} disabled={currentTabIndex === 0}>Back</Button>
              {isLastTab ? (
                <Button onClick={saveDeal} disabled={saving}>{saving ? "Saving..." : editingId ? "Update Deal" : "Create Deal"}</Button>
              ) : (
                <Button onClick={goNext}>Next</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>Manage Deals</CardTitle>
              <Button size="sm" onClick={startCreate}><Plus className="h-4 w-4 mr-2" /> New</Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Search deals..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading deals...</p>
            ) : filteredPlatformDeals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No platform deals found.</p>
            ) : filteredPlatformDeals.map((deal) => {
              const isEditingThisDeal = editingId === String(deal.id);

              return (
              <div
                key={deal.id}
                className={`rounded-lg border p-3 transition ${
                  isEditingThisDeal ? "border-primary bg-primary/5 shadow-sm" : "bg-background hover:border-primary/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 gap-3">
                    {deal.logo ? (
                      <img src={String(deal.logo)} alt="" className="h-9 w-9 shrink-0 rounded-md border bg-white object-contain p-1" />
                    ) : null}
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate font-medium">{deal.name}</p>
                        {isEditingThisDeal ? <Badge className="shrink-0">Editing</Badge> : null}
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">{String(deal.category || "other")}</p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant={isEditingThisDeal ? "default" : "outline"}
                    className="h-8 w-8 shrink-0"
                    onClick={() => startEdit(deal)}
                    title="Edit deal"
                    aria-label={`Edit ${deal.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{String(deal.description || "")}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Badge variant="outline">Supabase</Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={actioningId === deal.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      removeDeal(String(deal.id));
                    }}
                    title="Delete deal"
                    aria-label={`Delete ${deal.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
            })}
          </CardContent>
        </Card>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Deal Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-start gap-4 rounded-xl border bg-muted/30 p-5">
              {form.logo ? <img src={form.logo} alt={form.name} className="h-16 w-16 rounded-lg object-cover border bg-white" /> : <div className="h-16 w-16 rounded-lg border bg-white" />}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold">{form.name || "Untitled deal"}</h2>
                  <Badge variant="outline">{form.dealType}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{form.company || "Company"}</p>
                <p className="mt-3 text-base">{form.description || "Description preview"}</p>
              </div>
            </div>
            <PreviewMetric label="Offer" value={form.dealText || "N/A"} />
            <PreviewMetric label="Savings" value={form.savings || "N/A"} />
            <PreviewList title="Benefits / Eligibility" items={form.benefits} />
            <PreviewList title="Detail Features" items={form.featureItems} />
            <PreviewList title="Pricing Plans" items={form.pricingPlans} />
            <PreviewList title="FAQs" items={form.faqs} />
            <PreviewList title="Reviews" items={form.reviewItems} />
            <PreviewList title="Redemption Steps" items={form.steps} ordered />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <Label>{label}{required ? " *" : ""}</Label>
    <Input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
  </div>
);

const ToggleField = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => (
  <label className="flex h-10 items-center gap-3 rounded-md border px-3 text-sm">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    {label}
  </label>
);

const DynamicTextList = ({
  label,
  values,
  helper,
  onAdd,
  onRemove,
  onChange,
  onEnter,
}: {
  label: string;
  values: string[];
  helper?: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
  onEnter: (event: KeyboardEvent<HTMLInputElement>, index: number) => void;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <Label>{label}</Label>
        {helper ? <p className="mt-1 text-xs text-muted-foreground">{helper}</p> : null}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" /> Add
      </Button>
    </div>
    {values.map((value, index) => (
      <div key={index} className="flex gap-2">
        <Input value={value} placeholder={`${label} ${index + 1}`} onKeyDown={(event) => onEnter(event, index)} onChange={(event) => onChange(index, event.target.value)} />
        <Button type="button" variant="ghost" size="icon" disabled={values.length === 1} onClick={() => onRemove(index)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);

const PreviewMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border p-4">
    <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="mt-1 font-semibold">{value}</p>
  </div>
);

const PreviewList = ({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) => {
  const filteredItems = items.filter(Boolean);
  const List = ordered ? "ol" : "ul";
  return (
    <div>
      <h3 className="font-semibold">{title}</h3>
      {filteredItems.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Nothing added yet.</p>
      ) : (
        <List className={`mt-2 space-y-2 text-sm ${ordered ? "list-decimal" : "list-disc"} pl-5`}>
          {filteredItems.map((item, index) => <li key={index}>{item}</li>)}
        </List>
      )}
    </div>
  );
};
