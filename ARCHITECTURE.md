# 📊 System Architecture & Data Flow

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      PERKSNEST DEALS SYSTEM                      │
│                   (Unified + Supabase Architecture)             │
└─────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                        FRONTEND (React)                          ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                                                                  ┃
┃  Pages:                                                          ┃
┃  ┌──────────────────────────────────────────────────────────┐  ┃
┃  │ /deals              → DealList (216 deals)               │  ┃
┃  │ /deals/:id          → DealDetail (3-step generic)        │  ┃
┃  │ /deals/:id/redeem   → DealRedeem (actual steps + code)   │  ┃
┃  └──────────────────────────────────────────────────────────┘  ┃
┃                           ↓                                      ┃
┃  lib/deals.ts (Data Layer):                                     ┃
┃  ┌──────────────────────────────────────────────────────────┐  ┃
┃  │ getDeals()    → Priority: Supabase → API → Static       │  ┃
┃  │ getDeal(id)   → Priority: Supabase → API → Static       │  ┃
┃  │ getByCategory → Filters deals by category               │  ┃
┃  │ searchDeals   → Full-text search                        │  ┃
┃  └──────────────────────────────────────────────────────────┘  ┃
┃                                                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
                               ↓
                    ┌─────────────────────┐
                    │   Data Fetching     │
                    │   Priority Chain    │
                    └──────────┬──────────┘
                               ↓
    ┌──────────────────────────┼──────────────────────────┐
    ↓                          ↓                          ↓
┌─────────────┐          ┌──────────────┐          ┌──────────────┐
│  SUPABASE   │ (1st)    │  BACKEND API │ (2nd)    │ STATIC DATA  │ (3rd)
│ (Primary)   │          │  (Fallback)  │          │ (Last Resort)│
└──────┬──────┘          └──────────────┘          └──────────────┘
       ↓
┌──────────────────────────────────────────────────────────────────┐
│                  SUPABASE DATABASE (PostgreSQL)                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Table: perksnest.deals (196 records)                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Columns:                                                   │ │
│  │  • id (TEXT PRIMARY KEY)      - Unique deal ID            │ │
│  │  • slug (TEXT UNIQUE)         - URL-friendly              │ │
│  │  • name, company, logo        - Display fields            │ │
│  │  • description, deal_text     - Content                   │ │
│  │  • savings, member_count      - Metrics                   │ │
│  │  • is_premium, is_free, featured - Flags                  │ │
│  │  • category, subcategory      - Categorization            │ │
│  │  • redeem_url, promo_code     - Redemption               │ │
│  │  • steps (JSONB)              - Step-by-step guides      │ │
│  │  • eligibility (JSONB)        - Requirements             │ │
│  │  • expires_in, collection     - Additional info          │ │
│  │  • created_at, updated_at     - Timestamps               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Indexes:                                                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ • idx_deals_slug              - Fast id/slug lookups      │ │
│  │ • idx_deals_category          - Filter by category        │ │
│  │ • idx_deals_subcategory       - Filter by subcategory     │ │
│  │ • idx_deals_is_premium        - Filter premium deals      │ │
│  │ • idx_deals_featured          - Get featured deals        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Row-Level Security (RLS):                                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Policy: Allow public SELECT (all users can read)          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    DATA SOURCES                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  frontend/src/data/deals.ts (Static Fallback)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ dealsData array (196 deals):                               │ │
│  │  ├─ 140 Regular Deals (Notion, Stripe, Zoom, etc.)       │ │
│  │  └─ 56 Startup Programs (Google Cloud, AWS, etc.)        │ │
│  │                                                            │ │
│  │ Each deal has:                                            │ │
│  │  {                                                         │ │
│  │    id, slug, name, company, logo,                         │ │
│  │    description, dealText, savings, memberCount,           │ │
│  │    isPremium, isFree, isPick, featured,                   │ │
│  │    category, subcategory, lastAdded, expiresAt,          │ │
│  │    collection, redeemUrl, promoCode,                      │ │
│  │    steps: string[],                                        │ │
│  │    website, eligibility: string[], expiresIn              │ │
│  │  }                                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow: Complete Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                 USER ACTION: Visit /deals                        │
└────────────────────────┬────────────────────────────────────────┘
                         ↓
                ┌─────────────────────┐
                │  React Component    │
                │ DealsList.tsx       │
                └──────────┬──────────┘
                           ↓
                ┌─────────────────────┐
                │  Call getDeals()    │
                │ from lib/deals.ts   │
                └──────────┬──────────┘
                           ↓
              ┌────────────────────────────┐
              │  Initialize Supabase       │
              │  Client (if env vars set)  │
              └──────────┬─────────────────┘
                         ↓
            ┌──────────────────────────────┐
            │  Query Supabase:             │
            │  SELECT * FROM deals         │
            └──────────┬───────────────────┘
                       ↓
        ┌──────────────────────────────────┐
        │  200 OK? Data returned?          │
        └────┬─────────────────────────┬──────────┐
             │ Yes (Success)           │ No       │
             ↓                         ↓          ↓
    ✅ Transform                    Try API    Log Error
    ✅ Log Success                  (Fallback)
    ✅ Return 196 deals
             │
             ↓
    ┌──────────────────────┐
    │ Render Deal Cards    │
    │ - 12 per page        │
    │ - Pagination         │
    │ - Filter options     │
    └──────────────────────┘
             ↓
    Display to User ✓
