-- 0004_identity_family (03-database.md §3, §9, §10 step 4)
-- Eleven tables hold accounts, roles, logins, guardians and children.
-- child_profile holds no surname, photo, school name, date of birth or
-- national ID (§3) — verified by an integration test reading
-- information_schema. guardian_address is readable only by the Booking
-- service, and only for a paid booking (application-layer rule, S1-05+).
create type user_status as enum ('active','suspended','deactivated');
create type role_type   as enum ('guardian','tutor','student','org_member','staff');
create type staff_role  as enum ('super_admin','operations','safeguarding','finance',
                                 'support','moderator','marketing');
create type otp_purpose as enum ('login','signup','step_up','session_checkin');
create type consent_type as enum ('terms','privacy','guardian_for_child',
                                  'kyc_check','record_sharing','marketing');

create table user_account (
  id uuid primary key,
  phone_e164        text not null unique,
  email             citext unique,
  full_name         text not null,
  status            user_status not null default 'active',
  phone_verified_at timestamptz,
  phone_changed_at  timestamptz, -- drives the payout cooling-off period
  last_login_at     timestamptz,
  deleted_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table user_role (
  id              uuid primary key,
  user_id         uuid not null references user_account on delete restrict,
  role            role_type not null,
  organisation_id uuid not null references organisation on delete restrict,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, role, organisation_id)
);
create index user_role_user_id_idx on user_role (user_id);
create index user_role_organisation_id_idx on user_role (organisation_id);

create table auth_session (
  id                 uuid primary key,
  user_id            uuid not null references user_account on delete restrict,
  family_id          uuid not null, -- all rotations of one login
  refresh_token_hash text not null unique,
  user_agent         text,
  ip                 inet,
  expires_at         timestamptz not null,
  revoked_at         timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index auth_session_user_id_idx on auth_session (user_id);
create index auth_session_family_id_idx on auth_session (family_id);

create table otp_challenge (
  id          uuid primary key,
  phone_e164  text not null,
  purpose     otp_purpose not null,
  code_hash   text not null,
  attempts    smallint not null default 0 check (attempts <= 5),
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
-- §9 "Key indexes": (phone_e164, purpose, created_at desc), for lookup and throttling.
create index otp_challenge_phone_purpose_idx on otp_challenge (phone_e164, purpose, created_at desc);

create table staff_profile (
  id              uuid primary key,
  user_id         uuid not null unique references user_account on delete restrict,
  staff_role      staff_role not null,
  totp_secret_enc bytea,
  mfa_enrolled_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table staff_permission (
  id         uuid primary key,
  staff_role staff_role not null,
  permission text not null, -- e.g. 'payout.approve'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (staff_role, permission)
);

create table guardian_profile (
  id          uuid primary key,
  user_id     uuid not null unique references user_account on delete restrict,
  locality_id uuid references locality on delete restrict,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index guardian_profile_locality_id_idx on guardian_profile (locality_id);

create table guardian_address (
  id                uuid primary key,
  guardian_id       uuid not null references guardian_profile on delete restrict,
  label             text not null default 'Home',
  address_enc       bytea not null,
  ghanapost_gps_enc bytea,
  location          geography(Point, 4326), -- used for distance only
  locality_id       uuid not null references locality on delete restrict,
  deleted_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index guardian_address_guardian_id_idx on guardian_address (guardian_id);
create index guardian_address_locality_id_idx on guardian_address (locality_id);

create table child_profile (
  id             uuid primary key,
  guardian_id    uuid not null references guardian_profile on delete restrict,
  first_name     text not null,
  class_level_id uuid not null references class_level on delete restrict,
  learning_goals text,
  deleted_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index child_profile_guardian_id_idx on child_profile (guardian_id);
create index child_profile_class_level_id_idx on child_profile (class_level_id);

create table child_subject (
  id         uuid primary key,
  child_id   uuid not null references child_profile on delete cascade,
  subject_id uuid not null references subject on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (child_id, subject_id)
);
create index child_subject_subject_id_idx on child_subject (subject_id);

create table consent_record (
  id             uuid primary key,
  user_id        uuid not null references user_account on delete restrict,
  child_id       uuid references child_profile on delete restrict,
  consent        consent_type not null,
  policy_version text not null,
  granted_at     timestamptz not null,
  withdrawn_at   timestamptz,
  ip             inet,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index consent_record_user_id_idx on consent_record (user_id);
create index consent_record_child_id_idx on consent_record (child_id);

-- Deferred foreign keys from 0003_platform (deviation flagged in the S1-04
-- task report): those columns were created without a reference because
-- 03-database.md §10's migration order runs platform tables (0003) before
-- identity tables (0004), even though both audit_log.actor_id and
-- config_setting.updated_by reference user_account.
alter table config_setting
  add constraint config_setting_updated_by_fkey
  foreign key (updated_by) references user_account on delete restrict;

alter table audit_log
  add constraint audit_log_actor_id_fkey
  foreign key (actor_id) references user_account on delete restrict;
