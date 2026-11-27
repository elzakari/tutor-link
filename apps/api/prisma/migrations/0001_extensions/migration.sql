-- 0001_extensions (03-database.md §1, §10 step 1)
--
-- Deviation from 03-database.md §10's "Initial migration order" (flagged in
-- the S1-04 task report, same pattern as the enum deviation below): that
-- table lists "Extensions and enum types" together under 0001. S1-04
-- (docs/orchestration/sprint-1.md) deliberately creates each enum type in
-- the migration that first uses it instead, so a migration is readable on
-- its own without jumping back to 0001 to see what its enum columns mean.
-- This migration therefore only adds extensions.
create extension if not exists postgis;
create extension if not exists citext;
create extension if not exists pgcrypto;
create extension if not exists btree_gist;
