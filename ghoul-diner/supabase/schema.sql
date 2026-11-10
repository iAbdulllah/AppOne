-- Ghoul Diner multiplayer schema. Run once in the Supabase SQL editor.
-- Also enable: Authentication -> Sign In / Providers -> "Allow anonymous sign-ins".

create table if not exists public.diners (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Ghoul' check (char_length(name) between 1 and 24),
  level int not null default 1 check (level between 1 and 999),
  popularity int not null default 0 check (popularity between 0 and 100000),
  served int not null default 0 check (served >= 0),
  likes int not null default 0,
  layout jsonb not null default '{}'::jsonb check (pg_column_size(layout) < 20000),
  updated_at timestamptz not null default now()
);
alter table public.diners enable row level security;
drop policy if exists "diners readable" on public.diners;
create policy "diners readable" on public.diners for select to authenticated using (true);
drop policy if exists "insert own diner" on public.diners;
create policy "insert own diner" on public.diners for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "update own diner" on public.diners;
create policy "update own diner" on public.diners for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
-- players may not edit their own like counter
revoke all on public.diners from anon, authenticated;
grant select on public.diners to authenticated;
grant insert (id, name, level, popularity, served, layout, updated_at) on public.diners to authenticated;
grant update (id, name, level, popularity, served, layout, updated_at) on public.diners to authenticated;
create index if not exists diners_popularity_idx on public.diners (popularity desc);

create table if not exists public.gifts (
  id bigint generated always as identity primary key,
  from_id uuid not null references auth.users(id) on delete cascade,
  to_id uuid not null references public.diners(id) on delete cascade,
  from_name text not null,
  coins int not null,
  claimed boolean not null default false,
  day date not null default current_date,
  created_at timestamptz not null default now(),
  unique (from_id, to_id, day)
);
alter table public.gifts enable row level security;
drop policy if exists "see own gifts" on public.gifts;
create policy "see own gifts" on public.gifts for select to authenticated using ((select auth.uid()) = to_id);
revoke all on public.gifts from anon, authenticated;
grant select on public.gifts to authenticated;
create index if not exists gifts_to_idx on public.gifts (to_id) where not claimed;

-- one tip per visitor per diner per day; amount fixed on the server
create or replace function public.send_tip(target uuid) returns int
language plpgsql security definer set search_path = public as $$
declare me uuid := auth.uid(); nm text; amt int := 25;
begin
  if me is null or target is null or target = me then raise exception 'invalid target'; end if;
  select name into nm from diners where id = me;
  if nm is null then raise exception 'create your diner first'; end if;
  insert into gifts (from_id, to_id, from_name, coins) values (me, target, nm, amt)
    on conflict (from_id, to_id, day) do nothing;
  if not found then return 0; end if;
  update diners set likes = likes + 1 where id = target;
  return amt;
end $$;

create or replace function public.claim_gifts() returns json
language sql security definer set search_path = public as $$
  with c as (
    update gifts set claimed = true where to_id = auth.uid() and not claimed returning coins, from_name
  )
  select json_build_object('coins', coalesce(sum(coins), 0), 'count', count(*), 'names', coalesce(json_agg(distinct from_name), '[]'::json)) from c;
$$;

revoke execute on function public.send_tip(uuid) from public, anon;
revoke execute on function public.claim_gifts() from public, anon;
grant execute on function public.send_tip(uuid) to authenticated;
grant execute on function public.claim_gifts() to authenticated;

-- live "someone tipped you" notifications
do $$ begin
  alter publication supabase_realtime add table public.gifts;
exception when duplicate_object then null; end $$;
