# Sprint 2 — PerksNest.co

## Project Context
- **Frontend:** React + Vite + Tailwind CSS at `/tmp/perksnest-fix`
- **Backend API:** `/srv/pranav/perksnest-api/index.js` on KVM8 (72.60.219.115) — Fastify + Stripe + Resend
- **Supabase:** On Gateway server (46.225.113.69), access via `docker exec supabase-db psql -U postgres`
- **API base URL:** Used via `src/lib/api.ts` `apiCall()` helper
- **Admin components:** `src/components/admin/`
- **Portal pages:** `src/pages/portal/` (AdminPortal.tsx, CustomerPortal.tsx)
- **Existing deals:** Hardcoded in `src/data/deals.ts` (~263 deals)
- **Auth:** Supabase JWT, passed as `Authorization: Bearer <token>`

## Priority Order

### 🔴 HIGH PRIORITY

**Task 1: Ticket System Frontend (~3h)**
Create `src/pages/customer/Tickets.tsx` and `src/pages/customer/TicketDetail.tsx`
- Ticket list page with table: Subject | Status (badge) | Priority | Created
- "New Ticket" button → modal with fields: Subject, Type (billing/technical/general), Priority (low/medium/high), Description
- Ticket detail page with message thread (alternating user/admin bubbles), reply box, close button
- API endpoints: GET /api/tickets, POST /api/tickets, GET /api/tickets/:id, POST /api/tickets/:id/reply, PUT /api/tickets/:id/close
- Add routes /customer/tickets and /customer/tickets/:id
- Use apiCall() from src/lib/api.ts with JWT auth

**Task 2: Admin Portal CRUD UI (~4h)**
Edit `src/components/admin/AdminDeals.tsx` and create `src/components/admin/AdminTickets.tsx`
- AdminDeals: Table with Logo|Name|Category|Discount|Active toggle, Add/Edit/Delete deal forms
- AdminTickets: Table with status filter tabs (All|Open|Pending|Closed), click row → detail drawer with thread, reply, status change, assign

### 🟡 MEDIUM PRIORITY

**Task 3: Referral System UI (~2h)** — Edit `src/pages/Invite.tsx`
- GET /api/referrals/me on load, display referral link with copy button, stats cards, share buttons
- Handle ?ref= param on signup, call POST /api/referrals/convert

**Task 4: Deal Claim Tracking (~1h)** — Edit `src/pages/DealDetail.tsx`
- POST /api/deals/:id/claim on "Get Deal" click, show "✓ Claimed" state
- GET /api/user/claims on load to pre-mark claimed deals
- Show claim count badge "🔥 N startups claimed"

### 🟢 LOWER PRIORITY

**Task 5: Migrate Deals from deals.ts → Supabase (~3h)**
- Add GET /api/deals and GET /api/deals/:id endpoints to backend
- Migration script to INSERT all 263 deals from deals.ts into Supabase
- Replace static imports in Deals.tsx and DealDetail.tsx with API fetches

**Task 6: True Subcategory Filtering (~2h)**
- Add subcategory field to Deal type, tag each deal
- Update filter logic for exact subcategory matches

### 📱 RESPONSIVENESS FIXES
Apply mobile-first Tailwind breakpoints (sm: md: lg:) across ALL components:
1. Header: mobile drawer, collapsible search, 44px touch targets
2. Homepage hero: responsive text sizes, stacked CTA on mobile
3. Pricing cards: responsive grid (1→2→3 columns)
4. Deals page: scrollable category filters, responsive grid (1→2→3→4)
5. Deal detail: flex-col on mobile, full-width CTA button
6. Deal cards carousel: snap scroll on mobile
7. Admin portal: overflow-x-auto tables, hidden columns on mobile
8. Customer portal: bottom tab bar on mobile, hidden sidebar
9. Footer: responsive grid columns
10. Global: overflow-x-hidden wrapper, consistent section padding, min-h-[44px] buttons, no hardcoded px widths

## Build & Deploy
- `npm run build` (or `bun run build`)
- Deploy: push to main, SSH to KVM8 and pull
- Commit after each major task with descriptive message
