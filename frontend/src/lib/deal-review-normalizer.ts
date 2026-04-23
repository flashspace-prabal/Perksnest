import { Review } from "@/data/deal-details-schema";
import { getReviewerAvatar } from "@/lib/reviewer-avatars";

export interface DealPageReview extends Review {
  dealId?: string;
  source: "backend" | "fallback" | "embedded";
}

const defaultDate = "2026-04-23";

const toStringValue = (value: unknown) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const toRatingValue = (value: unknown) => {
  const parsed = Number(value || 5);
  if (!Number.isFinite(parsed)) return 5;
  return Math.max(1, Math.min(5, Math.round(parsed)));
};

const makeId = (dealId: string | undefined, author: string, index: number) => {
  const authorSlug = author.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${dealId || "review"}-${authorSlug || index + 1}-${index + 1}`;
};

export function normalizeDealReview(
  item: unknown,
  options: {
    dealId?: string;
    index: number;
    source: DealPageReview["source"];
  }
): DealPageReview | null {
  const rawReview = (item || {}) as Record<string, unknown>;
  const author =
    toStringValue(rawReview.author) ||
    toStringValue(rawReview.name) ||
    toStringValue(rawReview.reviewer_name);

  const quote =
    toStringValue(rawReview.quote) ||
    toStringValue(rawReview.review_text) ||
    toStringValue(rawReview.text) ||
    toStringValue(rawReview.comment);

  if (!author || !quote) return null;

  return {
    id: toStringValue(rawReview.id) || makeId(options.dealId, author, options.index),
    dealId:
      toStringValue(rawReview.dealId) ||
      toStringValue(rawReview.deal_id) ||
      options.dealId,
    author,
    role:
      toStringValue(rawReview.role) ||
      toStringValue(rawReview.title) ||
      "Founder",
    company: toStringValue(rawReview.company) || undefined,
    avatar: getReviewerAvatar(
      author,
      toStringValue(rawReview.avatar) ||
        toStringValue(rawReview.image_url) ||
        toStringValue(rawReview.profile_image)
    ),
    rating: toRatingValue(rawReview.rating),
    quote,
    date:
      toStringValue(rawReview.date) ||
      toStringValue(rawReview.created_at) ||
      toStringValue(rawReview.createdAt) ||
      defaultDate,
    source: options.source,
  };
}

export function normalizeDealReviewCollection(
  items: unknown,
  options: {
    dealId?: string;
    source: DealPageReview["source"];
  }
) {
  const reviews = Array.isArray(items) ? items : [];

  return reviews
    .map((item, index) =>
      normalizeDealReview(item, {
        dealId: options.dealId,
        index,
        source: options.source,
        })
    )
    .filter((review): review is DealPageReview => Boolean(review));
}

export function normalizeApiDealReviews(payload: unknown, dealId: string) {
  const rawPayload = (payload || {}) as Record<string, unknown>;
  const rawReviews = Array.isArray(rawPayload.reviews)
    ? rawPayload.reviews
    : Array.isArray(rawPayload.review)
      ? rawPayload.review
      : rawPayload.review
        ? [rawPayload.review]
        : [];

  return normalizeDealReviewCollection(rawReviews, {
    dealId,
    source: "backend",
  });
}
