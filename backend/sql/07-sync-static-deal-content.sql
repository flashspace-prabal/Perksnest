-- Required before seeding text deal reviews and optional static feature/review JSON.
-- Run this once in Supabase SQL Editor.

begin;

alter table perksnest.reviews
alter column deal_id type text using deal_id::text;

alter table perksnest.deals
add column if not exists short_description text,
add column if not exists full_description text,
add column if not exists deal_highlight jsonb default '{}'::jsonb,
add column if not exists social_proof jsonb default '{}'::jsonb,
add column if not exists deals jsonb default '{}'::jsonb,
add column if not exists general jsonb default '{}'::jsonb,
add column if not exists faq jsonb default '[]'::jsonb,
add column if not exists pricing jsonb default '{}'::jsonb,
add column if not exists features jsonb default '[]'::jsonb,
add column if not exists reviews jsonb default '[]'::jsonb,
add column if not exists alternatives jsonb default '[]'::jsonb,
add column if not exists related_deals jsonb default '[]'::jsonb,
add column if not exists resources jsonb default '[]'::jsonb;

create index if not exists idx_deals_deal_highlight on perksnest.deals using gin (deal_highlight);
create index if not exists idx_deals_social_proof on perksnest.deals using gin (social_proof);
create index if not exists idx_deals_deals_json on perksnest.deals using gin (deals);
create index if not exists idx_deals_general on perksnest.deals using gin (general);
create index if not exists idx_deals_faq on perksnest.deals using gin (faq);
create index if not exists idx_deals_pricing on perksnest.deals using gin (pricing);
create index if not exists idx_deals_features on perksnest.deals using gin (features);
create index if not exists idx_deals_reviews on perksnest.deals using gin (reviews);
create index if not exists idx_deals_related_deals on perksnest.deals using gin (related_deals);
create index if not exists idx_deals_resources on perksnest.deals using gin (resources);
create index if not exists idx_reviews_deal_id on perksnest.reviews (deal_id);

commit;