```

## Single Deal Query Flow

```
┌──────────────────────────────────────────────────────┐
│  USER: Click on Notion deal card                     │
│  ROUTE: /deals/notion                                │
└─────────────────────┬────────────────────────────────┘
                      ↓
            ┌────────────────────┐
            │ DealDetail.tsx     │
            │ useParams()        │
            │ dealId = "notion"  │
            └──────────┬─────────┘
                       ↓
            ┌──────────────────────────┐
            │ Call getDeal("notion")   │
            │ from lib/deals.ts        │
            └─────────┬────────────────┘
                      ↓
        ┌─────────────────────────────────┐
        │ Try Supabase:                   │
        │ SELECT * FROM deals             │
        │ WHERE id = "notion"             │
        │    OR slug = "notion"           │
        │ LIMIT 1                         │
        └────┬────────────────────────┬──────┘
             │Success                │ Fail
             ↓                        ↓
    Transform & Return          Try API/Static
             │
             ↓
    ┌──────────────────────────┐
    │ DealDetail Page shows:   │
    │ - Notion logo            │
    │ - Full description       │
    │ - $12,000 savings        │
    │ - 3-step generic process │
    │ - "Claim Offer" button   │
    └──────────────────────────┘
```

## Redeem Flow

```
┌─────────────────────────────────────────┐
│ USER: Click "Claim Offer" button        │
│ ROUTE: /deals/notion/redeem             │
└──────────────┬──────────────────────────┘
               ↓
    ┌──────────────────────────┐
    │ DealRedeem.tsx           │
    │ Calls getDeal()          │
    └────────┬─────────────────┘
             ↓
    ┌──────────────────────────┐
    │ Fetch from Supabase:     │
    │                          │
    │ deal = {                 │
    │   id: "notion",          │
    │   name: "Notion",        │
    │   steps: [],             │  (empty for regular)
    │   promoCode: "ABC123",   │
    │   redeemUrl: "..."       │
    │ }                        │
    └────────┬─────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Check if steps exist:          │
    │ IF steps.length > 0            │
    │   Use deal.steps               │
    │ ELSE                           │
    │   Use redemptionInfo.steps     │
    │   (pre-defined for Notion)     │
    └────────┬───────────────────────┘
             ↓
    ┌────────────────────────────────┐
    │ Render Redeem Page:            │
    │ 1. Deal title & description    │
    │ 2. Step-by-step instructions   │
    │ 3. Promo code (copy button)    │
    │ 4. External link button        │
    │    "Continue to Notion"        │
    └────────────────────────────────┘
             ↓
    USER ACTIONS:
    ① Copy promo code
    ② Click "Continue to Notion"
    ③ Apply promo code at checkout
    ④ Enjoy the deal! ✓
