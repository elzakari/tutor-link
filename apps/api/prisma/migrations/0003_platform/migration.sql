-- 0003_platform (03-database.md §8, §9, §10 step 3)
create type organisation_type as enum ('platform','school','agency','ngo','sponsor');

create table organisation (
  id uuid primary key,
  name text not null,
  type organisation_type not null,
  is_platform_default boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table config_setting (
  id uuid primary key,
  key text not null unique, -- 'commission.home_tuition_bps', 'cancel.notice_hours'
  value jsonb not null,
  -- FK to user_account added by 0004_identity_family (ALTER TABLE), because
  -- user_account does not exist yet in migration order — see that
  -- migration's trailing comment and the S1-04 task report.
  updated_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index config_setting_updated_by_idx on config_setting (updated_by);

create table feature_flag (
  id uuid primary key,
  key text not null unique,
  enabled boolean not null default false,
  rules jsonb, -- regions, organisations, percentage
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audit_log (
  id uuid primary key,
  -- FK to user_account added by 0004_identity_family; null for system actions.
  actor_id uuid,
  action text not null, -- 'payout_account.approve'
  target_type text not null,
  target_id uuid,
  reason text,
  metadata jsonb,
  ip inet,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- §9 "Key indexes": (target_type, target_id), (actor_id, occurred_at desc).
-- The actor index also satisfies §1's "every foreign key" index rule once
-- 0004_identity_family adds audit_log.actor_id's deferred FK.
create index audit_log_target_idx on audit_log (target_type, target_id);
create index audit_log_actor_occurred_idx on audit_log (actor_id, occurred_at desc);

create table outbox_event (
  id uuid primary key,
  type text not null, -- 'booking.confirmed'
  payload jsonb not null,
  occurred_at timestamptz not null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- §9 "Key indexes": partial on occurred_at where published_at is null.
create index outbox_event_unpublished_idx on outbox_event (occurred_at) where published_at is null;
