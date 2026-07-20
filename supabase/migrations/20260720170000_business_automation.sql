-- Production business automation for orders, bookings, CRM and operations.
-- Times are scheduled in UTC; Nigeria is UTC+1 year-round.

create extension if not exists pg_cron with schema extensions;

alter table notifications add column if not exists automation_key text;
create unique index if not exists notifications_automation_key_idx
  on notifications (automation_key) where automation_key is not null;
create index if not exists notifications_created_at_idx on notifications (created_at);
create index if not exists orders_status_updated_at_idx on orders (status, updated_at);
create index if not exists reservations_status_date_idx on reservations (status, date);

create table if not exists automation_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists automation_runs (
  id bigint generated always as identity primary key,
  job_name text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null check (status in ('running', 'succeeded', 'failed')) default 'running',
  affected_rows integer not null default 0,
  error_message text
);

alter table automation_settings enable row level security;
alter table automation_runs enable row level security;
grant all on automation_settings, automation_runs to service_role;

insert into automation_settings (key, value)
values ('admin_recipients', '["oyoitaabraham@gmail.com", "emmapresheateryandlounge@gmail.com"]'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

create or replace function enqueue_automation_notification(
  p_key text,
  p_recipient text,
  p_subject text,
  p_message text,
  p_entity_type text default null,
  p_entity_reference text default null,
  p_action_url text default null,
  p_channel notification_channel default 'email'
) returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (
    channel, recipient, subject, message, entity_type, entity_reference,
    action_url, status, automation_key
  ) values (
    p_channel, lower(trim(p_recipient)), p_subject, p_message, p_entity_type,
    p_entity_reference, p_action_url, 'queued', p_key
  ) on conflict (automation_key) where automation_key is not null do nothing;
  return case when found then 1 else 0 end;
end;
$$;

revoke all on function enqueue_automation_notification(text,text,text,text,text,text,text,notification_channel) from public;
grant execute on function enqueue_automation_notification(text,text,text,text,text,text,text,notification_channel) to service_role;

create or replace function run_business_automation(p_job text)
returns integer
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_run_id bigint;
  v_count integer := 0;
  v_row record;
  v_admin text;
  v_today date := (now() at time zone 'Africa/Lagos')::date;
begin
  insert into automation_runs (job_name) values (p_job) returning id into v_run_id;

  if p_job = 'payment-review-reminder' then
    for v_row in
      select reference, updated_at from orders
      where status in ('payment-submitted', 'payment-under-review')
        and updated_at <= now() - interval '20 minutes'
        and updated_at >= now() - interval '7 days'
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'payment-review:' || v_row.reference || ':' || v_admin || ':' || v_today,
          v_admin, 'Payment review overdue — ' || v_row.reference,
          'A customer receipt has been waiting for review for more than 20 minutes. Please verify or reject it promptly.',
          'orders', v_row.reference, '/admin/payments', 'admin');
      end loop;
    end loop;

  elsif p_job = 'abandoned-payment-reminder' then
    for v_row in
      select reference, lower(customer->>'email') email from orders
      where status = 'awaiting-payment'
        and created_at <= now() - interval '2 hours'
        and created_at >= now() - interval '3 days'
        and coalesce(customer->>'email', '') <> ''
    loop
      v_count := v_count + enqueue_automation_notification(
        'payment-pending:' || v_row.reference || ':' || v_today,
        v_row.email, 'Complete payment for order ' || v_row.reference,
        'Your EmmaPresh order is still awaiting payment. Complete your transfer and upload the receipt so our team can confirm it.',
        'orders', v_row.reference, '/payment/' || v_row.reference);
    end loop;

  elsif p_job = 'stale-order-alert' then
    for v_row in
      select reference, status::text status from orders
      where ((status = 'order-accepted' and updated_at <= now() - interval '15 minutes')
          or (status = 'preparing' and updated_at <= now() - interval '60 minutes')
          or (status in ('ready-for-pickup','awaiting-dispatch') and updated_at <= now() - interval '30 minutes')
          or (status = 'out-for-delivery' and updated_at <= now() - interval '2 hours'))
        and updated_at >= now() - interval '2 days'
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'stale-order:' || v_row.reference || ':' || v_row.status || ':' || v_admin || ':' || v_today,
          v_admin, 'Order needs attention — ' || v_row.reference,
          'Order ' || v_row.reference || ' has remained at “' || replace(v_row.status, '-', ' ') || '” longer than expected.',
          'orders', v_row.reference, '/admin/orders', 'admin');
      end loop;
    end loop;

  elsif p_job = 'scheduled-order-reminder' then
    for v_row in
      select reference, requested_time from orders
      where requested_time between now() + interval '30 minutes' and now() + interval '90 minutes'
        and status not in ('completed','cancelled','refunded','delivered')
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'scheduled-order:' || v_row.reference || ':' || v_admin,
          v_admin, 'Scheduled order approaching — ' || v_row.reference,
          'This scheduled order is due within 90 minutes. Confirm preparation and fulfilment arrangements.',
          'orders', v_row.reference, '/admin/orders', 'admin');
      end loop;
    end loop;

  elsif p_job = 'reservation-reminder' then
    for v_row in
      select reference, lower(email) email, time from reservations
      where status = 'confirmed' and date = v_today + 1
    loop
      v_count := v_count + enqueue_automation_notification(
        'reservation-reminder:' || v_row.reference,
        v_row.email, 'Your EmmaPresh reservation is tomorrow',
        'Reminder: your reservation ' || v_row.reference || ' is tomorrow at ' || v_row.time || '. We look forward to welcoming you.',
        'reservations', v_row.reference, '/account/orders');
    end loop;

  elsif p_job = 'crm-task-reminder' then
    for v_row in select id, title, customer_email from crm_tasks where status = 'open' and due_date <= v_today
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'crm-task:' || v_row.id || ':' || v_admin || ':' || v_today,
          v_admin, 'CRM task due — ' || v_row.title,
          'A CRM follow-up task is due or overdue' || case when v_row.customer_email <> '' then ' for ' || v_row.customer_email else '' end || '.',
          'crm_tasks', v_row.id, '/admin/crm', 'admin');
      end loop;
    end loop;

  elsif p_job = 'project-overdue-alert' then
    for v_row in select id::text id, title from project_cards where status <> 'done' and due_date < v_today
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'project-overdue:' || v_row.id || ':' || v_admin || ':' || v_today,
          v_admin, 'Project card overdue — ' || v_row.title,
          'A project-management card is overdue. Update its deadline, owner, or completion status.',
          'project_cards', v_row.id, '/admin/projects', 'admin');
      end loop;
    end loop;

  elsif p_job = 'customer-follow-up' then
    for v_row in
      select reference, lower(customer->>'email') email from orders
      where status in ('delivered','completed')
        and updated_at >= now() - interval '26 hours'
        and updated_at < now() - interval '22 hours'
        and coalesce(customer->>'email', '') <> ''
    loop
      v_count := v_count + enqueue_automation_notification(
        'order-follow-up:' || v_row.reference,
        v_row.email, 'How was your EmmaPresh order?',
        'We hope you enjoyed your order. If anything was not excellent, please contact our team and quote ' || v_row.reference || '.',
        'orders', v_row.reference, '/contact');
    end loop;

  elsif p_job = 'promotion-expiry-manager' then
    update promotions set active = false where active and valid_until < v_today;
    get diagnostics v_count = row_count;
    for v_row in select id::text id, title, valid_until from promotions where active and valid_until between v_today and v_today + 3
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'promotion-expiry:' || v_row.id || ':' || v_admin,
          v_admin, 'Promotion expiring — ' || v_row.title,
          'This promotion expires on ' || v_row.valid_until::text || '. Extend it or prepare the replacement campaign.',
          'promotions', v_row.id, '/admin/promotions', 'admin');
      end loop;
    end loop;

  elsif p_job = 'upcoming-event-readiness' then
    for v_row in
      select reference, 'catering' entity_type, event_date due_date from catering_requests
      where status not in ('completed','cancelled') and event_date between v_today and v_today + 2
      union all
      select reference, 'cake-request', required_date from custom_cake_requests
      where status not in ('completed','cancelled') and required_date between v_today and v_today + 2
      union all
      select he.reference, 'hall-enquiry', he.event_date from hall_enquiries he
      where he.status not in ('completed','cancelled') and he.event_date between v_today and v_today + 2
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'event-readiness:' || v_row.entity_type || ':' || v_row.reference || ':' || v_admin,
          v_admin, 'Upcoming booking requires readiness check',
          initcap(replace(v_row.entity_type, '-', ' ')) || ' ' || v_row.reference || ' is due on ' || v_row.due_date::text || '. Confirm staffing, supplies and customer arrangements.',
          v_row.entity_type, v_row.reference, '/admin', 'admin');
      end loop;
    end loop;

  elsif p_job = 'new-enquiry-sla-alert' then
    for v_row in
      select reference, 'catering' entity_type from catering_requests where status = 'enquiry-received' and created_at <= now() - interval '2 hours' and created_at >= now() - interval '7 days'
      union all
      select reference, 'cake-request' from custom_cake_requests where status = 'request-received' and created_at <= now() - interval '2 hours' and created_at >= now() - interval '7 days'
      union all
      select reference, 'hall-enquiry' from hall_enquiries where status = 'enquiry-received' and created_at <= now() - interval '2 hours' and created_at >= now() - interval '7 days'
      union all
      select reference, 'academy' from academy_applications where status = 'application-received' and created_at <= now() - interval '4 hours' and created_at >= now() - interval '7 days'
    loop
      for v_admin in select jsonb_array_elements_text(value) from automation_settings where key = 'admin_recipients'
      loop
        v_count := v_count + enqueue_automation_notification(
          'enquiry-sla:' || v_row.entity_type || ':' || v_row.reference || ':' || v_admin || ':' || v_today,
          v_admin, 'New enquiry awaiting response — ' || v_row.reference,
          'This ' || replace(v_row.entity_type, '-', ' ') || ' request has exceeded its first-response target.',
          v_row.entity_type, v_row.reference, '/admin', 'admin');
      end loop;
    end loop;

  elsif p_job = 'data-retention-cleanup' then
    delete from notifications where created_at < now() - interval '180 days';
    get diagnostics v_count = row_count;
    delete from automation_runs where started_at < now() - interval '90 days';
    delete from cron.job_run_details where end_time < now() - interval '30 days';

  else
    raise exception 'Unknown business automation job: %', p_job;
  end if;

  update automation_runs set status = 'succeeded', affected_rows = v_count, finished_at = now() where id = v_run_id;
  return v_count;
