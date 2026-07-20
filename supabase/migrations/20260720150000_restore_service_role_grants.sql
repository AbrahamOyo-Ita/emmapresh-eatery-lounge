-- Restore backend permissions when the initial grants migration was skipped
-- during a manual SQL Editor setup. RLS is still enforced for anon/authenticated;
-- the service role is used only by trusted server-side API routes.

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

alter default privileges in schema public grant select, insert, update, delete on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to service_role;
alter default privileges in schema public grant execute on functions to service_role;
