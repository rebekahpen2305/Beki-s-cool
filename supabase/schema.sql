-- Coffee Tracker — Supabase schema.
-- Paste this into the SQL Editor in your Supabase project and run it once.

create table if not exists public.drinks (
  -- Ids are generated on the client so a drink can be logged offline.
  -- They are only unique per user, hence the composite primary key.
  id       text        not null,
  user_id  uuid        not null references auth.users (id) on delete cascade,
  ts       timestamptz not null,
  name     text        not null,
  mg       integer     not null check (mg >= 0 and mg <= 2000),
  -- Soft delete, so a deletion on one device propagates to the others
  -- instead of the row simply reappearing on the next sync.
  deleted  boolean     not null default false,
  -- Client clock, milliseconds since the epoch. Highest value wins a merge.
  updated  bigint      not null,
  primary key (user_id, id)
);

create index if not exists drinks_user_ts_idx on public.drinks (user_id, ts desc);

-- Row Level Security is what makes the anon key safe to publish: without
-- these policies every client could read every row.
alter table public.drinks enable row level security;

drop policy if exists "drinks are private: select" on public.drinks;
drop policy if exists "drinks are private: insert" on public.drinks;
drop policy if exists "drinks are private: update" on public.drinks;
drop policy if exists "drinks are private: delete" on public.drinks;

create policy "drinks are private: select" on public.drinks
  for select using (auth.uid() = user_id);

create policy "drinks are private: insert" on public.drinks
  for insert with check (auth.uid() = user_id);

create policy "drinks are private: update" on public.drinks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "drinks are private: delete" on public.drinks
  for delete using (auth.uid() = user_id);