exception when others then
  update automation_runs set status = 'failed', error_message = sqlerrm, finished_at = now() where id = v_run_id;
  raise;
end;
$$;

revoke all on function run_business_automation(text) from public;
grant execute on function run_business_automation(text) to service_role;

-- Re-running this migration updates schedules without creating duplicates.
select cron.schedule('payment-review-reminder', '3,18,33,48 * * * *', $$select run_business_automation('payment-review-reminder')$$);
select cron.schedule('stale-order-alert', '7,22,37,52 * * * *', $$select run_business_automation('stale-order-alert')$$);
select cron.schedule('scheduled-order-reminder', '11,41 * * * *', $$select run_business_automation('scheduled-order-reminder')$$);
select cron.schedule('abandoned-payment-reminder', '17 * * * *', $$select run_business_automation('abandoned-payment-reminder')$$);
select cron.schedule('crm-task-reminder', '23 * * * *', $$select run_business_automation('crm-task-reminder')$$);
select cron.schedule('new-enquiry-sla-alert', '29 * * * *', $$select run_business_automation('new-enquiry-sla-alert')$$);
select cron.schedule('reservation-reminder', '0 7 * * *', $$select run_business_automation('reservation-reminder')$$);
select cron.schedule('project-overdue-alert', '10 7 * * *', $$select run_business_automation('project-overdue-alert')$$);
select cron.schedule('upcoming-event-readiness', '20 7 * * *', $$select run_business_automation('upcoming-event-readiness')$$);
select cron.schedule('customer-follow-up', '0 9 * * *', $$select run_business_automation('customer-follow-up')$$);
select cron.schedule('promotion-expiry-manager', '5 23 * * *', $$select run_business_automation('promotion-expiry-manager')$$);
select cron.schedule('data-retention-cleanup', '0 1 * * 0', $$select run_business_automation('data-retention-cleanup')$$);