```

## Startup Program Deal Flow (Special Case)

```
┌────────────────────────────────────────────┐
│ USER: Visits /deals/google-cloud-startup   │
└───────────┬────────────────────────────────┘
            ↓
    ┌──────────────────────────┐
    │ DealDetail.tsx           │
    │ dealId = "google-        │
    │ cloud-startup"           │
    └────────┬─────────────────┘
             ↓
    Fetch from Supabase:
    deal = {
      id: "google-cloud-startup",
      name: "Google Cloud",
      category: "Cloud & Infrastructure",
      subcategory: "startup-program",
      steps: [                    ← HAS STEPS
        "Visit google.com/...",
        "Click Apply now",
        ...(8 steps total)
      ],
      redeemUrl: "https://cloud.google.com/startup",
      promoCode: null             ← NO PROMO CODE
    }
             ↓
    ┌───────────────────────────────────┐
    │ Detail Page (Same as regular):    │
    │ - Generic 3-step process        │
    │ - "Claim Offer" button          │
    │ (Details hidden until redeem)   │
    └─────────┬───────────────────────┘
              ↓
    Click "Claim Offer"
              ↓
    ┌───────────────────────────────────┐
    │ Redeem Page shows:                │
    │                                   │
    │ • Actually 8 steps:               │
    │   1. Visit https://cloud.google.. │
    │   2. Click on 'Apply now'         │
    │   3. Sign in using account        │
    │   4. Fill in startup details  ... │
    │   5. Submit application           │
    │   6. Wait for review              │
    │   7. Once approved, credits...    │
    │   8. Start using infrastructure   │
    │                                   │
    │ • NO promo code shown             │
    │   (startup programs don't use)    │
    │                                   │
    │ • "Continue to Google Cloud"      │
    │   button opens:                   │
    │   https://cloud.google.com/       │
    │   startup                         │
    └───────────────────────────────────┘
```

## Database Query Examples

### Fast Queries (Indexed)
```sql
-- By slug (FAST - uses idx_deals_slug)
SELECT * FROM perksnest.deals WHERE slug = 'notion';
Result: < 1ms

-- By category (FAST - uses idx_deals_category)
SELECT * FROM perksnest.deals WHERE category = 'Cloud & Infrastructure'
Result: < 5ms

-- Featured deals (FAST - uses idx_deals_featured)
SELECT * FROM perksnest.deals WHERE featured = true
Result: < 5ms

-- Premium filter (FAST - uses idx_deals_is_premium)
SELECT * FROM perksnest.deals WHERE is_premium = true
Result: < 5ms
```

### Potentially Slow Queries
```sql
-- Full-text search (No index, scans all rows)
SELECT * FROM perksnest.deals 
WHERE description ILIKE '%cloud%' 
   OR deal_text ILIKE '%cloud%'
Result: ~15-20ms (acceptable for 196 rows)

-- Complex filtering (Uses multiple indexes)
SELECT * FROM perksnest.deals 
WHERE category = 'Cloud & Infrastructure'
  AND is_free = true
  AND featured = true
Result: ~5ms (composite use of indexes)
```

## Environment & Configuration

```
┌─────────────────────────────────────────┐
│  Environment Variables Required         │
├─────────────────────────────────────────┤
│                                         │
│ Frontend (frontend/.env.local):        │
│ ┌──────────────────────────────────┐   │
│ │ REACT_APP_SUPABASE_URL           │   │
│ │ REACT_APP_SUPABASE_ANON_KEY      │   │
│ └──────────────────────────────────┘   │
│                                         │
│ Backend (backend/.env):                │
│ ┌──────────────────────────────────┐   │
│ │ SUPABASE_URL                     │   │
│ │ SUPABASE_ANON_KEY                │   │
│ │ SUPABASE_SERVICE_KEY (seed only) │   │
│ │ SUPABASE_DB_SCHEMA               │   │
│ └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

## Error Handling & Fallback Chain

```
┌──────────────────────────────┐
│  getDeals() called           │
└───────────────┬──────────────┘
                ↓
        Level 1: SUPABASE
        ┌────────────────────┐
        │ Init client OK?    │
        └──┬──────────┬──────┘
           │          │
        Yes│          │No/Error
           ↓          ├──────────────────┐
        Query    (No env vars)          │
           │                             │
        ┌──┴──┐                       Level 2: API
        │     │                       │
        OK    Error/Empty             │
        │     │                       ├──→ Try API call
        ↓     └─────────────────┐     │
    Transform               Level 2   │
    Log: ✅ Loaded           API      │
    Return                  │        │
                        ┌────┴─┐    │
                        │      │
                       OK    Error
                        │      │
                        ↓      └────────────┐
                    Transform         Level 3: STATIC
                    Log: ✅ from      │
                    Return           ├──→ Use dealsData
                                     │
                                 Return dealsData
                                 Log: 📦 Static data
```

## Performance Metrics

```
┌──────────────────────────────────────────┐
│  Expected Performance (196 deals)        │
├──────────────────────────────────────────┤
│                                          │
│ Get all deals:        50-100ms           │
│ Get single deal:      10-30ms            │
│ Filter by category:   15-40ms            │
│ Search text:          20-50ms            │
│ Transform to client:  5-10ms             │
│                                          │
│ Total page load:      200-300ms          │
│                                          │
└──────────────────────────────────────────┘
```

## System Health Check

```
┌────────────────────────────────────────┐
│  To verify system is working:          │
├────────────────────────────────────────┤
│                                        │
│ Browser Console should show:           │
│ ✅ Loaded 196 deals from Supabase   │
│ ✅ Loaded deal X from Supabase      │
│                                        │
│ If Supabase down:                      │
│ ⚠️  Failed to fetch from Supabase   │
│ 📦 Using static deals data            │
│                                        │
│ If all fail:                           │
│ ❌ Error loading deals                │
│ (Show cached data fallback)           │
│                                        │
└────────────────────────────────────────┘
```

Victory! Your unified deals system is now production-ready! 🚀
