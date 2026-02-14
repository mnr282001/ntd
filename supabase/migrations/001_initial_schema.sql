-- ═══════════════════════════════════════════════
-- Note That Down - Supabase Schema
-- ═══════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── PLANS TABLE ───
-- Each plan has a unique share_slug for the public URL
-- e.g. note-that-down.com/p/xK9mQ2
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  share_slug text unique not null,
  name text not null default 'Untitled Plan',
  plan_date date,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── STOPS TABLE ───
-- Each stop belongs to a plan
create table public.stops (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  title text not null,
  location text,
  notes text,
  category text not null default 'activity',
  start_hour int not null check (start_hour >= 0 and start_hour <= 23),
  start_min int not null default 0 check (start_min >= 0 and start_min <= 59),
  duration int not null default 60 check (duration > 0),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── REACTIONS TABLE ───
-- Tracks emoji reactions on stops from shared view visitors
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  stop_id uuid not null references public.stops(id) on delete cascade,
  emoji text not null,
  reactor_id text not null, -- anonymous session ID or user ID
  created_at timestamptz not null default now(),
  -- One reaction type per person per stop
  unique(stop_id, emoji, reactor_id)
);

-- ─── INDEXES ───
create index idx_plans_share_slug on public.plans(share_slug);
create index idx_plans_created_by on public.plans(created_by);
create index idx_stops_plan_id on public.stops(plan_id);
create index idx_reactions_stop_id on public.reactions(stop_id);

-- ─── ROW LEVEL SECURITY ───
alter table public.plans enable row level security;
alter table public.stops enable row level security;
alter table public.reactions enable row level security;

-- Plans: creators can do everything, anyone can read (for shared links)
create policy "Plans are viewable by everyone"
  on public.plans for select using (true);

create policy "Users can create plans"
  on public.plans for insert with check (true);

create policy "Creators can update their plans"
  on public.plans for update using (
    created_by = auth.uid() or created_by is null
  );

create policy "Creators can delete their plans"
  on public.plans for delete using (
    created_by = auth.uid() or created_by is null
  );

-- Stops: same as plans (inherit access through plan)
create policy "Stops are viewable by everyone"
  on public.stops for select using (true);

create policy "Anyone can manage stops"
  on public.stops for insert with check (true);

create policy "Anyone can update stops"
  on public.stops for update using (true);

create policy "Anyone can delete stops"
  on public.stops for delete using (true);

-- Reactions: anyone can add, view
create policy "Reactions are viewable by everyone"
  on public.reactions for select using (true);

create policy "Anyone can react"
  on public.reactions for insert with check (true);

create policy "Users can remove their reactions"
  on public.reactions for delete using (reactor_id = current_setting('app.reactor_id', true));

-- ─── UPDATED_AT TRIGGER ───
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger plans_updated_at
  before update on public.plans
  for each row execute function public.handle_updated_at();

create trigger stops_updated_at
  before update on public.stops
  for each row execute function public.handle_updated_at();

-- ─── REACTION COUNT VIEW ───
-- Materialized view for fast reaction counts
create or replace view public.reaction_counts as
select
  stop_id,
  emoji,
  count(*) as count
from public.reactions
group by stop_id, emoji;
