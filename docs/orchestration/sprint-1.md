# Sprint 1: Foundations (weeks 5–6)

**Sprint goal:** a working monorepo with CI, the database base, phone sign-in, staff sign-in with MFA, children profiles, the app shell with design tokens, and an installable PWA. Everything later builds on this sprint, so it favours correctness over speed.

**Requirements covered:** ACC-01, ACC-02, ACC-03, ACC-04, NFR-01, NFR-14 (and groundwork for NFR-03, NFR-07, NFR-08, NFR-11).

**Order and dependencies**

```
S1-01 → S1-02 → S1-03 → S1-04 → S1-05 → S1-06 → S1-07 → S1-08
                         S1-05 → S1-09 → S1-10 → S1-11 → S1-12
```

Run the tasks in this order. S1-09 can start once S1-05 is merged, in parallel with S1-06 to S1-08.

---

## S1-01

**Title:** Monorepo scaffold and tooling
**Model:** Strongest · **Plan first:** yes · **Branch:** `chore/S1-01-monorepo`
**Depends on:** nothing
**Read first:** `CLAUDE.md`; `docs/specs/02-architecture.md` sections 1, 3 and 4; `docs/specs/08-execution-plan.md` section 7

**Goal**
Create the Tutor Link monorepo so both apps build, lint and run, and module boundaries are enforced by tooling from day one.

**Do**
1. pnpm workspaces and Turborepo, pinned to the current Node.js LTS (`.nvmrc`, `engines`). Turbo pipelines: `build`, `dev`, `lint`, `typecheck`, `test`, `test:e2e`.
2. Workspaces:
   - `apps/web`: Next.js 16, App Router, TypeScript strict, one placeholder page.
   - `apps/api`: NestJS, TypeScript strict, global prefix `/api/v1`, and `GET /api/v1/health` returning `{ "status": "ok" }`.
   - `packages/contracts`: Zod, exported from `src/index.ts`.
   - `packages/ui`: an empty components entry point.
   - `packages/config`: shared ESLint flat config, `tsconfig.base.json` (strict, `noUncheckedIndexedAccess`), and Prettier config.
3. API module layout convention (document it in `apps/api/README.md`):
   ```
   apps/api/src/modules/<module>/
     index.ts            # the ONLY file other modules may import
     <module>.module.ts
     <module>.service.ts
     controllers/  repository/  dto/  events/  internal/
   ```
4. Enforce boundaries with ESLint (`eslint-plugin-boundaries` or `import/no-restricted-paths`): a file in module A may import from module B **only through `modules/B/index.ts`**. Apps may not import each other. Packages may not import apps.
5. Root scripts matching the Commands section of `CLAUDE.md`. Scripts whose targets don't exist yet (for example `db:migrate`) print "not yet implemented" and exit 0.
6. Husky and lint-staged (format and lint staged files), commitlint with Conventional Commits.
7. `.editorconfig`, `.gitignore` (including `.env*` except `.env.example`), and a short root `README.md` pointing to `CLAUDE.md`.

**Out of scope:** Docker, database, CI, any feature code.

**Acceptance criteria**
- [ ] `pnpm install && pnpm lint && pnpm typecheck && pnpm build` succeed from a clean clone.
- [ ] `pnpm dev` starts both apps; `curl localhost:<api-port>/api/v1/health` returns 200 `{"status":"ok"}`.
- [ ] A deliberate import of another module's `internal/` file fails lint. Show the ESLint output in the report, then remove the test import.
- [ ] A commit message without a Conventional Commit type is rejected.

**Tests to run:** `pnpm lint`, `pnpm typecheck`, `pnpm build`, plus a minimal Jest test for the health controller.

---

## S1-02

**Title:** Local environment and configuration
**Model:** Standard · **Plan first:** no · **Branch:** `chore/S1-02-local-env`
**Depends on:** S1-01
**Read first:** `docs/specs/02-architecture.md` section 9; `docs/specs/07-security-safeguarding.md` section 8 (Secrets, Environments)

**Goal**
One command gives every developer the same local services, and the API refuses to start with bad configuration.

