# Supabase Migration Audit

This file is a practical checklist for moving PerksNest to a new Supabase project and replacing the dead `api.perksnest.co` setup.

## Current Architecture

- Backend API: local/dev or deployed Node server in [server.js](C:\Prabal\Projects\perksnest-new\backend\server.js)
- Database schema used by backend: `perksnest`
- Auth provider: Supabase Auth
- Frontend still talks directly to Supabase in multiple places through [supabase.ts](C:\Prabal\Projects\perksnest-new\frontend\src\lib\supabase.ts), [store.ts](C:\Prabal\Projects\perksnest-new\frontend\src\lib\store.ts), [reviews.ts](C:\Prabal\Projects\perksnest-new\frontend\src\lib\reviews.ts), [AdminRoleManager.tsx](C:\Prabal\Projects\perksnest-new\frontend\src\components\admin\AdminRoleManager.tsx), and [ForgotPassword.tsx](C:\Prabal\Projects\perksnest-new\frontend\src\pages\ForgotPassword.tsx)

## Environment Changes Required

### Backend `.env`

Set these in [backend/.env](C:\Prabal\Projects\perksnest-new\backend\.env):

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
APP_JWT_SECRET=generate-a-new-random-secret
PORT=3000
CORS_ORIGIN=http://localhost:8080,http://localhost:5173,https://your-frontend-domain
```

Optional:

```env
APP_SESSION_TTL=7d
PASSWORD_RESET_REDIRECT_URL=http://localhost:8080/login
APP_URL=http://localhost:8080
```

### Frontend `.env`

Set these in [frontend/.env](C:\Prabal\Projects\perksnest-new\frontend\.env):

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

Remove this from the frontend:

```env
VITE_SUPABASE_SERVICE_KEY
```

It should never be shipped to the browser.

## Supabase Auth Setup

Enable in your new Supabase project:

- Email/password auth
- Google OAuth if you still want Google login

Add redirect URLs:

- Local:
  - `http://localhost:8080/auth/callback`
  - `http://localhost:5173/auth/callback`
- Production:
  - your final frontend domain callback URL

The backend auth logic now expects Supabase Auth users plus a matching profile row in `perksnest.users`.

## Schema Summary

The code expects the `perksnest` schema. Create it first:

```sql
create schema if not exists perksnest;
```

Then ensure all app tables below exist in that schema.

## Core Tables

### `users`

This is the most important app table. It stores the dashboard/profile data and business roles.

Used by:
- backend auth and admin routes
- frontend direct admin/referral/password-reset paths

Columns referenced by code:

- `id`
- `email`
- `name`
- `password`
- `plan`
- `role`
- `roles`
- `referral_code`
- `referral_count`
- `claimed_deals`
- `status`
- `avatar`
- `created_at`
- `updated_at`
- `referred_by`
- `verification_code`
- `verification_expires`
- `email_verified`
- `approved_by`
- `approved_at`
- `notes`

Recommended shape:

```sql
create table if not exists perksnest.users (
  id uuid primary key,
  email text not null unique,
  name text,
  password text,
  plan text not null default 'free',
  role text not null default 'customer',
  roles text[] not null default array['customer']::text[],
  referral_code text unique,
  referral_count integer not null default 0,
  claimed_deals text[] not null default array[]::text[],
  status text not null default 'active',
  avatar text,
  referred_by uuid,
  verification_code text,
  verification_expires timestamptz,
  email_verified boolean not null default false,
  approved_by text,
  approved_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Notes:

- `id` should ideally match `auth.users.id`
- `password` is now legacy only; keep it temporarily for old-user migration if needed
- `plan` currently behaves like `free`, `premium`, `enterprise`
- `role` is primary role, `roles` is multi-role array

Indexes worth adding:

```sql
create index if not exists idx_users_created_at on perksnest.users (created_at desc);
create index if not exists idx_users_role on perksnest.users (role);
create index if not exists idx_users_status on perksnest.users (status);
create unique index if not exists idx_users_referral_code on perksnest.users (referral_code);
```

### `deals`

Used by public deal listing and admin CRUD.

Columns are not strongly typed in code because the backend mostly passes through `*`, but must at least support:

- `id`
- `created_at`

You should inspect your existing data shape and preserve all fields currently used by the UI.

### `partner_deals`

Used by backend and frontend direct Supabase access.

Columns referenced:

- `id`
- `partner_id`
- `partner_name`
- `name`
- `description`
- `deal_text`
- `savings`
- `category`
- `website_url`
- `logo_url`
- `promo_code`
- `status`
- `rejection_reason`
- `created_at`
- `approved_at`
- `views`
- `claims`

### `claim_events`

Tracks deal claims.

Columns referenced:

- `id`
- `user_id`
- `deal_id`
- `promo_code`
- `claimed_at`

Unique constraint expected by code:

```sql
create unique index if not exists idx_claim_events_user_deal
on perksnest.claim_events (user_id, deal_id);
```

### `referrals`

Tracks referred signups and conversions.

Columns referenced:

- `id`
- `code`
- `referrer_id`
- `referrer_name`
- `referree_email`
- `referree_id`
- `status`
- `credit_amount`
- `created_at`
- `converted_at`

Unique constraint expected:

```sql
create unique index if not exists idx_referrals_referree_email
on perksnest.referrals (referree_email);
```

Useful indexes:

```sql
create index if not exists idx_referrals_referrer_id on perksnest.referrals (referrer_id);
create index if not exists idx_referrals_code on perksnest.referrals (code);
```

### `referral_clicks`

Columns referenced:

- `id`
- `referral_code`
- `source`
- `clicked_at`

### `tickets`

Support ticket header table.

Columns referenced:

- `id`
- `user_id`
- `user_name`
- `user_email`
- `user_role`
- `subject`
- `status`
- `priority`
- `type`
- `description`
- `created_at`
- `updated_at`

Indexes:

```sql
create index if not exists idx_tickets_user_id on perksnest.tickets (user_id);
create index if not exists idx_tickets_updated_at on perksnest.tickets (updated_at desc);
```

### `ticket_messages`

Columns referenced:

- `id`
- `ticket_id`
- `user_id`
- `user_name`
- `message`
- `is_admin`
- `created_at`

Index:

```sql
create index if not exists idx_ticket_messages_ticket_id on perksnest.ticket_messages (ticket_id, created_at);
```

### `deal_reviews`

Backend review endpoint table.

Columns referenced:

- `id`
- `deal_id`
- `quote`
- `author`
- `role`
- `company`
- `avatar`
- `created_at`

### `reviews`

Frontend direct user review table.

Columns referenced:

- `id`
- `deal_id`
- `user_id`
- `user_name`
- `rating`
- `comment`
- `helpful`
- `created_at`

Unique constraint expected:

```sql
create unique index if not exists idx_reviews_deal_user
on perksnest.reviews (deal_id, user_id);
```

### `bookmarks`

Columns referenced:

- `id`
- `user_id`
- `deal_id`
- `created_at`

Unique constraint expected:

```sql
create unique index if not exists idx_bookmarks_user_deal
on perksnest.bookmarks (user_id, deal_id);
```

### `upvotes`

Columns referenced:

- `id`
- `deal_id`
- `user_id`

Unique constraint expected:

```sql
create unique index if not exists idx_upvotes_deal_user
on perksnest.upvotes (deal_id, user_id);
```

### `messages`

Realtime support/admin chat table used directly by frontend.

Columns referenced:

- `id`
- `thread_id`
- `sender_id`
- `sender_name`
- `sender_role`
- `content`
- `read`
- `created_at`

Indexes:

```sql
create index if not exists idx_messages_thread_id on perksnest.messages (thread_id, created_at);
```

### `notifications`

Columns referenced:

- `id`
- `user_id`
- `type`
- `title`
- `message`
- `read`
- `created_at`

### `digest_subscribers`

Columns referenced:

- `id`
- `email`
- `name`
- `frequency`
- `active`

Unique constraint expected:

```sql
create unique index if not exists idx_digest_subscribers_email
on perksnest.digest_subscribers (email);
```

### `deal_views`

Columns referenced:

- `id`
- `deal_id`
- `user_id`

### `wl_clients`

White-label admin clients table.

Columns referenced:

- `id`
- `name`
- `subdomain`
- `logo_url`
- `primary_color`
- `status`
- `plan`
- `mrr`
- `members`
- `created_at`

### `admin_settings`

Columns referenced:

- `id`
- `updated_at`
- plus arbitrary JSON-like fields from the admin settings UI

### `contact_messages`

Columns referenced:

- `id`
- `name`
- `email`
- `message`
- `created_at`

## Direct Frontend Supabase Dependencies

These areas still hit Supabase directly and must continue to work after the move:

- bookmarks
- upvotes
- partner deals
- notifications
- messages/realtime messaging
- referrals
- digest subscribers
- claim events
- deal views
- white-label list fetches
- direct user management in admin role manager
- direct `users` lookup in forgot password
- direct `reviews` table access

Files involved:

- [frontend/src/lib/store.ts](C:\Prabal\Projects\perksnest-new\frontend\src\lib\store.ts)
- [frontend/src/lib/reviews.ts](C:\Prabal\Projects\perksnest-new\frontend\src\lib\reviews.ts)
- [frontend/src/components/admin/AdminRoleManager.tsx](C:\Prabal\Projects\perksnest-new\frontend\src\components\admin\AdminRoleManager.tsx)
- [frontend/src/pages/ForgotPassword.tsx](C:\Prabal\Projects\perksnest-new\frontend\src\pages\ForgotPassword.tsx)

## RLS / Policy Guidance

Because the frontend still queries Supabase directly, your new project needs RLS and policies that match those use cases.

Minimum practical advice:

- `users`: do not expose full table broadly; admin-only writes, self-read/update if needed
- `bookmarks`, `notifications`, `messages`, `reviews`, `upvotes`: allow authenticated user access scoped to their own rows where applicable
- `deals`, `deal_reviews`: public read is probably fine
- `partner_deals`, `wl_clients`, `admin_settings`: likely admin/partner restricted

If you want a cleaner architecture, the next refactor should move these frontend direct calls behind backend APIs so policies become much simpler.

## Data Migration Checklist

Run this in order:

1. Create new Supabase project.
2. Enable Auth providers.
3. Create `perksnest` schema.
4. Recreate all required tables and indexes above.
5. Import old data into app tables.
6. Import or recreate auth users in Supabase Auth.
7. Ensure `perksnest.users.id` matches `auth.users.id` where possible.
8. Update [backend/.env](C:\Prabal\Projects\perksnest-new\backend\.env).
9. Update [frontend/.env](C:\Prabal\Projects\perksnest-new\frontend\.env).
10. Remove `VITE_SUPABASE_SERVICE_KEY` from frontend envs.
11. Start backend locally and test:
    - `/health`
    - `/api/health`
    - signup
    - login
    - Google login
    - customer dashboard
    - admin user list
    - partner deals
    - tickets
12. Deploy backend to a new host.
13. Change production frontend `VITE_API_URL` to that new backend URL.

## Biggest Risks During Migration

- `users.id` and `auth.users.id` drifting apart
- forgetting the `perksnest` schema
- missing unique indexes for `bookmarks`, `upvotes`, `claim_events`, `reviews`, `referrals`
- frontend still using direct Supabase access after env switch
- exposing service-role credentials in frontend
- missing OAuth redirect URLs in Supabase Auth settings

## Recommended Next Refactor After Migration

After the new Supabase project is stable, the next cleanup should be:

1. remove `VITE_SUPABASE_SERVICE_KEY` entirely
2. move admin role management behind backend routes
3. move forgot-password lookup behind backend only
4. gradually move `store.ts` direct table access behind backend APIs

That will make future infra moves much easier.
