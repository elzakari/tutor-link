import { newId } from "./new-id";

// RFC 9562 UUID v7: version nibble is 7, variant bits are 10xx.
const UUID_V7_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("newId", () => {
  it("returns a valid UUID v7", () => {
    const id = newId();

    expect(id).toMatch(UUID_V7_PATTERN);
  });

  it("does not reuse an id", () => {
    const ids = Array.from({ length: 1_000 }, () => newId());

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a non-decreasing timestamp prefix across rapid generation", () => {
    // UUID v7 only guarantees millisecond-level ordering (RFC 9562): two ids
    // generated in the same millisecond may have either random suffix
    // first, so this checks the sortable 48-bit timestamp prefix, not a
    // full lexical sort of the whole id.
    const timestampPrefixes = Array.from({ length: 1_000 }, () => newId().slice(0, 13));

    for (let i = 1; i < timestampPrefixes.length; i += 1) {
      expect(timestampPrefixes[i] >= timestampPrefixes[i - 1]).toBe(true);
    }
  });
});
