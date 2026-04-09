# PerksNest — Project Documentation

## Overview

PerksNest is a SaaS deals marketplace platform connecting startups with exclusive software discounts. The platform features a full-stack application with admin, partner, and customer portals, real-time deal management, authentication, reviews, and white-label capabilities.

**Live URL:** https://perksnest.co
**API Backend:** https://api.perksnest.co
**Dev Server:** http://localhost:8080

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
c:\Prabal\Projects\perksnest-v2\
├── src/
│   ├── components/                    # Reusable UI components (107 total)
│   │   ├── ui/                       # shadcn/ui components (Button, Input, Dialog, etc.)
│   │   ├── admin/                    # Admin portal components (Dashboard, Users, Deals, etc.)
│   │   ├── Header.tsx                # Main navigation header with search
│   │   ├── MainNavbar.tsx            # Alternative navbar component
│   │   ├── MegaMenuHeader.tsx        # Mega menu for categories
│   │   ├── Footer.tsx                # Site footer
│   │   ├── DealCard.tsx              # Deal card with reviews & featured badge
│   │   ├── DealCardNew.tsx           # Enhanced deal card with descriptions
│   │   ├── DealReviews.tsx           # Reviews system with ratings
│   │   ├── SafeImage.tsx             # Image component with fallback
│   │   ├── SkeletonLoader.tsx        # Loading skeleton states
│   │   ├── FeaturedDeals.tsx         # Featured deals section
│   │   └── ...                       # Other components
│   ├── pages/                        # Page components (34 pages)
│   │   ├── HomeStripe.tsx            # Homepage with hero banner
│   │   ├── Deals.tsx                 # Deals marketplace with filters
│   │   ├── DealDetail.tsx            # Individual deal page with claim button
│   │   ├── DealRedeem.tsx            # Redeem deal page
│   │   ├── Pricing.tsx               # Pricing page
│   │   ├── Blog.tsx                  # Blog posts listing & detail
│   │   ├── Categories.tsx            # Category listing
│   │   ├── Collections.tsx           # Deals collections
│   │   ├── Leaderboard.tsx           # Leaderboard page
│   │   ├── Communities.tsx           # Communities & accelerators
│   │   ├── Compare.tsx               # Deal comparison page
│   │   ├── Contact.tsx               # Contact form page
│   │   ├── WhiteLabel.tsx            # White-label sales page
│   │   ├── Docs.tsx                  # Developer API documentation
│   │   ├── HelpCenter.tsx            # Help & support center
│   │   ├── BrandProfile.tsx          # Partner brand profiles
│   │   ├── PartnerProfile.tsx        # Partner public profile
│   │   ├── Newsletter.tsx            # Newsletter signup
│   │   ├── Invite.tsx                # Referral program
│   │   ├── Login.tsx                 # Authentication page
│   │   ├── ForgotPassword.tsx        # Password recovery
│   │   ├── AuthCallback.tsx          # OAuth callback page
│   │   ├── Leaderboard.tsx           # User leaderboard
│   │   ├── TermsOfService.tsx        # Terms page
│   │   ├── PrivacyPolicy.tsx         # Privacy policy
│   │   ├── NotFound.tsx              # 404 page
│   │   ├── ComingSoon.tsx            # Placeholder page
│   │   ├── portal/                   # Portal pages
│   │   │   ├── AdminPortal.tsx       # Admin dashboard
│   │   │   ├── PartnerPortal.tsx     # Partner portal
│   │   │   └── CustomerPortal.tsx    # Customer portal
│   │   └── customer/                 # Customer pages
│   │       ├── Tickets.tsx           # Support tickets
│   │       └── TicketDetail.tsx      # Ticket detail page
│   ├── lib/                          # Utility libraries
│   │   ├── auth.tsx                  # Authentication context & hooks
│   │   ├── api.ts                    # API client with retry & timeout
│   │   ├── deals.ts                  # Deal management & fetching
│   │   ├── store.ts                  # LocalStorage management
│   │   ├── reviews.ts                # Deal reviews & ratings
│   │   ├── supabase.ts               # Supabase initialization
│   │   └── utils.ts                  # Utility functions
│   ├── data/                         # Static data
│   │   ├── deals.ts                  # Mock deals data (100+ deals)
│   │   ├── comparisons.ts            # Comparison data
│   │   └── blog.ts                   # Blog posts data
│   ├── assets/                       # Static assets
│   │   ├── logos/                    # Company logos
│   │   └── illustrations/            # SVG illustrations
│   ├── index.css                     # Global styles & Tailwind
│   ├── main.tsx                      # React entry point
│   └── App.tsx                       # Root component with routing
├── public/                           # Public static assets
├── dist/                             # Production build output
├── API_TESTING_GUIDE.md              # API testing instructions
├── BUILD_VERIFICATION_REPORT.md      # Build audit report
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
├── tailwind.config.ts                # Tailwind CSS config
└── README.md                         # Project README
```

## Pages & Routes

| Path | Component | Description | Auth Required |
|------|-----------|-------------|---------------|
| `/` | HomeStripe.tsx | Homepage with hero banner, featured deals, testimonials | No |
| `/deals` | Deals.tsx | Deals marketplace with search, filters, sorting, featured section | No |
| `/deals/:dealId` | DealDetail.tsx | Individual deal page with reviews, claim button, tabs | No |
| `/deals/:dealId/redeem` | DealRedeem.tsx | Redeem deal with promo code | Yes |
| `/pricing` | Pricing.tsx | Pricing tiers with plan badge | No |
| `/contact` | Contact.tsx | Contact form page | No |
| `/blog` | Blog.tsx | Blog posts listing & detail pages | No |
| `/blog/:postId` | Blog.tsx | Individual blog post | No |
| `/invite` | Invite.tsx | Referral program page | No |
| `/newsletter` | Newsletter.tsx | Newsletter subscription | No |
| `/collections` | Collections.tsx | Deals collections listing | No |
| `/collections/:id` | CollectionDetail.tsx | Collection detail with deals | No |
| `/categories` | Categories.tsx | All categories | No |
| `/category/:slug` | Category.tsx | Category deals listing | No |
| `/leaderboard` | Leaderboard.tsx | User rankings | No |
| `/compare/:slug` | Compare.tsx | Deal comparison page | No |
| `/login` | Login.tsx | Login/authentication page | No |
| `/signup` | Login.tsx | Signup (same component) | No |
| `/communities` | Communities.tsx | Communities & accelerators | No |
| `/accelerators` | Communities.tsx | Accelerators (alias) | No |
| `/white-label` | WhiteLabel.tsx | White-label sales page with demo booking | No |
| `/docs` | Docs.tsx | Developer API documentation | No |
| `/help` | HelpCenter.tsx | Help & support center | No |
| `/brand/:brandId` | BrandProfile.tsx | Public partner brand profile | No |
| `/admin` | AdminPortal.tsx | Admin dashboard with stats, users, deals, white-label | Yes (Admin) |
| `/customer` | CustomerPortal.tsx | Customer portal with profile | Yes (Customer) |
| `/customer/tickets` | Tickets.tsx | Support tickets listing | Yes |
| `/customer/tickets/:ticketId` | TicketDetail.tsx | Ticket detail page | Yes |
| `/partner` | ComingSoon.tsx | Partner portal (coming soon) | Coming Soon |
| `/solutions` | ComingSoon.tsx | Solutions page (coming soon) | Coming Soon |
| `/developers` | ComingSoon.tsx | Developers page (coming soon) | Coming Soon |
| `/resources` | ComingSoon.tsx | Resources page (coming soon) | Coming Soon |
| `/about` | ComingSoon.tsx | About page (coming soon) | Coming Soon |
| `/press` | ComingSoon.tsx | Press page (coming soon) | Coming Soon |
| `/careers` | ComingSoon.tsx | Careers page (coming soon) | Coming Soon |
| `/terms` | TermsOfService.tsx | Terms of service | No |
| `/privacy` | PrivacyPolicy.tsx | Privacy policy | No |
| `/auth/callback` | AuthCallback.tsx | OAuth callback handler | No |

## Components Reference

### Core Navigation & Layout
- **MainNavbar.tsx**: Main navigation bar with logo, category menu, search, auth
- **MegaMenuHeader.tsx**: Mega menu for category navigation and search
- **Header.tsx**: Alternative header component with menu
- **MainFooter.tsx**: Site footer with links and branding
- **ScrollToTop.tsx**: Scroll-to-top functionality component

### Deal Display Components
- **DealCard.tsx**: Classic deal card with rating, featured badge, expiry
- **DealCardNew.tsx**: Enhanced deal card with description, member count, filters
- **DealReviews.tsx**: Reviews system with ratings, reviews list, write review form
- **FeaturedDeals.tsx**: Featured deals carousel with descriptions
- **DealCarousel.tsx**: Horizontal deals carousel slider
- **DealsGrid.tsx**: Grid layout for deals with filtering

### Utility Components
- **SafeImage.tsx**: Image component with fallback for broken images
- **SkeletonLoader.tsx**: Loading skeleton states for cards and pages
- **ExpiryBadge.tsx**: Deal expiration status badge
- **UpvoteButton.tsx**: Upvote functionality for deals
- **AuthModal.tsx**: Authentication modal dialog
- **OAuthHandler.tsx**: OAuth event handler

### Admin Components
- **AdminPortal.tsx**: Admin dashboard main page
- **AdminDashboard.tsx**: Dashboard with stats cards
- **AdminAnalytics.tsx**: Analytics charts and graphs
- **AdminWhiteLabel.tsx**: White-label client management
- **AdminUsers.tsx**: User management and editing
- **AdminDeals.tsx**: Deal CRUD operations
- **AdminPartners.tsx**: Partner management
- **AdminPendingDeals.tsx**: Pending deal approval queue
- **AdminTickets.tsx**: Support ticket management
- **AdminRevenue.tsx**: Revenue analytics
- **AdminSettings.tsx**: Platform settings
- **AdminSidebar.tsx**: Admin navigation menu
- **AdminRoleManager.tsx**: User role assignment

### Section Components
- **HeroBanner.tsx**: Homepage hero section
- **HowItWorks.tsx**: How PerksNest works section
- **PricingSection.tsx**: Pricing plans display
- **CTASection.tsx**: Call-to-action section
- **FeatureCategoriesSection.tsx**: Feature categories showcase
- **CategoryDealsSection.tsx**: Category-based deals display
- **TrustedBySection.tsx**: Marquee of trusted companies

### Partner Components
- **PartnerAnalytics.tsx**: Partner-specific analytics (NaN% bug fixed)
- **PartnerDealsList.tsx**: Partner deals management

### Customer Components
- **CustomerSavedDeals.tsx**: Bookmarked deals
- **CustomerSettings.tsx**: User settings & preferences

### UI Components (shadcn/ui)
All components in `src/components/ui/` including: Button, Input, Dialog, Select, Accordion, Card, Badge, Avatar, Dropdown, Tabs, Toast, and more.

## Data Layer — localStorage & Supabase

### localStorage Keys

| Key | Type | What it Stores | Set By |
|-----|------|----------------|--------|
| `pn_session` | Object | User session token & ID | auth.tsx (login) |
| `pn_current_user` | string | Current user ID | auth.tsx (login) |
| `pn_claimed_deals` | Array<dealId> | User claimed deals (fallback) | api.ts (claimDeal fallback) |
| `pn_bookmarks_{userId}` | Array<dealId> | User's saved/bookmarked deals | store.ts (toggleBookmark) |
| `pn_reviews` | Array<Review> | Deal reviews & ratings | reviews.ts |
| `pn_digest_subscribers` | Set<email> | Weekly digest subscribers | HomeStripe.tsx |
| `notificationsEnabled` | boolean | Notification preference | Deals.tsx |

### Supabase Integration

- **Database**: Perksnest schema in Supabase
- **Authentication**: Supabase Auth for user management
- **Tables**: Users, deals, reviews, claims, white_label_clients
- **Config**: `src/lib/supabase.ts`

## API Integration — api.perksnest.co

### API Client Features (`src/lib/api.ts`)

**Enhanced with:**
- ✅ **5-second timeout** per request (AbortController)
- ✅ **Automatic retry logic** with exponential backoff (2 retries)
- ✅ **Fallback to localStorage** for critical operations (claimDeal)
- ✅ **Enhanced error logging** with specific error types
- ✅ **Bearer token authentication** from localStorage (`pn_session`)

### API Endpoints

| Method | Endpoint | Purpose | Retry | Fallback |
|--------|----------|---------|-------|----------|
| POST | `/api/deals/claim` | Claim a deal | 2x | localStorage |
| GET | `/api/deals` | Get all deals | 2x | Static deals data |
| GET | `/api/deals/:id` | Get single deal | 2x | Static deals data |
| GET | `/api/deals/:id/claims` | Get claim count | 2x | 0 |
| GET | `/api/user/claims` | Get user's claimed deals | 2x | localStorage |
| GET | `/api/referrals/me` | Get referral stats | 2x | {} |
| POST | `/api/referrals/click` | Track referral click | 2x | Logged |
| POST | `/api/referrals/convert` | Convert referral | 2x | Logged |
| GET | `/api/tickets` | Get support tickets | 2x | [] |
| POST | `/api/tickets` | Create support ticket | 2x | Error logged |
| GET | `/api/admin/stats` | Get admin statistics | 2x | {} |
| GET | `/api/admin/users` | Get admin users list | 2x | [] |

### Error Handling

API client handles these error types:
- **Timeout**: Network error after 5 seconds
- **401 Unauthorized**: Session expired, user needs to re-login
- **403 Forbidden**: User not eligible (e.g., premium deal without pro tier)
- **Network Errors**: Automatically retried 2x with backoff
- **API Errors**: Status code 4xx/5xx with descriptive messages

### Authentication

All endpoints require Bearer token:
```typescript
Authorization: Bearer {access_token}
```

Token stored in `localStorage.getItem('pn_session')`

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
cd c:\Prabal\Projects\perksnest-v2
npm run build
```

