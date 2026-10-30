create table if not exists public.vehicle_positions (
  vehicle_id text primary key,
  corridor_id smallint not null check (corridor_id between 1 and 6),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  heading smallint check (heading between 0 and 359),
  speed_kmh numeric(5, 1) check (speed_kmh >= 0),
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists vehicle_positions_corridor_idx
  on public.vehicle_positions (corridor_id);

alter table public.vehicle_positions enable row level security;

drop policy if exists "Public can read vehicle positions" on public.vehicle_positions;
create policy "Public can read vehicle positions"
  on public.vehicle_positions
  for select
  to anon, authenticated
  using (true);

create or replace function public.set_vehicle_positions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_vehicle_positions_updated_at on public.vehicle_positions;
create trigger set_vehicle_positions_updated_at
  before update on public.vehicle_positions
  for each row
  execute function public.set_vehicle_positions_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'vehicle_positions'
  ) then
    alter publication supabase_realtime add table public.vehicle_positions;
  end if;
end;
$$;
