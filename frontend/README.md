# PerksNest 🎁

> The #1 platform for exclusive SaaS deals — helping startups save big on the tools they love.

**Live site:** [perksnest.co](https://perksnest.co)

---

## What is PerksNest?

PerksNest is a SaaS deals marketplace inspired by JoinSecret.com. It aggregates exclusive software discounts from 500+ SaaS companies and distributes them to startups, agencies, and entrepreneurs.

### Three pillars:
- **Startups** — claim exclusive deals and save thousands on SaaS tools
- **SaaS Partners** — list deals, reach new customers, track ROI
- **Communities / VCs** — white-label the platform for your members

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | Frontend framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Recharts | Analytics charts |
| Lucide React | Icons |
| React Router v6 | Routing |
| Sonner | Toast notifications |
| Zod + React Hook Form | Form validation |

---

## Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Homepage | Public |
| `/deals` | Deals marketplace | Public |
| `/deals/:id` | Deal detail | Public |
| `/deals/:id/redeem` | Deal redeem | Public |
| `/pricing` | Pricing plans | Public |
| `/blog` | Blog | Public |
| `/invite` | Invite page | Public |
| `/compare/:slug` | Tool comparison | Public |
| `/white-label` | White label sales page | Public |
| `/docs` | Developer API docs | Public |
| `/brand/:brandId` | Partner public profile | Public |
| `/login` | Login / Register | Public |
| `/customer` | Customer portal | Auth |
| `/partner` | Partner portal | Auth (partner) |
| `/admin` | Admin portal | Auth (admin) |

---

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer (Pro) | `demo@perksnest.com` | `demo123` |
| Partner | `partner@perksnest.com` | `partner123` |
| Admin | `admin@perksnest.com` | `admin123` |

---

## Features

### Public Marketplace
- 20+ curated SaaS deals with Free/Premium gating
- Real-time search (by name, company, category, description)
- Category sidebar filters
- Featured deals section (Notion, Stripe, HubSpot, GCP, AWS)
- Deal detail pages with promo codes
- Partner public profile pages (`/brand/:id`)
- Deal reviews & star ratings
- Tool comparison pages

### Customer Portal
- Browse & claim deals
- View claimed deal history with promo codes
- Bookmark favourite deals
- Account management

### Partner Portal
- Deal submission form with admin approval workflow
- Analytics dashboard (views, claims, revenue, conversion funnel)
- Partner messaging with admin team
- Commission tracking
- Email notifications on deal approval/rejection

### Admin Portal
- Full user management
- Deal management with edit modal
- Partner management & pending approvals
- Revenue analytics with charts
- White Label client management tab

### Email System
- Transactional emails via [Resend](https://resend.com)
- API server at `https://api.perksnest.co`
- 4 email types: welcome, deal approved, deal rejected, deal claimed
- Domain: `notifications@perksnest.co`

### White Label
- Sales page at `/white-label`
- Book a Demo modal with inquiry form
- SSO/JWT architecture documented at `/docs`

---

## Local Development

```bash
# Clone
git clone https://github.com/pranavbhatia123/perksnest-v2.git
cd perksnest-v2

# Install
npm install

# Run dev server
npm run dev

# Build
npm run build
```

---

## Deployment

Static site deployed to KVM8 via rsync + nginx.

```bash
npm run build
rsync -az --delete dist/ pranav@72.60.219.115:/var/www/perksnest.co/
```

---

## Data Layer

All data is stored in `localStorage` (prefixed `pn_`):

| Key | What it stores |
|-----|---------------|
| `pn_reviews` | Deal reviews & star ratings |
| `pn_partner_deals` | Partner deal submissions |
| `pn_bookmarks` | User bookmarked deals |
| `pn_notifications` | Partner notifications |
| `pn_claim_events` | Deal claim history |
| `pn_messages` | Partner chat messages |
| `pn_wl_clients` | White label clients |
| `pn_deal_views` | Deal view tracking |
| `pn_deals_override` | Admin deal overrides |
| `pn_digest_subscribers` | Email digest subscribers |

---

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin portal components
│   ├── partner/        # Partner portal components
│   ├── ui/             # shadcn/ui components
│   ├── DealCard.tsx
│   ├── DealCardNew.tsx
│   ├── DealReviews.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── MegaMenuHeader.tsx
│   └── ...
├── data/
│   ├── deals.ts        # All 20 deals
│   ├── comparisons.ts  # Tool comparison data
│   └── utils.ts
├── lib/
│   ├── auth.tsx        # Auth context & hooks
│   ├── store.ts        # localStorage helpers + sendEmail
│   └── reviews.ts      # Review system helpers
├── pages/
│   ├── portal/         # Admin, Partner, Customer portals
│   ├── Index.tsx       # Homepage
│   ├── Deals.tsx       # Marketplace
│   ├── DealDetail.tsx  # Deal page
│   ├── WhiteLabel.tsx  # White label sales
│   ├── Docs.tsx        # Developer docs
│   ├── BrandProfile.tsx # Partner public page
│   └── ...
└── App.tsx             # Router
```

---

## Email API (api.perksnest.co)

```
POST /api/notify
{
  "type": "welcome" | "deal_approved" | "deal_rejected" | "deal_claimed",
  "to": "user@example.com",
  "name": "User Name",
  "dealName": "Notion",          // for deal emails
  "promoCode": "PERKSNEST50"    // for deal_claimed
}
```

---

Built with ❤️ for startups worldwide.
