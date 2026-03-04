# PerksNest — Project Documentation

## Overview

PerksNest is a SaaS deals marketplace platform connecting startups with exclusive software discounts. The platform features a full-stack application with admin, partner, and customer portals, real-time deal management, authentication, reviews, and white-label capabilities.

**Live URL:** https://perksnest.co
**API Backend:** https://api.perksnest.co

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.3.1 | Frontend framework |
| TypeScript | 5.8.3 | Type-safe development |
| Vite | 5.4.19 | Build tool & dev server |
| React Router | 6.30.1 | Client-side routing |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| Radix UI | Various | Accessible component primitives |
| Lucide React | 0.462.0 | Icon library |
| Recharts | 2.15.4 | Data visualization |
| Sonner | 1.7.4 | Toast notifications |
| date-fns | 3.6.0 | Date utilities |

## Folder Structure

```
/tmp/perksnest/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components (Button, Input, Dialog, etc.)
│   │   ├── admin/           # Admin portal components (Dashboard, Analytics, etc.)
│   │   ├── partner/         # Partner portal components (Analytics, DealsList)
│   │   ├── customer/        # Customer portal components (SavedDeals, Settings)
│   │   ├── Header.tsx       # Main navigation header
│   │   ├── Footer.tsx       # Site footer
│   │   ├── DealCard.tsx     # Deal card component with reviews & featured badge
│   │   └── DealReviews.tsx  # Deal reviews & ratings component
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Homepage with weekly digest subscribe
│   │   ├── Deals.tsx        # Deals marketplace with featured section
│   │   ├── DealDetail.tsx   # Individual deal page with reviews
│   │   ├── Pricing.tsx      # Pricing page with "Your Plan" badge
│   │   ├── WhiteLabel.tsx   # White-label sales page with demo booking
│   │   ├── Docs.tsx         # Developer documentation
│   │   ├── PartnerProfile.tsx # Public partner profile pages
│   │   ├── portal/          # Portal pages
│   │   │   ├── AdminPortal.tsx
│   │   │   ├── PartnerPortal.tsx
│   │   │   └── CustomerPortal.tsx
│   │   └── ...              # Other pages
│   ├── lib/                 # Utility libraries
│   │   ├── auth.ts          # Authentication context & helpers
│   │   ├── store.ts         # LocalStorage data management
│   │   ├── reviews.ts       # Deal reviews system
│   │   └── utils.ts         # Utility functions
│   ├── data/                # Static data
│   │   └── deals.ts         # Deals data with featured flag
│   ├── assets/              # Static assets (logos, images)
│   └── App.tsx              # Root component with routing
├── public/                  # Public assets
├── dist/                    # Production build output
├── package.json             # Dependencies & scripts
└── vite.config.ts          # Vite configuration
```

## Pages & Routes

| Path | Component | Description | Auth Required |
|------|-----------|-------------|---------------|
| `/` | Index.tsx | Homepage with hero, deals carousel, pricing | No |
| `/deals` | Deals.tsx | Deals marketplace with search, filters, featured section | No |
| `/deals/:dealId` | DealDetail.tsx | Individual deal page with reviews | No |
| `/deals/:dealId/redeem` | DealRedeem.tsx | Redeem deal page | Yes |
| `/pricing` | Pricing.tsx | Pricing tiers with "Your Plan" badge | No |
| `/white-label` | WhiteLabel.tsx | White-label sales page with demo booking | No |
| `/docs` | Docs.tsx | Developer API documentation | No |
| `/brand/:slug` | PartnerProfile.tsx | Public partner profile with deals | No |
| `/login` | Login.tsx | Login page with auth modal | No |
| `/admin` | AdminPortal.tsx | Admin dashboard with white-label tab | Yes (Admin) |
| `/partner` | PartnerPortal.tsx | Partner analytics & deal management | Yes (Partner) |
| `/customer` | CustomerPortal.tsx | Customer portal with saved deals | Yes (Customer) |
| `/blog` | Blog.tsx | Blog posts | No |
| `/communities` | Communities.tsx | Communities & accelerators | No |
| `/invite` | Invite.tsx | Referral program | No |

