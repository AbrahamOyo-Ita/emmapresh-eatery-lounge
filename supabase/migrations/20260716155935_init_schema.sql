-- EmmaPresh Eatery & Lounge — initial production schema.
-- Mirrors the TypeScript domain types in src/types/*.ts. Catalog tables
-- (branches, menu_items, cakes, catering_packages, academy_courses, halls)
-- are public-read; customer submission tables (orders, *_requests,
-- *_enquiries, *_applications, reservations) accept public inserts only —
-- all reads for staff go through the service-role admin client
-- (src/lib/supabase/admin.ts), which bypasses RLS.

create extension if not exists pgcrypto;

-- ---------- enums ----------
create type branch_slug as enum ('abuja', 'lagos', 'badagry');
create type dietary_label as enum ('vegetarian', 'vegan', 'spicy', 'gluten-free', 'contains-alcohol', 'contains-nuts', 'halal-friendly');
create type stock_status as enum ('available', 'low-stock', 'sold-out');
create type fulfilment_method as enum ('delivery', 'pickup', 'dine-in');
create type delivery_or_pickup as enum ('delivery', 'pickup');
create type payment_method as enum ('bank-transfer', 'pay-on-delivery', 'pay-at-pickup');
create type payment_status as enum ('awaiting-payment', 'payment-submitted', 'payment-under-review', 'payment-verified', 'payment-rejected', 'partial-payment', 'refunded');
create type order_status as enum ('order-created', 'awaiting-payment', 'payment-submitted', 'payment-under-review', 'payment-verified', 'order-accepted', 'preparing', 'ready-for-pickup', 'awaiting-dispatch', 'out-for-delivery', 'delivered', 'completed', 'cancelled', 'refunded');
create type cake_occasion as enum ('birthday', 'wedding', 'anniversary', 'corporate', 'graduation', 'baby-shower');
create type cake_order_status as enum ('request-received', 'under-review', 'more-info-required', 'quotation-sent', 'awaiting-approval', 'awaiting-payment', 'payment-submitted', 'payment-verified', 'design-confirmed', 'in-production', 'quality-check', 'ready-for-pickup', 'out-for-delivery', 'completed', 'cancelled');
create type catering_type as enum ('indoor', 'outdoor', 'corporate', 'wedding', 'birthday', 'conference', 'private-event', 'institutional');
create type catering_status as enum ('enquiry-received', 'under-review', 'quotation-sent', 'awaiting-approval', 'awaiting-deposit', 'deposit-submitted', 'deposit-verified', 'booking-confirmed', 'planning', 'preparation', 'event-in-progress', 'completed', 'cancelled');
create type academy_track as enum ('cooking', 'baking');
create type academy_application_status as enum ('application-received', 'awaiting-payment', 'payment-submitted', 'payment-verified', 'enrolled', 'rejected');
create type hall_booking_status as enum ('enquiry-received', 'under-review', 'quotation-sent', 'date-held', 'booking-confirmed', 'completed', 'cancelled');
create type reservation_status as enum ('pending', 'confirmed', 'cancelled', 'completed');

-- ---------- catalog: branches ----------
create table branches (
  slug branch_slug primary key,
  name text not null,
  city text not null,
  state text not null,
  address text not null,
  phone text not null,
  whatsapp text not null,
  email text not null,
  image text not null,
  gallery text[] not null default '{}',
  opening_hours jsonb not null default '[]',
  delivery_fee numeric not null default 0,
  free_delivery_threshold numeric not null default 0,
  has_event_hall boolean not null default false,
  has_catering boolean not null default false,
  has_bakery boolean not null default false,
  has_academy boolean not null default false,
  bank_account jsonb not null,
  map_embed_url text,
  rating numeric not null default 0,
  review_count integer not null default 0
);

-- ---------- catalog: menu ----------
create table menu_categories (
  slug text primary key,
  name text not null,
  description text not null,
  image text not null,
  "group" text not null check ("group" in ('food', 'junk', 'drinks', 'family'))
);

create table menu_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  category_slug text not null references menu_categories(slug),
  image text not null,
  gallery text[] not null default '{}',
  price numeric not null,
  branch_prices jsonb not null default '{}',
  branch_availability branch_slug[] not null default '{}',
  rating numeric not null default 0,
  review_count integer not null default 0,
  prep_time_minutes integer not null default 0,
  dietary_labels dietary_label[] not null default '{}',
  ingredients text[] not null default '{}',
  allergens text[] not null default '{}',
  option_groups jsonb not null default '[]',
  stock_status stock_status not null default 'available',
  is_popular boolean not null default false,
  is_new boolean not null default false,
  requires_age_confirmation boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index menu_items_category_slug_idx on menu_items(category_slug);

-- ---------- orders ----------
create table orders (
  reference text primary key,
  branch_slug branch_slug not null references branches(slug),
  items jsonb not null,
  customer jsonb not null,
  fulfilment_method fulfilment_method not null,
  delivery jsonb,
  requested_time timestamptz,
  subtotal numeric not null,
  delivery_fee numeric not null default 0,
  service_charge numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null,
  payment jsonb not null,
  status order_status not null default 'order-created',
  status_history jsonb not null default '[]',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_branch_slug_idx on orders(branch_slug);
create index orders_status_idx on orders(status);
create index orders_customer_email_idx on orders(((customer->>'email')));

-- ---------- cakes ----------
create table cakes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  image text not null,
  gallery text[] not null default '{}',
  price numeric not null,
  size_label text not null,
  flavour text not null,
  occasion cake_occasion not null,
  branch_availability branch_slug[] not null default '{}',
  quantity_available integer not null default 0,
  same_day_pickup boolean not null default false,
  rating numeric not null default 0
);

create table custom_cake_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  branch_slug branch_slug not null references branches(slug),
  customer_name text not null,
  phone text not null,
  email text not null,
  event_type text not null,
  event_date date not null,
  required_date date not null,
  size_label text not null,
  layers integer not null,
  flavour text not null,
  colour text not null,
  shape text not null,
  theme text,
  inscription text,
  dietary_requirements text,
  budget_range text not null,
  fulfilment_method delivery_or_pickup not null,
  delivery_address text,
  additional_notes text,
  reference_images text[] not null default '{}',
  status cake_order_status not null default 'request-received',
  quoted_amount numeric,
  created_at timestamptz not null default now()
);
create index custom_cake_requests_branch_slug_idx on custom_cake_requests(branch_slug);

-- ---------- catering ----------
create table catering_packages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  image text not null,
  starting_price_per_head numeric not null,
  min_guests integer not null,
  catering_types catering_type[] not null default '{}',
  includes text[] not null default '{}'
);

create table catering_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  branch_slug branch_slug not null references branches(slug),
  customer_name text not null,
  phone text not null,
  email text not null,
  catering_type catering_type not null,
  event_date date not null,
  start_time text not null,
  end_time text not null,
  event_location text not null,
  guest_count integer not null,
  preferred_dishes text,
  service_style text not null check (service_style in ('buffet', 'plated')),
  drinks_required boolean not null default false,
  servers_required boolean not null default false,
  equipment_required boolean not null default false,
  decoration_required boolean not null default false,
  budget_range text not null,
  additional_info text,
  status catering_status not null default 'enquiry-received',
  quoted_amount numeric,
  created_at timestamptz not null default now()
);
create index catering_requests_branch_slug_idx on catering_requests(branch_slug);

-- ---------- academy ----------
create table academy_courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  track academy_track not null,
  description text not null,
  image text not null,
  instructor text not null,
  duration_weeks integer not null,
  schedule text not null,
  branch_slug branch_slug not null references branches(slug),
  delivery_format text not null check (delivery_format in ('in-person', 'online', 'hybrid')),
  fee numeric not null,
  deposit_required numeric not null,
  available_seats integer not null default 0,
  modules text[] not null default '{}',
  certificate_awarded boolean not null default false
);

create table academy_applications (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  course_id uuid not null references academy_courses(id),
  applicant_name text not null,
  phone text not null,
  email text not null,
  preferred_schedule text not null,
  status academy_application_status not null default 'application-received',
  created_at timestamptz not null default now()
);
create index academy_applications_course_id_idx on academy_applications(course_id);

-- ---------- halls ----------
create table halls (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  branch_slug branch_slug not null references branches(slug),
  image text not null,
  gallery text[] not null default '{}',
  capacity jsonb not null,
  facilities text[] not null default '{}',
  starting_price numeric not null,
  description text not null
);

create table hall_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  hall_id uuid not null references halls(id),
  customer_name text not null,
  phone text not null,
  email text not null,
  event_type text not null,
  event_date date not null,
  alternative_date date,
  guest_count integer not null,
  status hall_booking_status not null default 'enquiry-received',
  created_at timestamptz not null default now()
);
create index hall_enquiries_hall_id_idx on hall_enquiries(hall_id);

-- ---------- reservations ----------
create table reservations (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  branch_slug branch_slug not null references branches(slug),
  customer_name text not null,
  phone text not null,
  email text not null,
  date date not null,
  time text not null,
  guest_count integer not null,
  seating text not null check (seating in ('indoor', 'lounge')),
  occasion text,
  special_requests text,
  status reservation_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index reservations_branch_slug_date_idx on reservations(branch_slug, date);

-- ---------- updated_at trigger ----------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at before update on orders
  for each row execute function set_updated_at();
create trigger menu_items_set_updated_at before update on menu_items
  for each row execute function set_updated_at();

-- ---------- row level security ----------
alter table branches enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table cakes enable row level security;
alter table catering_packages enable row level security;
alter table academy_courses enable row level security;
alter table halls enable row level security;
alter table orders enable row level security;
alter table custom_cake_requests enable row level security;
alter table catering_requests enable row level security;
alter table academy_applications enable row level security;
alter table hall_enquiries enable row level security;
alter table reservations enable row level security;

-- Catalog tables: public read only. Writes happen through the service-role
-- admin client from staff-only server code, which bypasses RLS entirely.
create policy "public read" on branches for select using (true);
create policy "public read" on menu_categories for select using (true);
create policy "public read" on menu_items for select using (true);
create policy "public read" on cakes for select using (true);
create policy "public read" on catering_packages for select using (true);
create policy "public read" on academy_courses for select using (true);
create policy "public read" on halls for select using (true);

-- Submission tables: public insert only (customers never authenticate).
-- No public select policy — a policy of `using (true)` would let anyone
-- with the anon key dump every customer's orders/contact details, not just
-- the one record a tracking page asks for. Customer-facing "track my
-- order/enquiry" pages must fetch by exact reference through a server
-- route using the service-role admin client instead.
create policy "public insert" on orders for insert with check (true);
create policy "public insert" on custom_cake_requests for insert with check (true);
create policy "public insert" on catering_requests for insert with check (true);
create policy "public insert" on academy_applications for insert with check (true);
create policy "public insert" on hall_enquiries for insert with check (true);
create policy "public insert" on reservations for insert with check (true);
