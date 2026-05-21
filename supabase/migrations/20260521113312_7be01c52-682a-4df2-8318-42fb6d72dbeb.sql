create table public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  email text,
  status text not null default 'pending',
  total numeric(10,2) not null default 0,
  items jsonb not null default '[]'::jsonb,
  customer jsonb,
  shipping jsonb,
  pix jsonb,
  transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create index orders_email_idx on public.orders (lower(email));
create index orders_user_id_idx on public.orders (user_id);

alter table public.orders enable row level security;

create policy "anyone can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

create policy "users see own orders by user_id or email"
on public.orders for select
to authenticated
using (
  user_id = auth.uid()
  or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy "users can claim their orders by email"
on public.orders for update
to authenticated
using (
  user_id is null
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
)
with check (
  user_id = auth.uid()
  and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create or replace function public.touch_orders_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_touch_updated_at
before update on public.orders
for each row execute function public.touch_orders_updated_at();