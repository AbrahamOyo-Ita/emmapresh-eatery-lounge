-- Tables created directly in the SQL Editor don't automatically pick up the
-- privilege grants Supabase normally sets up for anon/authenticated/service_role.
-- RLS policies alone aren't enough — Postgres checks table-level GRANTs first.

grant usage on schema public to anon, authenticated, service_role;

grant select on
  branches, menu_categories, menu_items, cakes, catering_packages, academy_courses, halls
to anon, authenticated;

grant insert on
  orders, custom_cake_requests, catering_requests, academy_applications, hall_enquiries, reservations
to anon, authenticated;

grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

alter default privileges in schema public grant select, insert, update, delete on tables to service_role;
