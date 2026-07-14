-- SigCraft schema (Postgres / Supabase)
-- Apply with: supabase db push  (or paste into the SQL editor)

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------ users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique references auth.users (id) on delete cascade,
  email text not null unique,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------------- templates
create table if not exists public.templates (
  id text primary key,
  name text not null,
  industry_tag text,
  role_tag text,
  preview_url text,
  layout_config jsonb not null default '{}'::jsonb
);

-- ------------------------------------------------------------- signatures
create table if not exists public.signatures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  slug text not null unique,
  name text not null default '',
  title text not null default '',
  company text not null default '',
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  socials jsonb not null default '{}'::jsonb,
  logo_url text,
  photo_url text,
  brand_color text not null default '#4f46e5',
  cta_text text not null default '',
  cta_url text not null default '',
  animation_style text not null default 'subtle'
    check (animation_style in ('subtle', 'bold', 'none')),
  verified_badge boolean not null default false,
  template_id text references public.templates (id),
  element_order jsonb not null default '["identity","contact","socials","cta"]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists signatures_user_idx on public.signatures (user_id);
create index if not exists signatures_slug_idx on public.signatures (slug);

-- --------------------------------------------------------- signature_events
create table if not exists public.signature_events (
  id uuid primary key default gen_random_uuid(),
  signature_id uuid not null references public.signatures (id) on delete cascade,
  event_type text not null check (event_type in ('impression', 'click')),
  created_at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb
);

create index if not exists events_sig_time_idx
  on public.signature_events (signature_id, created_at desc);
create index if not exists events_type_idx on public.signature_events (event_type);

-- ------------------------------------------------------------------ teams
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  primary key (team_id, user_id)
);

-- ------------------------------------------------------------ row security
alter table public.users enable row level security;
alter table public.signatures enable row level security;
alter table public.signature_events enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;

-- Users see only themselves
create policy "users self" on public.users
  for all using (auth.uid() = auth_id);

-- Signatures: owner has full access
create policy "signatures owner" on public.signatures
  for all using (
    user_id in (select id from public.users where auth_id = auth.uid())
  );

-- Events: owner reads their signatures' events; writes go through the
-- service-role key (tracking endpoints), which bypasses RLS.
create policy "events owner read" on public.signature_events
  for select using (
    signature_id in (
      select s.id from public.signatures s
      join public.users u on u.id = s.user_id
      where u.auth_id = auth.uid()
    )
  );

-- Teams: owner manages; members read
create policy "teams owner" on public.teams
  for all using (
    owner_id in (select id from public.users where auth_id = auth.uid())
  );
create policy "team members read" on public.team_members
  for select using (
    user_id in (select id from public.users where auth_id = auth.uid())
    or team_id in (
      select t.id from public.teams t
      join public.users u on u.id = t.owner_id
      where u.auth_id = auth.uid()
    )
  );

-- ------------------------------------------------------------- seed templates
insert into public.templates (id, name, industry_tag, role_tag, layout_config) values
  ('aurora',   'Aurora',   'SaaS / Startups', 'Founders',      '{"layout":"photo-left","defaultColor":"#4f46e5"}'),
  ('ledger',   'Ledger',   'Finance',         'Consultants',   '{"layout":"minimal","defaultColor":"#0f766e"}'),
  ('compass',  'Compass',  'Real Estate',     'Realtors',      '{"layout":"photo-left","defaultColor":"#b45309"}'),
  ('monogram', 'Monogram', 'Agencies',        'Creatives',     '{"layout":"stacked","defaultColor":"#8b5cf6"}'),
  ('beacon',   'Beacon',   'Healthcare',      'Practitioners', '{"layout":"banner","defaultColor":"#0284c7"}'),
  ('slate',    'Slate',    'Sales Teams',     'SDRs / AEs',    '{"layout":"minimal","defaultColor":"#dc2626"}')
on conflict (id) do nothing;
