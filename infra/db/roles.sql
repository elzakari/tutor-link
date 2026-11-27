-- Tutor Link — cluster-level database roles (03-database.md §9 "Database roles").
--
-- Run once per PostgreSQL cluster (not once per database/migration): roles
-- are cluster-wide objects in Postgres, unlike tables, which live in one
-- database. The script is idempotent (each CREATE ROLE is guarded so a role
-- that already exists is left untouched), so `pnpm db:migrate` runs it every
-- time before applying schema migrations — that keeps local dev, CI and any
-- future environment self-provisioning without a separate manual step,
-- while still matching "run once" semantics (reruns are no-ops).
--
-- Roles intentionally have NOLOGIN and no passwords here. Environment
-- provisioning (outside this repository) creates or alters LOGIN identities
-- with secrets-manager-issued credentials, then grants them these group
-- roles. Keeping role creation password-free means an operator cannot
-- accidentally bootstrap staging/production with public dev credentials.
--
-- tl_migrator: intended to own the schema and be the only role that runs
-- migrations (03-database.md §9). apps/api/scripts/db-migrate.mjs does not
-- yet connect or run migrations as tl_migrator — it still uses the same
-- admin connection as local dev/CI's Postgres container (DATABASE_URL),
-- which plays that role for now. Reassigning schema ownership to
-- tl_migrator and switching the migration job to connect as it is tracked
-- as follow-up work (see the S1-04 task report), not done here.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'tl_migrator') then
    create role tl_migrator nologin;
  end if;
end
$$;

-- tl_app: the API's own runtime connection. Read/write on application
-- tables; insert-and-select only on audit_log (see the 0005_roles_and_grants
-- migration for the actual grants).
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'tl_app') then
    create role tl_app nologin;
  end if;
end
$$;

-- tl_readonly: read-only analytics access, with no access to Restricted-class
-- data (07-security-safeguarding.md §4) or anything else listed under
-- "Sensitive columns" in 03-database.md §9.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'tl_readonly') then
    create role tl_readonly nologin;
  end if;
end
$$;
