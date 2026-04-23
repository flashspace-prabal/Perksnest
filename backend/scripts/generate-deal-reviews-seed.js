const fs = require("fs");
const path = require("path");

const frontendReviewsPath = path.resolve(__dirname, "../../frontend/src/data/reviews.ts");
const outputDir = path.resolve(__dirname, "data");
const outputJsonPath = path.resolve(outputDir, "deal-reviews.seed.json");
const outputSqlPath = path.resolve(__dirname, "03-seed-deal-reviews.sql");
const reviewDate = "2026-04-23T00:00:00.000Z";

const menAvatars = Array.from({ length: 10 }, (_, index) => `/assets/testimonials/men-${index + 1}.jpg`);
const womenAvatars = Array.from({ length: 10 }, (_, index) => `/assets/testimonials/women-${index + 1}.jpg`);

const honorifics = new Set(["dr", "dr.", "prof", "prof.", "professor", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "mx", "mx."]);
const femaleNameOverrides = new Set([
  "aisha", "amelia", "anita", "ava", "carla", "cassandra", "elena", "fatima", "grace", "jade",
  "jennifer", "jessica", "lily", "maya", "melissa", "michelle", "monica", "ngoc", "nina",
  "olivia", "priya", "rebecca", "sofia", "sophia", "sophie", "victoria", "zara",
]);
const maleNameOverrides = new Set([
  "alessandro", "amit", "andreas", "arjun", "brian", "carlos", "david", "diego", "felix", "hans",
  "hassan", "henrik", "karthik", "klaus", "lin", "luis", "marco", "marcus", "nathan", "oliver",
  "oscar", "rajesh", "robert", "thomas", "tom", "vikram",
]);

function normalizeToken(token) {
  return token.toLowerCase().replace(/[^a-z]/g, "");
}

function getFirstGivenName(name) {
  const parts = String(name)
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  return parts.find((part) => !honorifics.has(part)) || "reviewer";
}

function detectGender(name) {
  const givenName = getFirstGivenName(name);
  if (femaleNameOverrides.has(givenName) && !maleNameOverrides.has(givenName)) return "female";
  if (maleNameOverrides.has(givenName) && !femaleNameOverrides.has(givenName)) return "male";
  return givenName.endsWith("a") || givenName.endsWith("i") ? "female" : "male";
}

function hashValue(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getReviewerAvatar(name) {
  const pool = detectGender(name) === "female" ? womenAvatars : menAvatars;
  return pool[hashValue(String(name).toLowerCase()) % pool.length];
}

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function parseReviewsFile(content) {
  const reviewPattern =
    /createReview\(\s*"([^"]+)"\s*,\s*"([^"]*)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"(?:\s*,\s*(\d+))?\s*\)/gms;

  const reviews = [];
  let match;

  while ((match = reviewPattern.exec(content))) {
    const [, dealId, quote, author, role, company, rating] = match;
    reviews.push({
      deal_id: dealId,
      name: author,
      role,
      company,
      image_url: getReviewerAvatar(author),
      review_text: quote,
      rating: Number(rating || 5),
      created_at: reviewDate,
      updated_at: reviewDate,
    });
  }

  return reviews;
}

function buildSql(reviews) {
  const dealIds = [...new Set(reviews.map((review) => review.deal_id))];
  const values = reviews
    .map(
      (review) =>
        `  ('${escapeSql(review.deal_id)}', '${escapeSql(review.name)}', '${escapeSql(review.role)}', '${escapeSql(
          review.company
        )}', '${escapeSql(review.image_url)}', '${escapeSql(review.review_text)}', ${review.rating}, '${
          review.created_at
        }'::timestamptz, '${review.updated_at}'::timestamptz)`
    )
    .join(",\n");

  const dealIdList = dealIds.map((dealId) => `'${escapeSql(dealId)}'`).join(", ");

  return `-- Deal reviews seed generated from frontend/src/data/reviews.ts
-- Generated on 2026-04-23

create extension if not exists pgcrypto;

create table if not exists public.deal_reviews (
  id uuid primary key default gen_random_uuid(),
  deal_id text not null,
  name text not null,
  role text not null,
  company text,
  image_url text not null,
  review_text text not null,
  rating integer not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deal_reviews add column if not exists deal_id text;
alter table public.deal_reviews add column if not exists name text;
alter table public.deal_reviews add column if not exists role text;
alter table public.deal_reviews add column if not exists company text;
alter table public.deal_reviews add column if not exists image_url text;
alter table public.deal_reviews add column if not exists review_text text;
alter table public.deal_reviews add column if not exists rating integer default 5;
alter table public.deal_reviews add column if not exists created_at timestamptz default now();
alter table public.deal_reviews add column if not exists updated_at timestamptz default now();

create index if not exists idx_deal_reviews_deal_id on public.deal_reviews (deal_id);

begin;

delete from public.deal_reviews
where deal_id in (${dealIdList});

insert into public.deal_reviews (
  deal_id,
  name,
  role,
  company,
  image_url,
  review_text,
  rating,
  created_at,
  updated_at
)
values
${values};

commit;
`;
}

function main() {
  const source = fs.readFileSync(frontendReviewsPath, "utf8");
  const reviews = parseReviewsFile(source);

  if (!reviews.length) {
    throw new Error("No reviews were parsed from frontend/src/data/reviews.ts");
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputJsonPath, `${JSON.stringify(reviews, null, 2)}\n`, "utf8");
  fs.writeFileSync(outputSqlPath, buildSql(reviews), "utf8");

  console.log(`[deal-reviews-seed] wrote ${reviews.length} reviews to:`);
  console.log(`- ${outputJsonPath}`);
  console.log(`- ${outputSqlPath}`);
}

main();
