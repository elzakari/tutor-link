import { randomBytes } from "node:crypto";

/**
 * Generate a sortable UUID v7 (RFC 9562) in application code.
 *
 * 03-database.md §1 and S1-04 require every repository to use this helper,
 * never database-side random UUID functions, so ids sort by creation time
 * and callers always know the id before an INSERT starts.
 *
 * Implemented in-house rather than with the `uuid` npm package: as of
 * `uuid@14`, that package is ESM-only (no CommonJS build), which breaks
 * under ts-jest's CommonJS transform (`require("uuid")` fails with
 * "Must use import to load ES Module"). The algorithm itself is a dozen
 * lines, so a dependency-free implementation avoids module-interop
 * fragility entirely. apps/api/scripts/db-seed.mjs (plain ESM, no bundler)
 * has its own copy for the same reason — see that file's comment.
 */
export function newId(): string {
  const bytes = randomBytes(16);
  const unixTsMs = BigInt(Date.now());

  bytes[0] = Number((unixTsMs >> 40n) & 0xffn);
  bytes[1] = Number((unixTsMs >> 32n) & 0xffn);
  bytes[2] = Number((unixTsMs >> 24n) & 0xffn);
  bytes[3] = Number((unixTsMs >> 16n) & 0xffn);
  bytes[4] = Number((unixTsMs >> 8n) & 0xffn);
  bytes[5] = Number(unixTsMs & 0xffn);

  // Non-null assertions: Buffer indices 0-15 are always defined on a
  // 16-byte buffer; `noUncheckedIndexedAccess` cannot see that statically.
  bytes[6] = (bytes[6]! & 0x0f) | 0x70; // version 7
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant 10

  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}