**Do**
1. `infra/docker/docker-compose.yml` with:
   - PostgreSQL 16 with PostGIS (official `postgis/postgis` 16 image), plus a named volume.
   - Redis 7.
   - MinIO, plus a one-shot init container that creates private buckets `tl-private` and `tl-public-assets`.
   - Mailpit, for local email.
2. Root scripts `docker:up`, `docker:down` and `docker:reset` (reset wipes volumes, after asking for confirmation).
3. `apps/api/.env.example` and `apps/web/.env.example`, listing every variable with a one-line comment. No real secrets.
4. API config module: parse `process.env` with a Zod schema at boot. On failure, print which variables are missing or invalid and exit non-zero. Export a typed `AppConfig`.
5. Web: a typed env helper. Only `NEXT_PUBLIC_*` values reach the browser.
6. `docs/dev-setup.md`: clone → install → docker:up → env copy → dev, with troubleshooting for port clashes.

**Out of scope:** migrations, health checks of the database (S1-05), CI.

**Acceptance criteria**
- [ ] `pnpm docker:up` starts all four services; MinIO buckets exist and are private.
- [ ] Starting the API with a missing required variable exits with a clear message naming it.
- [ ] No `.env` file is committed; `git check-ignore` confirms it.

**Tests to run:** a unit test for the config schema (valid passes; missing value fails with the variable name).

---

## S1-03

**Title:** CI pipeline and pull request template
**Model:** Standard · **Plan first:** no · **Branch:** `chore/S1-03-ci`
**Depends on:** S1-02
**Read first:** `docs/specs/08-execution-plan.md` sections 7 and 8; `docs/specs/02-architecture.md` section 9 (Pipeline)

**Goal**
Every pull request is checked automatically, so nothing reaches `main` without passing lint, types and tests.

**Do**
1. GitHub Actions workflow `ci.yml`, running on pull requests and pushes to `main`:
   - Job `checks`: pnpm cache, install, `lint`, `typecheck`, unit `test`, `build`.
   - Job `api-integration`: service containers for PostGIS 16 and Redis 7. It runs `db:migrate` (a no-op until S1-04) and then the API integration tests.
   - Job `security`: `pnpm audit --prod` failing on high or critical, plus a secret scan (for example gitleaks).
   - Job `e2e`: present but skipped until S1-12 (`if: false`, with a comment).
2. Use the Turborepo cache so unchanged packages skip work.
3. `.github/pull_request_template.md` with: requirement IDs, summary, the definition-of-done checklist from `CLAUDE.md`, a "sensitive area touched?" checkbox, and a test evidence section.
4. `CODEOWNERS` placing the sensitive paths from `CLAUDE.md` under `@tech-lead` (a placeholder handle to replace).
5. In the report, list the branch protection settings the owner should turn on (required checks, 1 review, 2 reviews for CODEOWNERS paths, no force push).

**Out of scope:** deployment and staging (a later sprint).

**Acceptance criteria**
- [ ] The workflow runs green on this pull request.
- [ ] A pull request with a lint error fails `checks`. Demonstrate it on a throwaway commit, then revert.
- [ ] The secret scan catches a fake key in a test commit. Demonstrate it, then revert.

---

## S1-04

**Title:** Database foundation: identity, family, platform and reference tables
**Model:** Strongest · **Plan first:** yes · **Branch:** `feat/S1-04-db-foundation`
**Depends on:** S1-03
**Read first:** `docs/specs/03-database.md` sections 1, 3, 8, 9 and 10; `docs/specs/07-security-safeguarding.md` section 4

**Goal**
Create the first migrations, the Prisma schema and seed data for the tables Sprint 1 needs, with every database-level rule from the spec.

**Do**
1. Prisma in `apps/api`, with migrations in `apps/api/prisma/migrations`. Use **raw SQL migrations** where Prisma cannot express something.
2. Migrations, in order:
   - `0001_extensions`: `postgis`, `citext`, `pgcrypto`, `btree_gist`.
   - `0002_reference`: `region`, `district`, `locality` (geography centroid, `is_served`), `subject`, `class_level`, `curriculum`.
   - `0003_platform`: `organisation`, `config_setting`, `feature_flag`, `audit_log`, `outbox_event`.
   - `0004_identity_family`: `user_account`, `user_role`, `auth_session`, `otp_challenge`, `staff_profile`, `staff_permission`, `guardian_profile`, `guardian_address`, `child_profile`, `child_subject`, `consent_record`, with their enums.
   - Enums are created in the migration that first uses them. This is a deliberate deviation from the spec's "all enums in 0001", so the Phase 1 enums for later tables arrive with their tables. Say so in the report.
