create table if not exists push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  customer_email text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_customer_email_idx on push_subscriptions(customer_email) where customer_email is not null;
alter table push_subscriptions enable row level security;
grant all on push_subscriptions to service_role;

alter table notifications add column if not exists action_url text;

-- In Supabase Dashboard create an INSERT Database Webhook for public.notifications:
-- URL: https://YOUR_DOMAIN/api/push/send
-- Header: x-push-webhook-secret: the same random PUSH_WEBHOOK_SECRET used by the app.
