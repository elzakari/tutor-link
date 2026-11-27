-- 0002_reference (03-database.md §8, §9, §10 step 2)
-- Standard columns (id uuid primary key, created_at, updated_at — §1) and
-- foreign-key indexes (§9 "Always indexed") are added on every table; they
-- are not repeated in the spec's SQL blocks, per that section's convention.
create table region (
  id uuid primary key,
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table district (
  id uuid primary key,
  region_id uuid not null references region on delete restrict,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (region_id, name)
);
create index district_region_id_idx on district (region_id);

create table locality (
  id uuid primary key,
  district_id uuid not null references district on delete restrict,
  name text not null,
  centroid geography(Point, 4326),
  is_served boolean not null default false, -- pilot service areas (§8)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (district_id, name)
);
create index locality_district_id_idx on locality (district_id);
-- §9 "Key indexes": GiST on locality.centroid, for area lookup.
create index locality_centroid_gix on locality using gist (centroid);

create table subject (
  id uuid primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table class_level (
  id uuid primary key,
  name text not null unique, -- 'Basic 6', 'JHS 3', 'SHS 2'
  stage text not null, -- 'kg', 'primary', 'jhs', 'shs'
  sort_order smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table curriculum (
  id uuid primary key,
  name text not null unique, -- 'GES / NaCCA', 'Cambridge', ...
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