3. Copy columns, types, checks, uniques and foreign keys **exactly** from the spec. Standard columns `id uuid primary key`, `created_at timestamptz not null default now()` and `updated_at timestamptz not null default now()` go on every table. Add indexes on every foreign key.
4. Database roles: `infra/db/roles.sql` (run once per cluster, documented) creates `tl_migrator`, `tl_app` and `tl_readonly`. A grants migration gives `tl_app` **insert and select only** on `audit_log`, and `tl_readonly` no access to restricted tables (`guardian_address`, `child_profile`, `child_subject`, `consent_record`, `staff_profile`).
5. ID generation: a `newId()` helper producing UUID v7, used by every repository. Do not use database-side random UUIDs.
6. Seed script `pnpm db:seed` (idempotent):
   - The platform default organisation (`is_platform_default = true`).
   - All 16 regions of Ghana.
   - Districts and localities loaded from `infra/db/seed/localities.csv`. Ship a **small development sample** for Greater Accra, clearly marked `# DEV SAMPLE — replace with official list in Phase 0`.
   - Class levels: KG 1, KG 2, Basic 1–6, JHS 1–3, SHS 1–3, with `stage` and `sort_order`.
   - Subjects and curricula from `infra/db/seed/subjects.csv` and `curricula.csv` (development samples, marked the same way).
7. Make CI's `api-integration` job run the migrations against a fresh database.

**Out of scope:** tutor, booking, payment and other later tables; field encryption code (S3); the staff permission seed (S1-05).

**Acceptance criteria**
- [ ] Migrations run from empty to latest without errors, locally and in CI.
- [ ] `prisma migrate diff` shows no drift between the Prisma schema and the database.
- [ ] As `tl_app`, an `UPDATE audit_log` fails with a permission error (integration test).
- [ ] As `tl_readonly`, `SELECT` on `child_profile` fails (integration test).
- [ ] `child_profile` has **no** surname, photo, school or date-of-birth column (an integration test reads `information_schema`).
- [ ] The seed runs twice without duplicates.

**Tests to run:** migration integration tests, plus the constraint and grant tests above.

---

## S1-05

**Title:** API core: modules, guards, permissions, errors, logging, audit and outbox
**Model:** Strongest · **Plan first:** yes · **Branch:** `feat/S1-05-api-core`
**Depends on:** S1-04
**Read first:** `docs/specs/02-architecture.md` sections 4 and 7; `docs/specs/05-rbac.md` sections 1, 2, 4, 7 and 9; `docs/specs/07-security-safeguarding.md` section 8

**Goal**
Build the API's backbone so every later feature is secure by default: deny-by-default permissions, ownership scoping, one error format, safe logs, audit and outbox.

**Do**
1. **Module skeletons**, each with `index.ts`, for: identity-access, verification, tutor-profiles, discovery, booking, sessions-safety, payments-ledger, learning, reviews, messaging, admin-audit, marketplace, classroom.
2. **Permission codes:** in `packages/contracts/src/permissions.ts`, define every permission code from `05-rbac.md` section 4 as a typed constant, with the role-to-permission matrix as data (`✓`, `R`, `M` and `2` encoded explicitly). Add a seed step writing the matrix into `staff_permission`.
3. **Guards, in this order:** request ID → rate limit (Redis-backed, with a default per-IP limit) → authentication (a stub that S1-06 completes) → permission guard.
   - The permission guard is **global and deny-by-default**. A route must carry `@Public()` or `@RequirePermission(code)` (or a user-role decorator `@RequireUserRole('guardian')`), or it returns 403.
   - Add `@Sensitive()` for routes whose refusals must be audited.