Build outputs to `dist/` directory with optimized bundles.

### Build Output
- `dist/index.html` - Main HTML file
- `dist/assets/index-*.css` - Compiled Tailwind + component styles
- `dist/assets/index-*.js` - Bundled React + dependencies
- `dist/assets/*.{svg,png,ico}` - Optimized images and logos

## Local Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
# Navigate to project directory
cd c:\Prabal\Projects\perksnest-v2

# Install dependencies
npm install

# Start development server
npm run dev
```

Dev server runs at `http://localhost:8080`

### Available Scripts
- `npm run dev` - Start development server (Vite)
- `npm run build` - Production build (Vite)
- `npm run build:dev` - Development build mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (Vitest)
- `npm run test:watch` - Watch mode tests (Vitest)

## Design System

**Primary Color**: Purple (#7c3aed / purple-600)
**Font**: Inter (UI), Larsseit (headings)
**Components**: shadcn/ui (Radix UI primitives)
**Icons**: Lucide React

## File Count
Total TypeScript files: 128

## Latest Updates (v3.2)

### Recent Features Added
- ✅ **API Timeout & Retry Logic**: 5-second timeout with 2 automatic retries
- ✅ **Offline Fallback**: Claims saved to localStorage when API fails
- ✅ **Enhanced Claim UI**: Loading state, better error messages
- ✅ **Skeleton Loaders**: Improved perceived performance
- ✅ **Filtering & Sorting**: Multiple sort options with icons
- ✅ **Rich Product Content**: Descriptions, features, use cases
- ✅ **Featured Deals**: Highlighted deals with special badges
- ✅ **Responsive Design**: Mobile-optimized all pages
- ✅ **Error Handling**: Comprehensive error messages for all user actions

### Build Status
- **TypeScript**: 0 errors
- **Production Build**: 15.59 seconds
- **Bundle Size**: 1,325 KB (gzipped: 354 KB)
- **Modules**: 1,873 transformed

### Documentation Files
- `DOCUMENTATION.md` - This file (project overview)
- `API_TESTING_GUIDE.md` - Step-by-step API testing instructions
- `BUILD_VERIFICATION_REPORT.md` - Complete build audit report
- `README.md` - Quick start guide

---

**Version**: 3.2  
**Project Name**: PerksNest — Full-featured SaaS deals marketplace  
**Last Updated**: April 7, 2026  
**Status**: Production Ready ✅
