# Tutor Link: instructions for Claude Code

Tutor Link is a Ghanaian education platform delivered as one installable web app (PWA), with two sides under one account:
- **Tuition:** families find, book and pay verified tutors for home or online lessons.
- **Marketplace:** teachers buy and sell lesson notes, lesson plans, schemes of learning and assessments.

It handles children's data, home addresses and money, so **safety and correctness come before speed**.

## Source of truth

The specifications live in `docs/specs/`. Read the relevant ones before every task, and quote requirement IDs from them.

| File | Use it for |
| --- | --- |
| `docs/specs/01-prd.md` | Requirements with IDs (ACC, VER, DIS, BKG, SES, PAY, LRN, REV, MSG, ADM, MKT, VID, NFR) and acceptance tests |
| `docs/specs/02-architecture.md` | Modules, stack, flows, integrations |
| `docs/specs/03-database.md` | Tables, constraints, indexes, migrations, retention |
| `docs/specs/04-ui-ux.md` | Tokens, navigation, journeys, screen IDs (SCR-*), components |
| `docs/specs/05-rbac.md` | Roles, permission codes, approvals, audit |
| `docs/specs/06-financial.md` | Commission, wallet, payouts, ledger postings |
| `docs/specs/07-security-safeguarding.md` | Safeguarding rules, data classes, security controls |
| `docs/specs/08-execution-plan.md` | Sprints, quality gates, standards |

If a task conflicts with a spec, **stop and report the conflict**. Never silently choose.

## Stack

- Monorepo: pnpm workspaces and Turborepo, on the current Node.js LTS.
- `apps/web`: Next.js 16 (App Router), React, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, React Hook Form, Serwist (Turbopack integration) for the PWA.
- `apps/api`: NestJS modular monolith, REST under `/api/v1`, OpenAPI, Prisma plus raw SQL migrations, BullMQ on Redis, Socket.IO.
- `packages/contracts`: Zod schemas and shared types, plus permission codes. **Both apps import request and response shapes from here.**
- `packages/ui`: design tokens and shared components.
- `packages/config`: shared ESLint, TypeScript and Prettier config.
- Data: PostgreSQL 16 with PostGIS, `citext`, `pgcrypto` and `btree_gist`; Redis; S3-compatible storage (MinIO locally).
- Integrations, each behind an adapter interface with a mock: Paystack, a KYC provider, LiveKit, SMS, WhatsApp, Web Push, email.

## Commands

```bash
pnpm install
pnpm dev                 # web and api
pnpm docker:up           # postgres, redis, minio, mailpit
pnpm db:migrate          # prisma migrate plus raw SQL
pnpm db:seed
pnpm lint && pnpm typecheck
pnpm test                # unit and API tests
pnpm test:e2e            # Playwright
```

Keep this list accurate. If you add or rename a script, update this section in the same change.

## Non-negotiable rules

### Safety and privacy
1. **Never** add a field, upload or prompt for Ghana Card images, full ID numbers, biometrics, or children's photos, surnames, schools or dates of birth.
2. Child profiles hold only first name, class level, subjects and goals.
3. A guardian's home address is released to a tutor only for a **paid home booking**. It is never public, never in logs, and never in the PWA cache.
4. Messages in a child's conversation are always visible to the guardian.
5. No chat without a request or booking. No contact details exchanged in-app without being flagged.
6. Recording is off by default. It is enabled only by guardian consent, and recordings expire after 30 days.

### Access control
7. **Deny by default.** Every API route declares `@RequirePermission(...)` or is explicitly marked public. A global guard rejects anything else.
8. **Ownership in every query.** Repository functions take the current user and scope the query. A record that is not yours returns **404**, not 403.
9. Staff can never act on records involving their own user account.
10. Actions listed in `05-rbac.md` section 5 go through the approval service. Never bypass it.

### Money
11. Store money as integer **pesewas** (`bigint`, `_pesewas` suffix). Store rates in basis points (`_bps`). Never use floats.
12. Every money movement posts a balanced **double-entry ledger transaction** with an idempotency key **before** any balance changes. Ledger and audit tables are insert-only.
13. Payment status comes only from **verified webhooks plus a provider verify call**, never from the browser.
14. Commission and price are **copied at purchase or booking time**.

### Data and schema
15. Migrations must be backward compatible: expand, backfill, then contract. Never edit an applied migration.
16. Raw SQL is used for PostGIS, exclusion constraints, triggers, partial indexes and grants. Prisma models must match it.
17. Personal data tables get `deleted_at`. Purging happens through the retention job.

### Code quality
18. TypeScript strict mode everywhere. No `any` without a comment explaining why.
19. A module never imports another module's internals. Modules talk through services and domain events (outbox).
20. Every outside service goes through its adapter. Provider field names never leak into modules.
21. No secrets in code, tests or logs. Use `.env` (never committed) and `.env.example`.
22. Logs never contain OTPs, tokens, card or account numbers, addresses or message bodies.

## How to work on a task

Never commit to main. Always work on the task's branch; main only changes through a reviewed merge.

1. **Read** the task prompt, the spec sections it names, and the existing code it touches.
2. **Plan** first. For anything over about 3 files, present a short plan (files, approach, tests) and wait for approval if the prompt says "plan first".
3. **Write or update the tests first** for business rules: acceptance tests from the PRD, ownership and permission tests.
4. **Implement** in small, reviewable steps. Stay inside the task's scope. List anything you notice outside it in your report; don't fix it.
5. **Verify** by running lint, typecheck and the relevant tests, and paste the real output. Never claim a test passed without running it.
6. **Report** using the format below.

### Report format (end every task with this)

```
## Task report: <task ID>
**Requirements:** <IDs> — done / partly done (why)
**What changed:** <short list of files and what each change does>
**Tests:** <commands run> → <pass/fail counts, pasted>
**Acceptance criteria:** <each criterion: met / not met + evidence>
**Decisions I made:** <anything not specified, and why>
**Open questions / spec conflicts:** <list, or "none">
**Follow-ups outside scope:** <list, or "none">
```

## Definition of done

- The PRD acceptance test passes, automated where possible.
- Unit and API tests are written. Access and ownership tests are updated for new routes.
- Lint, typecheck and tests are green in CI.
- Works on mobile width (360px) and desktop (1280px). Works offline where the spec requires it.
- Accessible: labels, focus states, contrast.
- Staff screens and audit entries exist for anything staff must manage.
- Logs, metrics and alerts exist for anything that can fail.
- It sits behind a feature flag if it is not ready for users.

## Naming and conventions

- Branches: `feat/<req-id>-short-name`, `fix/...`, `chore/...`.
- Commits: Conventional Commits, for example `feat(booking): BKG-02 prevent double booking`.
- PR title starts with the requirement IDs: `[BKG-01][BKG-02] Booking and calendar`.
- Database: singular `snake_case` tables. Every table has `id uuid` (v7, generated by the API), `created_at` and `updated_at`.
- API errors: `{ "error": { "code": "BOOKING_SLOT_TAKEN", "message": "...", "details": {} } }`.
- UI text: plain UK English, GH₵ amounts, 12-hour Ghana time, +233 phone format. All strings go in translation files.

## Sensitive areas: two human reviewers required

`apps/api/src/modules/payments/**`, `ledger/**`, `identity/**`, `rbac` guards, `sessions-safety/**`, every migration, and any address or recording code. In these areas, prefer clarity over cleverness and add comments that explain the *why*.
