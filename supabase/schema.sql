-- Run this once in the Supabase SQL editor.
create table applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  status text not null default 'wishlist'
    check (status in ('wishlist','applied','interview','offer','rejected')),
  link text,
  location text,
  salary_min integer,
  salary_max integer,
  notes text,
  applied_at timestamptz,
  follow_up_at date,
  position integer not null default 0,
  history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index applications_user_status_idx on applications (user_id, status);

-- Row Level Security: the database itself only lets each user touch their own rows,
-- so it is safe for the browser to talk to it directly with the public anon key.
alter table applications enable row level security;

create policy "Users manage their own applications"
  on applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Only signed-in users can use the table through the API.
grant select, insert, update, delete on applications to authenticated;