## Components Reference

### Core Components
- **Header.tsx**: Main navigation with auth state, "For Communities" link
- **Footer.tsx**: Site footer with White Label and API Docs links
- **DealCard.tsx**: Deal display card with rating stars, featured badge, company profile link
- **DealReviews.tsx**: Reviews system with star ratings, helpful votes, write review form
- **CategorySidebar.tsx**: Category filtering sidebar

### Admin Components
- **AdminDashboard.tsx**: Overview with stats, pending deals, activity feed
- **AdminAnalytics.tsx**: Platform analytics with charts
- **AdminWhiteLabel.tsx**: White-label client management with stats & table
- **AdminSidebar.tsx**: Admin navigation with White Label tab

### Partner Components
- **PartnerAnalytics.tsx**: Partner-specific analytics (NaN% bug fixed)
- **PartnerDealsList.tsx**: Partner deals management

### Customer Components
- **CustomerSavedDeals.tsx**: Bookmarked deals
- **CustomerSettings.tsx**: User settings & preferences

### UI Components (shadcn/ui)
All components in `src/components/ui/` including: Button, Input, Dialog, Select, Accordion, Card, Badge, Avatar, Dropdown, Tabs, Toast, and more.

## Data Layer — localStorage Keys

| Key | Type | What it Stores | Set By |
|-----|------|----------------|--------|
| `pn_users` | Array<User> | All registered users | auth.ts (register) |
| `pn_current_user` | string | Current user ID | auth.ts (login) |
| `pn_deals` | Array<Deal> | All deals data | deals.ts |
| `pn_claim_events` | Array<ClaimEvent> | Deal claim history | store.ts (claimDeal) |
| `pn_partner_deals` | Array<PartnerDeal> | Partner-submitted deals | store.ts (submitDeal) |
| `pn_bookmarks_{userId}` | Array<dealId> | User's saved deals | store.ts (toggleBookmark) |
| `pn_user_settings_{userId}` | UserSettings | User preferences | CustomerSettings.tsx |
| `pn_reviews` | Array<Review> | Deal reviews & ratings | reviews.ts |
| `pn_digest_subscribers` | Array<{email, subscribedAt}> | Weekly digest subscribers | Index.tsx |
| `pn_wl_clients` | Array<WhiteLabelClient> | White-label clients | AdminWhiteLabel.tsx |
| `notificationsEnabled` | boolean | Notification preference | Deals.tsx |

## API Integration — api.perksnest.co

All API endpoints use `https://api.perksnest.co/api/notify` for email notifications:

### Email Notification Types

| Type | To | Purpose | Triggered By |
|------|----|---------|--------------|
| `welcome` | User email | Welcome email on signup | auth.ts (register) |
| `deal_approved` | Partner email | Deal approval notification | AdminPendingDeals.tsx |
| `deal_rejected` | Partner email | Deal rejection notification | AdminPendingDeals.tsx |
| `deal_claimed` | User email | Deal claim confirmation | DealDetail.tsx, DealRedeem.tsx |
| `white_label_inquiry` | pranav@stirringminds.com | WL demo booking | WhiteLabel.tsx |
| `digest_subscribe` | Subscriber email | Digest subscription confirm | Index.tsx |

### Request Format
```typescript
POST /api/notify
Content-Type: application/json

{
  type: string,
  to: string,
  name?: string,
  dealName?: string,
  promoCode?: string,
  reason?: string
}
```

## Authentication

### How Auth Works
1. **Local Auth System**: Uses localStorage to persist user sessions
2. **User Roles**: `free`, `pro`, `enterprise` + portal roles (`admin`, `partner`, `customer`)
3. **Protected Routes**: Routes check auth state and redirect to `/login` if needed
4. **Auth Context**: React Context API (`useAuth` hook) provides global auth state

### Demo Accounts

