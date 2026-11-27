import { Client } from "pg";

// CLAUDE.md safety rules 1-2 / 03-database.md §3: child_profile holds only
// first name, class level, subjects and goals — never a surname, photo,
// school name, date of birth or national ID.
describe("child_profile column shape (CLAUDE.md rules 1-2, 03-database.md §3)", () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it("has no surname, photo, school, date-of-birth or national-id column", async () => {
    const { rows } = await client.query(
      `select column_name from information_schema.columns
       where table_schema = 'public' and table_name = 'child_profile'`,
    );
    const columnNames = rows.map((row: { column_name: string }) => row.column_name.toLowerCase());
    const forbiddenSubstrings = [
      "surname",
      "last_name",
      "photo",
      "school",
      "dob",
      "date_of_birth",
      "birth_date",
      "national_id",
      "ghana_card",
      "biometric",
    ];

    for (const forbidden of forbiddenSubstrings) {
      expect(columnNames.some((name) => name.includes(forbidden))).toBe(false);
    }
  });

  it("has exactly the columns the spec lists", async () => {
    const { rows } = await client.query(
      `select column_name from information_schema.columns
       where table_schema = 'public' and table_name = 'child_profile'`,
    );
    const columnNames = rows.map((row: { column_name: string }) => row.column_name).sort();

    expect(columnNames).toEqual(
      [
        "id",
        "guardian_id",
        "first_name",
        "class_level_id",
        "learning_goals",
        "deleted_at",
        "created_at",
        "updated_at",
      ].sort(),
    );
  });
});
