do $$ begin
  create type crm_stage as enum ('new', 'active', 'vip', 'at-risk', 'corporate', 'lead');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type crm_task_status as enum ('open', 'done');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type crm_deal_stage as enum ('new-lead', 'qualified', 'proposal-sent', 'won', 'lost');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type cms_status as enum ('draft', 'review', 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type cms_content_type as enum ('page', 'hero', 'announcement', 'media');
exception when duplicate_object then null;
end $$;

create table if not exists crm_profiles (
  email text primary key,
  stage crm_stage not null default 'new',
  tags text[] not null default '{}',
  owner text not null default 'Unassigned',
  updated_at timestamptz not null default now()
);

create table if not exists crm_notes (
  id text primary key,
  customer_email text not null,
  body text not null,
  author text not null,
  created_at timestamptz not null default now()
);

create table if not exists crm_tasks (
  id text primary key,
  customer_email text not null,
  title text not null,
  due_date date not null,
  status crm_task_status not null default 'open',
  owner text not null,
  created_at timestamptz not null default now()
);

create table if not exists crm_deals (
  id text primary key,
  customer_email text not null,
  title text not null,
  value numeric(12,2) not null default 0,
  stage crm_deal_stage not null default 'new-lead',
  expected_close_date date,
  created_at timestamptz not null default now()
);

create table if not exists cms_entries (
  id text primary key,
  type cms_content_type not null,
  title text not null,
  slug text not null unique,
  status cms_status not null default 'draft',
  section text not null,
  summary text not null default '',
  image_path text,
  updated_at timestamptz not null default now()
);

alter table crm_profiles enable row level security;
alter table crm_notes enable row level security;
alter table crm_tasks enable row level security;
alter table crm_deals enable row level security;
alter table cms_entries enable row level security;

grant select, insert, update, delete on crm_profiles to authenticated;
grant select, insert, update, delete on crm_notes to authenticated;
grant select, insert, update, delete on crm_tasks to authenticated;
grant select, insert, update, delete on crm_deals to authenticated;
grant select, insert, update, delete on cms_entries to authenticated;
