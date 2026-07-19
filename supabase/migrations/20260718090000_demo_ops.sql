-- Demo operations hardening: staff roles, notifications, extra request tables,
-- and Storage buckets used by receipt/cake reference uploads.

do $$ begin
  create type staff_role as enum ('super_admin', 'manager', 'kitchen', 'finance');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type notification_status as enum ('queued', 'sent', 'failed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type notification_channel as enum ('email', 'sms', 'whatsapp', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type meal_plan_status as enum ('active', 'paused', 'cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role staff_role not null default 'manager',
  full_name text,
  branch_slug branch_slug,
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists meal_plan_subscriptions (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  branch_slug branch_slug not null references branches(slug),
  customer_name text not null,
  phone text not null,
  email text not null,
  meals_per_week integer not null,
  preferred_days text not null,
  budget_range text not null,
  allergies text,
  status meal_plan_status not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  channel notification_channel not null,
  recipient text not null,
  subject text not null,
  message text not null,
  entity_type text,
  entity_reference text,
  status notification_status not null default 'queued',
  created_at timestamptz not null default now()
);

alter table staff_profiles enable row level security;
alter table contact_messages enable row level security;
alter table meal_plan_subscriptions enable row level security;
alter table notifications enable row level security;

drop policy if exists "public insert contact" on contact_messages;
drop policy if exists "public insert meal plans" on meal_plan_subscriptions;
drop policy if exists "staff can read own profile" on staff_profiles;
create policy "public insert contact" on contact_messages for insert with check (true);
create policy "public insert meal plans" on meal_plan_subscriptions for insert with check (true);
create policy "staff can read own profile" on staff_profiles for select using (auth.uid() = user_id);

grant select on staff_profiles to authenticated;
grant insert on contact_messages, meal_plan_subscriptions to anon, authenticated;
grant all on staff_profiles, contact_messages, meal_plan_subscriptions, notifications to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('receipts', 'receipts', false, 5242880, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('cake-reference-images', 'cake-reference-images', false, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('catalog-images', 'catalog-images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('gallery-images', 'gallery-images', true, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read catalog images" on storage.objects;
drop policy if exists "public upload receipts" on storage.objects;
drop policy if exists "staff read private uploads" on storage.objects;

create policy "public read catalog images" on storage.objects
  for select using (bucket_id in ('catalog-images', 'gallery-images'));

create policy "public upload receipts" on storage.objects
  for insert with check (bucket_id in ('receipts', 'cake-reference-images'));

create policy "staff read private uploads" on storage.objects
  for select using (bucket_id in ('receipts', 'cake-reference-images') and auth.role() = 'authenticated');
