import { z } from "zod";

/**
 * Shape of GET /api/v1/health. Both apps import this, per 02-architecture.md
 * §1 ("Contracts: Zod schemas ... used by both apps"), so the response shape
 * cannot drift between the API and the web client silently.
 */
export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
