import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE_URL = "https://perksnest.co";
const TODAY = new Date().toISOString().slice(0, 10);

const projectRoot = resolve(process.cwd());
const srcRoot = resolve(projectRoot, "src");
const publicRoot = resolve(projectRoot, "public");

function extractSlugs(filePath) {
  const content = readFileSync(filePath, "utf8");
  const matches = content.matchAll(/slug:\s*"([^"]+)"/g);
  return [...new Set([...matches].map((match) => match[1]))];
}

function createUrlEntry(path, changefreq, priority) {
  const canonical = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  return [
    "  <url>",
    `    <loc>${canonical}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

const staticPages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/deals", changefreq: "daily", priority: "0.9" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/categories", changefreq: "weekly", priority: "0.7" },
  { path: "/collections", changefreq: "weekly", priority: "0.6" },
  { path: "/leaderboard", changefreq: "weekly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/invite", changefreq: "monthly", priority: "0.5" },
  { path: "/white-label", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.4" },
  { path: "/help", changefreq: "monthly", priority: "0.5" },
  { path: "/docs", changefreq: "monthly", priority: "0.5" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
];

const blogSlugs = extractSlugs(resolve(srcRoot, "data", "blogPages.ts")).map((slug) => ({
  path: `/blog/${slug}`,
  changefreq: "monthly",
  priority: "0.7",
}));

const comparisonSlugs = extractSlugs(resolve(srcRoot, "data", "comparisonPages.ts")).map((slug) => ({
  path: `/compare/${slug}`,
  changefreq: "monthly",
  priority: "0.6",
}));

const startupDealSlugs = extractSlugs(resolve(srcRoot, "data", "startupDeals.ts")).map((slug) => ({
  path: `/deals/${slug}`,
  changefreq: "weekly",
  priority: "0.8",
}));

const allEntries = [...staticPages, ...blogSlugs, ...comparisonSlugs, ...startupDealSlugs];
const uniqueEntries = [...new Map(allEntries.map((entry) => [entry.path, entry])).values()];

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueEntries.map((entry) => createUrlEntry(entry.path, entry.changefreq, entry.priority)),
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve(publicRoot, "sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap with ${uniqueEntries.length} URLs.`);

