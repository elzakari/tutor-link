-- 0005_roles_and_grants (03-database.md §9 "Database roles" and
-- "Sensitive columns"; infra/db/roles.sql creates the roles granted here).
--
-- Deviation from 03-database.md §10's "Initial migration order" (flagged in
-- the S1-04 task report, same pattern as the enum deviation in
-- 0001_extensions): that table reserves 0005-0008 for tables S1-04 is not
-- building yet (tutor/verification, marketplace/sessions, payments/ledger,
-- learning/reviews/messaging) and puts roles and grants at 0009. S1-04's
-- acceptance criteria need tl_app/tl_readonly enforcement now, on the
-- tables that exist so far, so this migration takes 0005 instead. Later
-- sprints adding those tables should number their own migrations from 0006
-- rather than reusing the spec's literal numbers.
grant usage on schema public to tl_app, tl_readonly;

-- tl_app: read/write on ordinary application tables...
grant select, insert, update, delete on all tables in schema public to tl_app;
-- ...except the insert-only audit table (§8: "audit_log allows insert only
-- for the application role"; §9: "Ledger and audit history cannot be
-- rewritten | Update and delete revoked from the application role").
revoke update, delete on audit_log from tl_app;

-- tl_readonly: read-only, and not even that on anything Restricted-class
-- (07-security-safeguarding.md §4) or listed under "Sensitive columns" (§9).
-- Start with no table access, then explicitly allow only non-sensitive
-- reference and platform-control tables. This is safer than a blanket
-- grant followed by revokes: a future confidential table cannot become
-- readable merely because its migration forgot a revoke.
revoke all on all tables in schema public from tl_readonly;
grant select on region, district, locality, subject, class_level, curriculum,
  organisation, config_setting, feature_flag to tl_readonly;
-- Restricted/confidential/authentication tables are intentionally absent:
-- guardian_address, child_profile, child_subject, consent_record,
-- staff_profile, user_account, user_role, auth_session, otp_challenge,
-- staff_permission, audit_log and outbox_event.

-- No sequences to grant: ids are supplied by the API (newId(), UUID v7),
-- never database-generated (S1-04 task item 5).

-- Future tables created by tl_migrator inherit the tl_app baseline. A
-- table that needs tighter rights (audit, ledger) must revoke them in the
-- same migration that creates it.
alter default privileges for role tl_migrator in schema public
  grant select, insert, update, delete on tables to tl_app;
-- Keep the current local/CI admin execution path consistent until the
-- deployment job switches to SET ROLE tl_migrator (follow-up noted in the
-- S1-04 report).
alter default privileges in schema public
  grant select, insert, update, delete on tables to tl_app;
-- Deliberately no default table privileges for tl_readonly: each future
-- non-sensitive analytics surface must be granted explicitly after review.