4. **Ownership pattern:** a repository base requiring an `Actor` (`{ userId, roles, staffRole? }`) on every query method. Provide `assertFoundOrNotFound()`, which returns **404** for records the actor may not see. Document the pattern in `apps/api/README.md` with an example.
5. **Errors:** a global exception filter producing `{ error: { code, message, details } }`. Add a Zod validation pipe that uses schemas from `packages/contracts` and **rejects unknown fields**.
6. **Logging:** pino JSON logs with request ID. Redact `authorization`, `cookie`, `set-cookie`, and any key matching `otp|code|token|password|secret|address|accountNumber|body` (message bodies). Unit-test the redaction.
7. **Audit:** `AuditService.record(tx, { actorId, action, targetType, targetId, reason, metadata })`, written inside the caller's transaction. A helper `withTx(fn)` wraps Prisma interactive transactions. Refusals on `@Sensitive()` routes are audited by the guard.
8. **Outbox:** `OutboxService.add(tx, { type, payload })`, plus a worker entry `apps/api/src/worker.ts` that polls unpublished events every second, publishes them to BullMQ with `jobId = event.id` (dedupe) and marks them published. Add a base consumer class that records processed event IDs for idempotency.
9. **Health:** `/api/v1/health` (liveness) and `/api/v1/health/ready` (checks the database and Redis).
10. **OpenAPI** at `/api/docs`, outside production only, generated from the Zod contracts.

**Out of scope:** sign-in logic (S1-06), any business endpoint.

**Acceptance criteria**
- [ ] A test controller with **no** decorator returns 403 on every route.
- [ ] `@Public()` routes work without a session; `@RequirePermission('x')` returns 403 for a user lacking `x`.
- [ ] A request with an unknown field returns 400 with code `VALIDATION_FAILED`.
- [ ] Log redaction test: none of the sensitive keys appear in output.
- [ ] Outbox test: an event written in a transaction that rolls back is never published; a committed one is published exactly once even if the publisher runs twice.
- [ ] `/health/ready` returns 503 when Redis is down (integration test).
- [ ] ESLint boundaries still pass.

**Tests to run:** unit and integration tests for all of the above.

---

## S1-06

**Title:** Phone OTP sign-up and sign-in, sessions and user roles
**Model:** Strongest · **Plan first:** yes · **Branch:** `feat/S1-06-otp-auth`
**Depends on:** S1-05
**Requirements:** ACC-01, ACC-02 · **Screens served:** SCR-AUTH-01 to 04
**Read first:** `docs/specs/01-prd.md` section 4.1 and the business rules in section 5; `docs/specs/02-architecture.md` section 7; `docs/specs/05-rbac.md` section 3; `docs/specs/07-security-safeguarding.md` section 8 (Sessions, OTP)

**Goal**
Users sign up and sign in with their phone number and a one-time code, hold several roles on one account, and stay signed in safely.

**Do**
1. **Phone numbers:** normalise Ghanaian numbers to E.164 (`024 123 4567`, `0241234567` and `+233241234567` → `+233241234567`). Reject anything else with a clear error code.
2. **Endpoints** (contracts in `packages/contracts`):
   - `POST /auth/otp/request` `{ phone, purpose: 'signup' | 'login' }` → always 202 with the same body, so the response never reveals whether an account exists.
   - `POST /auth/otp/verify` `{ phone, code, purpose, fullName?, consents? }` → on signup, creates `user_account` and records `consent_record` rows for `terms` and `privacy` with `policy_version`. Sets session cookies.
   - `POST /auth/refresh`, `POST /auth/logout`, `GET /me` (profile and roles).
   - `POST /me/roles` `{ role: 'guardian' | 'tutor' }` adds a role. Creating the guardian role also creates `guardian_profile`. Seller and staff roles cannot be self-assigned.
3. **OTP rules:** 6 digits from a CSPRNG, stored as HMAC-SHA256 with a server secret, valid 5 minutes, at most 5 attempts, at most 3 sends per number per hour, plus a per-IP limit. Use constant-time comparison.
4. **SMS adapter:** `SmsSender` interface in the messaging module.
   - `ConsoleSmsSender` for development and test only. It logs "DEV ONLY" and the code, and **refuses to load when `NODE_ENV=production`**.
   - Leave a `TODO` provider class for the real gateway.
