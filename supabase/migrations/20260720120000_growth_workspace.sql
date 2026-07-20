-- Persistent growth workspace: promotions, CRM operations, and project board.

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  code text not null unique,
  discount text not null,
  valid_until date not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists project_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null check (status in ('backlog','planned','in-progress','review','done')),
  priority text not null check (priority in ('low','medium','high','urgent')) default 'medium',
  owner text not null default 'Unassigned',
  due_date date,
  labels text[] not null default '{}',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table promotions enable row level security;
alter table project_cards enable row level security;

grant all on promotions, project_cards to service_role;

create index if not exists project_cards_status_position_idx on project_cards(status, position);
create index if not exists crm_tasks_due_date_idx on crm_tasks(due_date) where status = 'open';
create index if not exists crm_deals_stage_idx on crm_deals(stage);

insert into promotions (title, description, code, discount, valid_until)
values
  ('New Customer Discount', '15% off your first order when you sign up.', 'WELCOME15', '15% off', '2026-12-31'),
  ('Corporate Catering Discount', '8% off catering bookings for corporate events above 100 guests.', 'CORP100', '8% off', '2026-11-30')
on conflict (code) do nothing;

insert into project_cards (title, description, status, priority, owner, due_date, labels, position)
values
  ('Launch production domain', 'Connect DNS, SSL, analytics and production environment variables.', 'planned', 'urgent', 'Technical Lead', '2026-07-31', array['launch','infrastructure'], 0),
  ('Configure branded email', 'Set up Workspace, SPF, DKIM, DMARC and Postmaster Tools.', 'backlog', 'high', 'Operations', '2026-08-05', array['email','deliverability'], 0),
  ('Complete payment acceptance review', 'Validate bank transfer controls and decide on online gateway.', 'in-progress', 'high', 'Finance', '2026-07-28', array['payments'], 0)
on conflict do nothing;