| Email | Password | Role | Plan |
|-------|----------|------|------|
| admin@perksnest.co | admin123 | admin | enterprise |
| partner@perksnest.co | partner123 | partner | pro |
| user@perksnest.co | user123 | customer | free |

### User Object Structure
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  role: 'customer' | 'partner' | 'admin';
  createdAt: string;
  claimedDeals: string[];
}
```

## New Features (v3.1)

### Feature A: NaN% Bug Fixes
Fixed percentage calculations in `PartnerAnalytics.tsx` to prevent division by zero, now displays "—" when previous value is 0.

### Feature B: Deal Reviews System
- **reviews.ts**: Review management with localStorage persistence
- **DealReviews.tsx**: Star ratings, review submission, helpful votes
- Seed data for Notion & Stripe deals
- Only users who claimed deals can review
- Name masking (J*** D***)

### Feature C: Partner Public Profile Pages
- **PartnerProfile.tsx**: Public company profile at `/brand/:slug`
- Stats: deals available, total claims, avg savings
- Company deal listing
- CTA to join as partner
- Auto-slugified company names

### Feature D: Featured Deals
- `featured` boolean added to Deal interface
- Featured badge on DealCard (⭐ Featured)
- Featured section on Deals page (purple gradient background)
- 5 featured deals: Notion, Stripe, Google Cloud, HubSpot, AWS Activate

### Feature E: Pricing Page "Your Plan" Badge
- Green badge showing "✓ Your current plan"
- Maps user plan to pricing tier (free→Free, pro→Pro, enterprise→Enterprise)

### Feature F: White Label Sales Page
- **WhiteLabel.tsx**: Full sales page at `/white-label`
- Hero, stats, features, pricing, FAQ
- Book a Demo dialog with form
- API integration for inquiries
- Added to Header & Footer navigation

### Feature G: Weekly Digest Subscribe
- Inline form on homepage
- localStorage tracking of subscribers
- Email validation & duplicate check
- Success/already subscribed states
- API notification on subscribe

### Feature H: Admin White Label Tab
- **AdminWhiteLabel.tsx**: White-label client management
- 4 stat cards (clients, revenue, members)
- Client table with plan badges & actions
- Add client dialog form
- localStorage integration

### Feature I: Developer Documentation Page
- **Docs.tsx**: Full API documentation at `/docs`
- Two-column layout with sticky sidebar
- IntersectionObserver for active section tracking
- 7 sections: Overview, Auth, Deals API, Partner API, White Label, Webhooks, Rate Limits
- Code blocks with copy button
- Added to Footer resources

## Deployment

### Production Build
```bash
cd /tmp/perksnest
npm run build
```

Build outputs to `/tmp/perksnest/dist/`

### Deploy to Production
```bash
rsync -az --delete -e "ssh -o ConnectTimeout=30 -i /Users/aibot/.openclaw/workspace/.ssh/kvm8_key" \
  /tmp/perksnest/dist/ pranav@72.60.219.115:/var/www/perksnest.co/

ssh -o ConnectTimeout=15 -i /Users/aibot/.openclaw/workspace/.ssh/kvm8_key \
  pranav@72.60.219.115 \
  "echo 'Amelie2026KVM8!' | sudo -S nginx -s reload 2>/dev/null && echo DEPLOYED"
```

Server: VPS at 72.60.219.115
Web root: `/var/www/perksnest.co/`
Web server: Nginx

## Local Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone repository
cd /tmp/perksnest

# Install dependencies
npm install

# Start development server
npm run dev
```

Dev server runs at `http://localhost:5173`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Design System

**Primary Color**: Purple (#7c3aed / purple-600)
**Font**: Inter (UI), Larsseit (headings)
**Components**: shadcn/ui (Radix UI primitives)
**Icons**: Lucide React

## File Count
Total TypeScript files: 128

## Version
PerksNest v3.1 — Full-featured SaaS deals marketplace with reviews, featured deals, partner profiles, white-label, and API documentation.

---

**Last Updated**: March 4, 2026
**Maintained By**: PerksNest Team
