import { z } from "zod";

// Next.js inlines a literal `process.env.NEXT_PUBLIC_*` reference into the
// browser bundle at build time; every other variable resolves to
// `undefined` client-side even if the code tries to read it. These two
// schemas mirror that split so it is explicit in code, not just convention
// (CLAUDE.md "Web: a typed env helper. Only NEXT_PUBLIC_* values reach the
// browser.").

const publicEnvSchema = z.object({
  // Browser calls the API directly at this URL.
  NEXT_PUBLIC_API_BASE_URL: z.string().url("NEXT_PUBLIC_API_BASE_URL must be a valid URL"),
});

const serverEnvSchema = z.object({
  // Server Components / Route Handlers / Server Actions call the API at
  // this URL. Deliberately not NEXT_PUBLIC_-prefixed.
  API_INTERNAL_URL: z.string().url("API_INTERNAL_URL must be a valid URL"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

export class InvalidWebEnvError extends Error {
  constructor(
    public readonly scope: "public" | "server",
    public readonly problems: readonly string[],
  ) {
    super(
      [
        `Invalid ${scope} environment configuration:`,
        ...problems.map((problem) => `  - ${problem}`),
      ].join("\n"),
    );
    this.name = "InvalidWebEnvError";
  }
}

function parse<Schema extends z.ZodType>(
  schema: Schema,
  source: NodeJS.ProcessEnv,
  scope: "public" | "server",
): z.infer<Schema> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const problems = result.error.issues.map(
      (issue) => `${issue.path.join(".") || "(unknown variable)"}: ${issue.message}`,
    );
    throw new InvalidWebEnvError(scope, problems);
  }
  return result.data;
}

let cachedPublicEnv: PublicEnv | undefined;

/** Safe to call from Client Components. */
export function getPublicEnv(): PublicEnv {
  cachedPublicEnv ??= parse(publicEnvSchema, process.env, "public");
  return cachedPublicEnv;
}

let cachedServerEnv: ServerEnv | undefined;

/**
 * Server Components, Route Handlers and Server Actions only. Throws if
 * somehow called in the browser, rather than silently returning
 * `undefined`-filled values.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called in the browser.");
  }
  cachedServerEnv ??= parse(serverEnvSchema, process.env, "server");
  return cachedServerEnv;
}
