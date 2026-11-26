import { z } from "zod";

// Everything the API needs to boot against the local dev services from
// infra/docker/docker-compose.yml (S1-02). Later tasks add their own
// required variables here as those features land — this file stays the
// single source of truth for "what process.env must contain".
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  REDIS_URL: z.string().min(1, "REDIS_URL is required"),

  S3_ENDPOINT: z.string().min(1, "S3_ENDPOINT is required"),
  S3_PORT: z.coerce.number().int().positive(),
  // NOT z.coerce.boolean(): that coerces via JS Boolean(), so the string
  // "false" (truthy, non-empty) would parse as true. z.stringbool() reads
  // the actual text ("true"/"false"/"1"/"0"/...).
  S3_USE_SSL: z.stringbool().default(false),
  S3_REGION: z.string().min(1).default("us-east-1"),
  S3_ACCESS_KEY: z.string().min(1, "S3_ACCESS_KEY is required"),
  S3_SECRET_KEY: z.string().min(1, "S3_SECRET_KEY is required"),
  S3_PRIVATE_BUCKET: z.string().min(1).default("tl-private"),
  S3_PUBLIC_BUCKET: z.string().min(1).default("tl-public-assets"),

  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().int().positive(),
});

export type Env = z.infer<typeof envSchema>;
