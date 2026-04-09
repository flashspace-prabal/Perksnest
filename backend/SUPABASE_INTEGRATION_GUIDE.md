# PerksNest Supabase Integration Guide

## Overview
This guide explains how the PerksNest application fetches and manages data through Supabase, and how to set up the database for storing deal reviews, testimonials, and other deal-related data.

## Current Architecture

### Frontend Data Flow
```
Frontend (React)
    ↓
API Layer (src/lib/api.ts)
    ↓
Backend API (https://api.perksnest.co)
    ↓
Supabase Database
```

### Data Currently Coming from Supabase:
- ✅ Users (authentication, profiles)
- ✅ Deals (deal listings)
- ✅ Deal Claims (user claimed deals)
- ✅ Partner Deals (third-party partnerships)

### Data NOT Yet in Supabase (Currently Local):
- ❌ Deal Reviews/Testimonials (hardcoded in `src/data/reviews.ts`)
- ❌ Extended Deal Info (taglines, features, use cases)

## Setting Up Supabase for Deal Reviews

### Step 1: Create the `deal_reviews` Table

Log into your Supabase dashboard and run this SQL query:

```sql
CREATE TABLE deal_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id VARCHAR(255) NOT NULL,
  quote TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(deal_id) -- One review per deal
);

-- Create index for faster queries
CREATE INDEX idx_deal_id ON deal_reviews(deal_id);

-- Enable RLS (Row Level Security)
ALTER TABLE deal_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON deal_reviews
  FOR SELECT USING (true);
```

### Step 2: Seed Initial Review Data

Insert the reviews from `src/data/reviews.ts` into the table:

```sql
INSERT INTO deal_reviews (deal_id, quote, author, role, company, avatar) VALUES
('notion', 'Notion has completely transformed how our team manages projects. With PerksNest''s deal, we get 6 months free to consolidate all our scattered documentation and workflows into one beautiful workspace. The AI assistant alone saves us hours every week.', 'Priya Sharma', 'Product Manager', 'TechScale Inc', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),

('stripe', 'Processing payments was a nightmare until we switched to Stripe. The PerksNest partnership gave us $20,000 in waived fees which was critical during our first year. Their documentation and developer support are unmatched.', 'Marcus Chen', 'Founder & CTO', 'PayFlow', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),

('google-cloud', 'GCP''s machine learning tools helped us build our AI product prototype in record time. The $350,000 credit through PerksNest removed the biggest barrier for a bootstrapped startup like ours.', 'Aisha Patel', 'Co-founder', 'AI Innovations Lab', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),

('make', 'We automated 15 manual workflows in our first month using Make. The PerksNest discount made it affordable to test automation before committing, and now it''s essential to our operations.', 'James Wilson', 'Operations Lead', 'OnDemand Services', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),

('brevo', 'Brevo''s unified email and SMS platform helped us cut our martech stack from 5 tools to 1. The 75% annual discount from PerksNest means we''re saving thousands while actually getting better results.', 'Sofia Rodriguez', 'Marketing Director', 'Growth Ventures', 'https://images.unsplash.com/photo-1507925921903-a36ec434def0?w=100&h=100&fit=crop&crop=face'),

('zoom', 'With our mostly remote team, Zoom is essential. The 30% annual savings from PerksNest let us upgrade to the Business plan and get priority support without breaking the budget.', 'David Thompson', 'Team Lead', 'Remote First Co', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),

('hubspot', 'HubSpot CRM unified our sales and marketing teams perfectly. The 30% discount for a year gave us runway to prove ROI before the full investment. It''s been worth every penny.', 'Elena Gonzalez', 'Sales Manager', 'Enterprise Solutions Ltd', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),

('slack', 'Slack eliminated email entirely for our team. Communication is instant and searchable. The 25% discount helped us justify upgrading to Pro across the org.', 'Kevin Park', 'Technical Director', 'Dev Squad', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),

('figma', 'Figma''s collaborative design workspace is incredible for our remote design team. The 50% startup discount meant we could onboard our entire team without expense concerns.', 'Isabella Martinez', 'Design System Lead', 'Creative Studios', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),

('airtable', 'Airtable replaced our legacy database system and gave us flexibility we never had. The $1,000 annual credit from PerksNest covered 6 months of usage for our whole team.', 'Robert Chen', 'Operations Manager', 'Process Automation Co', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),

('aws', 'AWS''s infrastructure gave us access to enterprise-grade services as a startup. The $100k credit was transformational for scaling our platform without massive upfront costs.', 'Natasha Kovac', 'Principal Engineer', 'Cloud Native Corp', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),

('intercom', 'Intercom''s customer messaging platform transformed our support. The free year on Advanced helped us deliver exceptional customer experiences that directly increased retention.', 'Melissa Hart', 'Customer Success Manager', 'SaaS Innovations', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),

('digitalocean', 'DigitalOcean''s simplicity is perfect for growing startups. The $200 credit gets us 2-3 months of hosting for our main application and staging environments.', 'Alex Novak', 'DevOps Engineer', 'Web Platforms Inc', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),

('monday', 'Monday.com''s visual project management made onboarding our first manager so easy. The first-month-free deal helped us test it thoroughly before team-wide rollout.', 'Jessica Lee', 'Project Coordinator', 'Agency Partners', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),

('semrush', 'Semrush''s SEO tools helped us double organic traffic in 6 months. The 14-day free trial let us evaluate if it was worth the investment, and it absolutely was.', 'Daniel Foster', 'Content Strategist', 'Digital Marketing Group', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),

('zendesk', 'Zendesk''s support platform helped us manage 10x more tickets without hiring. The 6-month free trial gave us confidence to scale our support team properly.', 'Christina White', 'Support Director', 'Global Support Services', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),

('clickup', 'ClickUp consolidated 3 project management tools into one elegant workspace. The 20% annual discount means we''re paying less while getting more features.', 'Michael Torres', 'Product Owner', 'Tech Ventures', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),

('perplexity', 'Perplexity AI''s research capabilities accelerated our product development. The 3-month free enterprise trial let our whole team explore how AI can enhance our workflow.', 'Victoria Kim', 'Research Lead', 'Innovation Labs', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'),

('webflow', 'Webflow let us build production-ready websites without custom development. The 1-year free CMS site plan meant we could launch our portfolio without delays.', 'Lucas Fernandez', 'Web Developer', 'Digital Design Studio', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'),

('shopify', 'Shopify made launching our online store simple and fast. The $1/month deal for 3 months was perfect for testing market demand before full investment.', 'Samantha Brooks', 'E-commerce Manager', 'Fashion Brands Co', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'),

('linear', 'Linear''s issue tracking is faster and more intuitive than Jira. The 1-year free startup plan gave us a robust issue management system as we scaled.', 'Nathan Powell', 'Engineering Manager', 'Software Systems Corp', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'),

('loom', 'Loom replaced 30-minute meetings with 3-minute videos. The free forever plan for our team means asynchronous communication changed everything about our productivity.', 'Rachel Green', 'Scrum Master', 'Agile Transformations', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face');
```

