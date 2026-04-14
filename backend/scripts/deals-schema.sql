create extension if not exists pgcrypto;
create schema if not exists perksnest;

create table if not exists perksnest.deals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  perks text not null,
  steps jsonb not null default '[]'::jsonb,
  website_url text not null default '',
  created_at timestamptz not null default now()
);

alter table if exists perksnest.deals
  add column if not exists title text,
  add column if not exists slug text,
  add column if not exists category text,
  add column if not exists description text,
  add column if not exists perks text,
  add column if not exists steps jsonb not null default '[]'::jsonb,
  add column if not exists website_url text not null default '',
  add column if not exists created_at timestamptz not null default now();

create unique index if not exists idx_deals_slug on perksnest.deals (slug);

comment on table perksnest.deals is
'Startup deal records. If an existing project already uses a non-uuid deals.id column, keep that legacy type in place and use slug for startup-deal lookups.';