5. **Sessions:**
   - Access token: a JWT valid 15 minutes, with a `kid` header so keys can rotate.
   - Refresh token: 256-bit random, stored **hashed** in `auth_session` with a `family_id`. Rotate it on every refresh. **Reuse of an old refresh token revokes the whole family.**
   - Cookies: `httpOnly`, `Secure` (except on localhost), `SameSite=Lax`; the refresh cookie path is `/api/v1/auth`.
   - CSRF: double-submit. A readable `tl_csrf` cookie plus an `X-TL-CSRF` header are required on every state-changing request.
6. **Authentication guard** (completing the S1-05 stub): resolves the `Actor` from the access token. Suspended users may only call read-only routes on their own data (`05-rbac.md` section 3).
7. Update `last_login_at`. Audit sign-in failures above the threshold.

**Out of scope:** staff sign-in (S1-07), changing phone numbers, the real SMS provider, UI.

**Acceptance criteria**
- [ ] ACC-01: a new user completes sign-up through the API in one request pair, and `consent_record` holds terms and privacy rows.
- [ ] ACC-02: a tutor adds the guardian role without a second account, and `/me` lists both roles.
- [ ] A 6th wrong code is refused even with the right code. A 4th send within an hour returns 429.
- [ ] Refresh rotation works, and reusing an old refresh token revokes the session family (test).
- [ ] A state-changing request without the CSRF header returns 403.
- [ ] No OTP or token appears in any log line (test captures logs).
- [ ] `ConsoleSmsSender` cannot be constructed with `NODE_ENV=production` (test).

**Tests to run:** unit tests for normalisation and the OTP service; API integration tests for every endpoint and rule above.

---

## S1-07

**Title:** Staff sign-in with mandatory TOTP and the first Super Admin
**Model:** Strongest · **Plan first:** yes · **Branch:** `feat/S1-07-staff-auth`
**Depends on:** S1-06
**Requirements:** ACC-04
**Read first:** `docs/specs/05-rbac.md` sections 4 and 8; `docs/specs/07-security-safeguarding.md` section 8

**Goal**
Staff sign in to a separate console flow with email, password and an authenticator app. Nobody reaches staff routes without MFA.

**Do**
1. `POST /staff/auth/login` `{ email, password }` → returns `mfa_required`, or `mfa_enrolment_required` for first sign-in. `POST /staff/auth/mfa/verify` `{ code }` issues a staff session.
2. Passwords hashed with argon2id. Minimum 12 characters, checked against a common-password list.
3. TOTP secrets encrypted at rest (`staff_profile.totp_secret_enc`) using a key from configuration. Enrolment returns an `otpauth://` URI for a QR code.
4. Staff sessions last at most 8 hours, lock after 15 minutes idle, and use the same cookie and CSRF rules as users, under a separate cookie name.
5. The permission guard reads `staff_permission` for the staff member's role (seeded in S1-05).
6. CLI `pnpm staff:create --email --name --role` creates a staff account and prints a one-time enrolment link valid 24 hours, in development and staging only. Record in the report that production staff creation must use the two-Super-Admin approval flow (built in Sprint 5).
7. Audit: staff sign-ins, failures, MFA enrolment and role changes.
8. Lock the account after 5 failed sign-ins in 15 minutes; alert through a log event `security.staff_lockout`.

**Out of scope:** the admin console UI (S1-10 only adds the sign-in screens), the approvals service (Sprint 5), break-glass procedures.

**Acceptance criteria**
- [ ] ACC-04: a staff sign-in without a valid TOTP code is rejected, and staff routes return 401 without a staff session.
- [ ] The TOTP secret is never returned after enrolment and is encrypted in the database (test reads the raw column).
- [ ] An idle staff session expires after 15 minutes (test with a fake clock).
- [ ] Lockout after 5 failures (test).
- [ ] A user session cannot call staff routes, and a staff session cannot call user-only routes.

**Tests to run:** integration tests for every rule above.

---

## S1-08

