const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const frontendReviewsPath = path.resolve(__dirname, "../../frontend/src/data/reviews.ts");
const outputDir = path.resolve(__dirname, "data");
const metadataOutputPath = path.resolve(outputDir, "review-metadata.lookup.json");
const dbSeedOutputPath = path.resolve(outputDir, "reviews.seed.json");
const legacyOutputPath = path.resolve(outputDir, "deal-reviews.seed.json");
const outputSqlPath = path.resolve(__dirname, "03-seed-deal-reviews.sql");

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function toStableUuid(seed) {
  const digest = crypto.createHash("sha1").update(seed).digest("hex");
  const chars = digest.slice(0, 32).split("");
  chars[12] = "5";
  chars[16] = ((parseInt(chars[16], 16) & 0x3) | 0x8).toString(16);
  return `${chars.slice(0, 8).join("")}-${chars.slice(8, 12).join("")}-${chars.slice(12, 16).join("")}-${chars.slice(16, 20).join("")}-${chars.slice(20, 32).join("")}`;
}

function loadFrontendReviews() {
  const source = fs.readFileSync(frontendReviewsPath, "utf8");
  const marker = "export const dealReviews: DealReview[] = [";
  const start = source.indexOf(marker);

  if (start === -1) {
    throw new Error("Could not locate dealReviews export in frontend/src/data/reviews.ts");
  }

  const openIndex = start + marker.length - 1;
  let depth = 0;
  let endIndex = -1;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === "[") depth += 1;
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        endIndex = index;
        break;
      }
    }
  }

  if (endIndex === -1) {
    throw new Error("Could not parse dealReviews array boundaries");
  }

  const arrayLiteral = source.slice(openIndex, endIndex + 1);
  const reviews = Function(`return (${arrayLiteral});`)();

  if (!Array.isArray(reviews) || reviews.length === 0) {
    throw new Error("No review records were loaded from frontend/src/data/reviews.ts");
  }

  return reviews;
}

function toMetadataRecords(reviews) {
  return reviews.map((review) => {
    const reviewDate = String(review.date || "2026-04-23");
    const createdAt = reviewDate.includes("T") ? reviewDate : `${reviewDate}T00:00:00.000Z`;

    return {
      id: review.id,
      deal_id: review.dealId,
      user_name: review.author,
      role: review.role,
      company: review.company || "",
      image_url: review.avatar || "",
      rating: Number(review.rating || 5),
      comment: review.quote,
      review_text: review.quote,
      date: reviewDate,
      created_at: createdAt,
    };
  });
}

function toDbSeedRecords(metadataRecords) {
  return metadataRecords.map((review) => ({
    id: toStableUuid(`review:${review.id}`),
    deal_id: review.deal_id,
    user_id: toStableUuid(`reviewer:${review.deal_id}:${review.user_name}`),
    user_name: review.user_name,
    rating: review.rating,
    comment: review.comment,
    helpful: 0,
    created_at: review.created_at,
  }));
}

function buildSql(reviews) {
  const dealIds = [...new Set(reviews.map((review) => review.deal_id))];
  const values = reviews
    .map(
      (review) =>
        `  ('${review.id}'::uuid, '${escapeSql(review.deal_id)}', '${review.user_id}'::uuid, '${escapeSql(review.user_name)}', ${review.rating}, '${escapeSql(
          review.comment
        )}', ${review.helpful}, '${review.created_at}'::timestamptz)`
    )
    .join(",\n");

  const dealIdList = dealIds.map((dealId) => `'${escapeSql(dealId)}'`).join(", ");

  return `-- Deal reviews seed generated from frontend/src/data/reviews.ts
-- Targets ${process.env.SUPABASE_DB_SCHEMA || "perksnest"}.reviews
-- Generated on 2026-04-24

begin;

alter table ${(process.env.SUPABASE_DB_SCHEMA || "perksnest")}.reviews
alter column deal_id type text using deal_id::text;

delete from ${(process.env.SUPABASE_DB_SCHEMA || "perksnest")}.reviews
where deal_id in (${dealIdList});

insert into ${(process.env.SUPABASE_DB_SCHEMA || "perksnest")}.reviews (
  id,
  deal_id,
  user_id,
  user_name,
  rating,
  comment,
  helpful,
  created_at
)
values
${values};

commit;
`;
}

function main() {
  const frontendReviews = loadFrontendReviews();
  const metadataRecords = toMetadataRecords(frontendReviews);
  const dbSeedRecords = toDbSeedRecords(metadataRecords);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(metadataOutputPath, `${JSON.stringify(metadataRecords, null, 2)}\n`, "utf8");
  fs.writeFileSync(dbSeedOutputPath, `${JSON.stringify(dbSeedRecords, null, 2)}\n`, "utf8");
  fs.writeFileSync(legacyOutputPath, `${JSON.stringify(metadataRecords, null, 2)}\n`, "utf8");
  fs.writeFileSync(outputSqlPath, buildSql(dbSeedRecords), "utf8");

  console.log(`[deal-reviews-seed] wrote ${metadataRecords.length} review metadata rows to:`);
  console.log(`- ${metadataOutputPath}`);
  console.log(`- ${legacyOutputPath}`);
  console.log(`[deal-reviews-seed] wrote ${dbSeedRecords.length} database seed rows to:`);
  console.log(`- ${dbSeedOutputPath}`);
  console.log(`- ${outputSqlPath}`);
}

main();
