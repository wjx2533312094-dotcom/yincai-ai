create table if not exists public.app_users (
  phone text primary key,
  free_used integer not null default 0,
  paid_credits integer not null default 0,
  unlimited_until timestamptz,
  plan_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.login_codes (
  phone text primary key references public.app_users(phone) on delete cascade,
  code text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  token text primary key,
  phone text not null references public.app_users(phone) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigserial primary key,
  phone text not null references public.app_users(phone) on delete cascade,
  plan_id text not null,
  plan_name text not null,
  amount_label text not null,
  status text not null default 'simulated_paid',
  created_at timestamptz not null default now()
);

create index if not exists sessions_phone_idx on public.sessions(phone);
create index if not exists sessions_expires_at_idx on public.sessions(expires_at);
create index if not exists login_codes_expires_at_idx on public.login_codes(expires_at);