**Title:** Guardian children profiles and per-child consent
**Model:** Strongest (children's data) · **Plan first:** no · **Branch:** `feat/S1-08-children`
**Depends on:** S1-07
**Requirements:** ACC-03 · **Screens served:** SCR-GRD-02
**Read first:** `docs/specs/01-prd.md` sections 4.1 and 5 (Children's data); `docs/specs/03-database.md` section 3; `docs/specs/07-security-safeguarding.md` sections 4 and 6

**Goal**
A guardian manages several children with only the minimum data, and gives recorded consent for each child.

**Do**
1. Endpoints (guardian role required, scoped to the actor's own guardian profile):
   - `GET /me/children`
   - `POST /me/children` `{ firstName, classLevelId, subjectIds[], learningGoals?, consent: { policyVersion, accepted: true } }`. This writes a `consent_record` of type `guardian_for_child` **in the same transaction**.
   - `PATCH /me/children/:id`, `DELETE /me/children/:id` (soft delete).
2. The Zod contract **rejects** any extra field. Tests specifically send `surname`, `dateOfBirth`, `school` and `photo`, and expect 400.
3. `firstName`: 1–40 characters, trimmed, letters, spaces, hyphens and apostrophes only.
4. Limit 10 active children per guardian (configurable via `config_setting`).
5. Another guardian's child ID returns **404**.
6. Audit create, update and delete. Never log `learningGoals` or names.

**Out of scope:** addresses (S3), sharing records with tutors (Sprint 6).

**Acceptance criteria**
- [ ] ACC-03: a guardian adds 3 children, each with class level and subjects.
- [ ] Creating a child without consent → 400. The consent row exists for each child created.
- [ ] Forbidden fields → 400 (test per field).
- [ ] Cross-guardian access → 404 for read, update and delete.

**Tests to run:** API integration tests for all of the above.

---

## S1-09

**Title:** Web app shell, design tokens and component base
**Model:** Standard · **Plan first:** yes · **Branch:** `feat/S1-09-web-shell`
**Depends on:** S1-05 (can run in parallel with S1-06 to S1-08)
**Read first:** `docs/specs/04-ui-ux.md` sections 1, 2, 3, 8 and 10; `docs/specs/02-architecture.md` section 3

**Goal**
Build the frame every screen lives in: tokens, navigation for each role on phone and desktop, the Tuition | Marketplace switch, and the basic components.

**Do**
1. **Tokens:** add every colour, type, spacing, radius and motion token from `04-ui-ux.md` section 2 as CSS variables in `packages/ui`, mapped into Tailwind v4. Use the system font stack. Honour reduced motion.
2. **shadcn/ui** initialised into `packages/ui`, with base components (Button, Input, OTP input, Select, Dialog, Sheet, Tabs, Toast, Skeleton, Avatar, Badge).
3. **Route groups** in `apps/web/app`: `(public)`, `(auth)`, `(guardian)`, `(tutor)`, `(admin)`, `(marketplace)`, each with its own layout.
4. **Navigation** per `04-ui-ux.md` section 3:
   - A bottom bar on phone (under 1024 px) and a left sidebar on desktop (1024 px and up).
   - Tabs per role exactly as specified (guardian, tutor, marketplace buyer, seller); a sidebar only for admin.
   - A header **Tuition | Marketplace** switch. When the `marketplace` feature flag is off, the Marketplace side shows a friendly "coming soon" page.
   - A role switcher in the profile menu.
5. **Shared components:** `OfflineBanner` (online/offline from `navigator.onLine` plus events), `EmptyState`, page skeletons, and a 44 px minimum tap target utility.
6. **Formatting helpers** in `packages/ui` (or `packages/contracts`) with unit tests:
   - `formatCedis(pesewas)` → `GH₵ 1,200.00`, and `GH₵ 150` for whole amounts in lists.
   - `formatPhone('+233241234567')` → `+233 24 123 4567`.
   - Dates in Africa/Accra time, 12-hour, for example `Tue 17 Nov 2026, 4:30 pm`.
7. **i18n:** all strings in `messages/en-GB.json` (next-intl, or equivalent), with UK English and the voice rules from section 10.
8. **Data layer:** a TanStack Query provider and an API client typed from `packages/contracts`, sending `credentials: 'include'` and the `X-TL-CSRF` header. Handle 401 with one silent refresh, then redirect to sign-in.
9. **Storybook** for `packages/ui`, with stories for each component state.

**Out of scope:** real feature screens (placeholders only), the PWA (S1-11), sign-in screens (S1-10).

**Acceptance criteria**
- [ ] At 360 px wide the bottom bar shows the correct tabs per role. At 1280 px the sidebar shows instead.
- [ ] The Marketplace switch respects the feature flag.
- [ ] Formatter unit tests pass, including 0, 1 pesewa and large amounts.
- [ ] No string literal appears in JSX outside the translation files (lint rule or test).
- [ ] An axe accessibility scan of the shell pages finds no critical issues.

**Tests to run:** component tests (Vitest and Testing Library), formatter tests, Storybook build.

---

## S1-10

**Title:** Sign-in, role and children screens, and staff sign-in screens
**Model:** Standard · **Plan first:** no · **Branch:** `feat/S1-10-auth-screens`
**Depends on:** S1-06, S1-07, S1-08, S1-09
**Requirements:** ACC-01 to ACC-04 (UI) · **Screens:** SCR-AUTH-01 to 04, SCR-GRD-02, SCR-SHR-04 (role switch part only)
**Read first:** `docs/specs/04-ui-ux.md` sections 3, 6.1 steps 1–2, 6.2 step 1, and 10; the matching API contracts

**Goal**
People can sign up, sign in, pick and switch roles, and manage children on a phone. Staff can sign in to the console with MFA.

**Do**
1. **Phone entry** (SCR-AUTH-01): local or +233 input with live formatting, and a clear error on invalid numbers.
2. **OTP entry** (SCR-AUTH-02): six boxes, paste support, `autocomplete="one-time-code"`, resend countdown, and plain-English errors for wrong code, too many tries and too many sends.
3. **Choose role** (SCR-AUTH-03) and **consent** (SCR-AUTH-04): terms and privacy links (placeholder legal pages), with an explicit tick box. Nothing is pre-ticked.
4. **Children** (SCR-GRD-02): list, add and edit form (first name, class level, subjects, goals), with the guardian consent statement and tick box. Show the "we only keep…" privacy note.
5. **Role switch** in the profile menu, and an "Add a role" flow.
6. **Staff console:** sign-in at `/admin/sign-in` (email, password), TOTP step, and first-time enrolment with a QR code. Use a separate layout with no user navigation.
7. Route protection: unsigned users are sent to sign-in. A user session reaching `(admin)` is sent away, and vice versa.
8. Every state: loading skeletons, offline (the form is disabled and shows "Needs a connection"), and errors.

**Out of scope:** search, booking and tutor screens; the PWA install prompt (S1-11).

**Acceptance criteria**
- [ ] A new guardian signs up and adds a child in under 2 minutes on a throttled "Fast 3G" profile (measure and report).
- [ ] All screens work at 360 px and 1280 px, with keyboard use and screen-reader labels.
- [ ] No consent box is pre-ticked.
- [ ] Staff cannot reach any console page without completing TOTP.

**Tests to run:** component tests for each screen state. The end-to-end tests come in S1-12.

---

## S1-11

**Title:** PWA: install, offline shell and safe caching
**Model:** Standard (caching rules reviewed by the tech lead) · **Plan first:** yes · **Branch:** `feat/S1-11-pwa`
**Depends on:** S1-10
**Requirements:** NFR-01, groundwork for NFR-03 and MSG-04 · **Screens:** SCR-SHR-05, SCR-SHR-06
**Read first:** `docs/specs/04-ui-ux.md` sections 6.5 and 9 (Offline and PWA); `docs/specs/02-architecture.md` section 3 (PWA layer); `docs/specs/07-security-safeguarding.md` section 8 (PWA cache)

**Goal**
Tutor Link installs like an app on Android and iPhone, opens offline to a useful shell, and **never stores sensitive data in the browser cache**.

**Do**
1. **Serwist** with the Next.js 16 Turbopack integration (check the current Serwist docs for the Turbopack setup).
2. **Manifest:** name "Tutor Link", short name, colours from the tokens, `display: standalone`, `start_url: /`, and icons at 192, 512 and maskable sizes (placeholders, marked for the brand designer).
3. **Caching policy**, written as one reviewed config file with comments:
   - Precache the app shell and static assets.
   - Public pages: stale-while-revalidate.
   - API: **network-only by default**. Network-first with a fallback applies only to an explicit allow-list (empty for now, with a documented way to add endpoints such as `/me/lessons` later).
   - Never cache auth, payments, identity, addresses, messages or recordings. Add a test that fails if any of these path patterns enters the allow-list.
4. **Sign-out clears** every cache and IndexedDB store the app created.
5. **Offline fallback page** (SCR-SHR-06), plus the `OfflineBanner` from S1-09.
6. **Updates:** show an "Update available" toast with a reload button. A `useCriticalFlow()` hook blocks the reload prompt during payment or check-in flows.
7. **Install:**
   - Android: capture `beforeinstallprompt` and show the custom Install button only after a first meaningful action (for example, adding a child).
   - iOS: in Safari, when not running standalone, show the three-step guide card (SCR-SHR-05) at most once a week, and never once installed.
8. Web push is **out of scope** (Sprint 5), but leave a placeholder in the service worker.

**Acceptance criteria**
- [ ] Lighthouse reports the app as installable. Report its PWA checks and performance score at mobile throttling.
- [ ] With the network off, a previously visited app opens to the shell and the offline page.
- [ ] The cache test proves that sensitive path patterns can never be cached.
- [ ] After sign-out, cache storage and IndexedDB hold no user data (Playwright check in S1-12).
- [ ] The first-load JavaScript for the sign-in page is under the 200 KB budget. Report the actual size.

**Tests to run:** the cache-policy unit test and a Lighthouse CI run.

---

## S1-12

**Title:** Sprint 1 end-to-end tests and the access-control matrix harness
**Model:** Standard · **Plan first:** no · **Branch:** `test/S1-12-e2e-harness`
**Depends on:** S1-11
**Read first:** `docs/specs/05-rbac.md` section 9 (Tests that must pass); `docs/specs/08-execution-plan.md` section 8

**Goal**
Lock Sprint 1's behaviour in with end-to-end tests, and build the harness that checks every future route against the permission matrix automatically.

**Do**
1. **Playwright** with two projects: mobile (Pixel-class viewport, Fast 3G throttling) and desktop (1280 px). It runs against the local stack in CI (enable the `e2e` job from S1-03).
   - Use the test-only `ConsoleSmsSender` and a test endpoint, **enabled only when `NODE_ENV=test`**, to read the last OTP.
2. **End-to-end journeys:**
   - A guardian signs up, accepts consents, adds a child, signs out and signs in again.
   - A tutor signs up and adds the guardian role; the role switch changes the navigation.
   - A staff member signs in with TOTP (generated in the test with `otplib`) and reaches the console.
   - After sign-out, cache storage and IndexedDB hold no user data.
3. **Route audit test:** read all registered Nest routes and fail if any lacks `@Public`, `@RequirePermission` or `@RequireUserRole`.
4. **Permission matrix test:** for every staff route, call it as each staff role and compare the result with the matrix in `packages/contracts/src/permissions.ts`. Table-driven, so new routes are covered automatically.
5. **Ownership helper** for future tests: `expectNotFoundForOtherUser(route, setupA, setupB)`.

**Acceptance criteria**
- [ ] All journeys pass on mobile and desktop in CI.
- [ ] The route audit test fails when an undecorated route is added. Demonstrate it, then revert.
- [ ] The matrix test runs in CI and passes.

**Tests to run:** `pnpm test:e2e` and the API test suite.

---

## Sprint 1 review checklist (for the orchestrator)

When all Sprint 1 reports are in, paste them to the orchestrator in one message. The review checks:
- Every acceptance box above, with evidence.
- Any deviation from the specs, such as enum placement or class level names, so the specs can be updated.
- Open questions, which feed the Sprint 2 prompts: tutor profiles, KYC adapter, credentials, verification queue.
