import { HealthResponseSchema, type HealthResponse } from "@tutor-link/contracts";

// Placeholder page for S1-01. Real screens arrive in S1-10. The import above
// is here to prove apps/web and apps/api share response shapes from
// packages/contracts (02-architecture.md §1), even before there is a page
// that actually calls the API.
const PLACEHOLDER_HEALTH: HealthResponse = HealthResponseSchema.parse({
  status: "ok",
});

export default function HomePage() {
  return (
    <main>
      <h1>Tutor Link</h1>
      <p>The app shell, navigation and real screens land in Sprint 1 tasks S1-09 and S1-10.</p>
      <p data-testid="health-placeholder">{PLACEHOLDER_HEALTH.status}</p>
    </main>
  );
}