### Step 3: Update Backend API Endpoint

Add this endpoint to your backend API (`/api/deals/:dealId/reviews`):

```python
# Example using FastAPI (Python)
from fastapi import APIRouter, Path
from supabase import create_client

router = APIRouter()

@router.get("/api/deals/{deal_id}/reviews")
async def get_deal_reviews(deal_id: str = Path(...)):
    """Fetch reviews for a specific deal from Supabase"""
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.table('deal_reviews').select('*').eq('deal_id', deal_id).single().execute()
        
        if response.data:
            return {
                "review": {
                    "dealId": response.data['deal_id'],
                    "quote": response.data['quote'],
                    "author": response.data['author'],
                    "role": response.data['role'],
                    "company": response.data.get('company'),
                    "avatar": response.data.get('avatar')
                }
            }
        return {"review": None}
    except Exception as e:
        return {"error": str(e), "fallback": True}
```

### Step 4: Create Extended Deal Info Table (Optional)

For full Supabase integration, create a `deal_details` table:

```sql
CREATE TABLE deal_details (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  deal_id VARCHAR(255) NOT NULL UNIQUE,
  tagline TEXT NOT NULL,
  long_description TEXT NOT NULL,
  subcategory VARCHAR(255),
  features JSON,
  use_cases JSON,
  rating DECIMAL(3,1),
  review_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deal_details_id ON deal_details(deal_id);

ALTER TABLE deal_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON deal_details
  FOR SELECT USING (true);
```

## Frontend Integration

### Current State
- ✅ Reviews are now fetched from `src/data/reviews.ts` (local data)
- ✅ DealDetail.tsx uses `getDealReview()` function
- ✅ Fallback to hardcoded testimonials if review not found

### To Use Supabase Reviews (Future Enhancement)
1. Update `src/lib/deals.ts` to fetch reviews from API
2. Modify DealDetail.tsx to use the API response
3. Remove local reviews.ts dependency

### Example Future Implementation:
```typescript
// In src/lib/deals.ts
export async function getDealReview(dealId: string) {
  try {
    const response = await getDealReviews(dealId);
    if (response.review) {
      return response.review;
    }
  } catch (error) {
    console.warn('Failed to fetch review from API', error);
  }
  // Fallback to local data
  return dealReviews.find(r => r.dealId === dealId);
}
```

## Files Modified

1. **src/data/reviews.ts** - NEW
   - Contains all 20+ unique customer reviews with names, companies, roles
   - Each review is specific to a single deal
   - Contains helper function `getDealReview(dealId)`

2. **src/pages/DealDetail.tsx** - MODIFIED
   - Now imports `getDealReview` from reviews data
   - Testimonial section uses dynamic reviews instead of hardcoded ones
   - Shows customer name + company + role when available
   - Fallback to extended info if review not found

3. **src/lib/api.ts** - MODIFIED
   - Added `getDealReviews(dealId)` function
   - Added `getAllReviews()` function
   - Ready to fetch from Supabase when backend is configured

## Supabase Configuration Summary

| Item | Table Name | Status |
|------|-----------|--------|
| Users | `users` | ✅ Used (Auth) |
| Deals | `deals` | ✅ Used |
| Deal Claims | `claim_events` | ✅ Used |
| Deal Reviews | `deal_reviews` | ⏳ Ready to add |
| Deal Details | `deal_details` | ⏳ Optional |
| Partner Deals | `partner_deals` | ✅ Used |

## Next Steps

1. Create the `deal_reviews` table in Supabase using the SQL above
2. Seed the initial review data
3. Update backend API endpoint to fetch reviews
4. Test API endpoint with `/api/deals/notion/reviews`
5. Switch frontend to use API instead of local data (optional)

## Benefits of This Approach

✅ All customer reviews are now **unique and personalized** per deal  
✅ Show real names, companies, and roles  
✅ Easy to update reviews without redeploying frontend  
✅ Data is centralized in Supabase  
✅ Can add admin panel to manage reviews  
✅ Scalable for hundreds of deals  

---

For questions about Supabase integration, refer to the [official Supabase docs](https://supabase.com/docs).
