import { envSchema } from "./env.schema";
import { InvalidConfigError } from "./config.errors";

export interface AppConfig {
  readonly nodeEnv: "development" | "test" | "production";
  readonly port: number;
  readonly database: {
    readonly url: string;
  };
  readonly redis: {
    readonly url: string;
  };
  readonly storage: {
    readonly endpoint: string;
    readonly port: number;
    readonly useSsl: boolean;
    readonly region: string;
    readonly accessKey: string;
    readonly secretKey: string;
    readonly privateBucket: string;
    readonly publicBucket: string;
  };
  readonly mail: {
    readonly host: string;
    readonly port: number;
  };
}

/**
 * Parses `source` (normally `process.env`) against {@link envSchema} and
 * shapes it into a typed {@link AppConfig}. Throws {@link InvalidConfigError}
 * — listing every missing or invalid variable by name — rather than exiting
 * the process itself, so this stays unit-testable; `main.ts` is the only
 * caller that turns a thrown error into `process.exit(1)`.
 */
export function loadAppConfig(source: NodeJS.ProcessEnv): AppConfig {
  const result = envSchema.safeParse(source);

  if (!result.success) {
    const problems = result.error.issues.map((issue) => {
      const variable = issue.path.join(".") || "(unknown variable)";
      return `${variable}: ${issue.message}`;
    });
    throw new InvalidConfigError(problems);
  }

  const env = result.data;

  return {
    nodeEnv: env.NODE_ENV,
    port: env.PORT,
    database: { url: env.DATABASE_URL },
    redis: { url: env.REDIS_URL },
    storage: {
      endpoint: env.S3_ENDPOINT,
      port: env.S3_PORT,
      useSsl: env.S3_USE_SSL,
      region: env.S3_REGION,
      accessKey: env.S3_ACCESS_KEY,
      secretKey: env.S3_SECRET_KEY,
      privateBucket: env.S3_PRIVATE_BUCKET,
      publicBucket: env.S3_PUBLIC_BUCKET,
    },
    mail: { host: env.SMTP_HOST, port: env.SMTP_PORT },
  };
}
