# Tutor Link — Software Architecture Document (SAD)

Nov 16, 2026 · @Zakari DARO

## 1. Overview

Tutor Link is one Next.js PWA and one NestJS API, built as a modular monolith on PostgreSQL, with every outside service behind an adapter. This document turns the approved PRD into technical structure for Phase 1.

**Decisions fixed here**

| Topic | Decision | Reason |
| --- | --- | --- |
| Repository | One monorepo (pnpm workspaces, Turborepo): `apps/web`, `apps/api`, `packages/contracts`, `packages/ui` | Shared types and one CI pipeline |
| API style | Versioned REST under `/api/v1`, described by OpenAPI | Simple to cache, test and reuse for a future native app |
| Contracts | Zod schemas in `packages/contracts`, used by both apps | Frontend and backend cannot drift apart silently |
| ORM | Prisma | Mature migrations and typing; raw SQL for PostGIS queries |
| Sessions | Short-lived access token plus rotating refresh token in httpOnly cookies | No tokens in browser storage |
| Realtime | Socket.IO for chat and booking updates | Reconnection and fallbacks on weak networks |
| Jobs | BullMQ on Redis | Retries, delays and idempotent workers |
| Search | PostgreSQL full-text and PostGIS | Enough for the pilot; no extra service to run |
| Tenancy | Shared database, `organisation_id` on tenant-owned rows | Ready for Phase 3 institutions |
| Hosting region | To be confirmed with counsel (section 10) | Children's data and cross-border transfer rules |

## 2. System at a glance

&#91;embedded content: system overview · clients, API modules, data stores, external services\]

The PWA talks only to the API. The API alone reads the data stores and reaches outside services, each through an adapter, so a provider can be swapped without touching the other modules.

## 3. Frontend and PWA

The web app is a Next.js 16 App Router project that renders public pages on the server and runs dashboards as authenticated client views.

**Route groups**

| Group | Contents | Rendering |
| --- | --- | --- |
| `(public)` | Home, tutor profiles, subject and area pages, help | Server-rendered and cached for SEO |
| `(auth)` | Sign-up, OTP, role selection | Client |
| `(guardian)` | Children, search, requests, bookings, reports, payments | Client with server data loading |
| `(tutor)` | Profile, verification, calendar, sessions, earnings | Client with server data loading |
| `(admin)` | Staff console | Client, separate layout, staff-only |

**Structure rules**

- Feature folders own their screens, hooks and API calls. Shared UI lives in `packages/ui`.
- Server data goes through TanStack Query. Forms use React Hook Form with the shared Zod schemas.
- The browser never calls third parties with secrets. All integrations go through the API.
- Role checks in the UI are for display only. The API enforces every permission.

**PWA layer**

| Concern | Approach |
| --- | --- |
| Install | Web app manifest with icons and standalone display; custom install button on Android; guided Add to Home Screen screen on iOS |
| Service worker | Serwist with the Turbopack integration |
| Caching | App shell precached; public pages stale-while-revalidate; API reads network-first with a cached fallback; payments and OTP never cached |
| Offline data | Schedule, booking details and recent lesson reports stored in IndexedDB |
| Offline writes | Lesson report drafts queue locally and sync on reconnect |
| Push | Web Push with VAPID keys; subscription saved per device; permission asked only after a first booking or request |
| Updates | New version prompts a reload; no silent swap during a payment flow |

**Low-data rules.** Route-level code splitting, compressed images, system fonts, and no autoplay media. The admin console is excluded from the mobile bundle.

## 4. Backend modules

The API is one deployable NestJS application split into eleven core modules, plus the Marketplace and Online Classroom modules described below the table, each owning its tables and exposing a narrow service interface.

| Module | Owns | PRD requirements |
| --- | --- | --- |
| Identity and Access | Users, roles, sessions, OTP, staff MFA, permissions | ACC, ADM-03 |
| Verification | Verification levels, KYC results, credential reviews, renewals | VER |
| Tutor Profiles | Profiles, subjects, rates, availability, service areas | DIS-01, DIS-07 |
| Discovery and Matching | Search, ranking, tutoring requests and applications | DIS-02 to DIS-06 |
| Booking | Bookings, packages, calendar, reschedule and cancellation rules | BKG |
| Sessions and Safety | Check-in and check-out, attendance, incidents, suspensions | SES |
| Payments and Ledger | Paystack transactions, ledger, refunds, payouts, reconciliation | PAY |
| Learning Progress | Lesson reports, child progress record, sharing consent | LRN |
| Reviews | Reviews, reputation score, moderation | REV |
| Messaging and Notifications | Chat, push, SMS, WhatsApp, templates, delivery records | MSG |
| Admin and Audit | Staff console APIs, configuration, feature flags, audit log | ADM |

**Marketplace module (Lite in Phase 1, full in Phase 2).** This module owns the catalogue, seller studio, cart, orders, buyer library and digital delivery (preview generation, buyer-stamped files, signed download links). It uses Payments and Ledger for money and Verification for seller eligibility, so it plugs in without changing the Phase 1 modules.

**Online Classroom module (Phase 1).** Owns video rooms, join tokens, attendance from join and leave events, and optional recordings. The API issues short-lived room tokens only to the booked tutor, learner and guardian; LiveKit webhooks report joins and leaves, which the Sessions and Safety module uses as check-in and check-out for online lessons.

**Rules between modules**

1. A module reads and writes only its own tables. It reaches other data through that module's service.
2. Cross-module side effects travel as domain events, for example `booking.confirmed`, `session.completed`, `incident.reported`.
3. Events are written to an outbox table in the same transaction as the change, then published to BullMQ. Nothing is lost if Redis is down.
4. Every worker is idempotent and keyed by event ID.
5. Controllers validate input with the shared Zod schemas and return typed responses.
6. A lint rule blocks imports across module internals, so boundaries hold as the code grows.

**Request path.** Rate limit, then authentication, then permission guard, then validation, then the module service. Sensitive actions add an audit interceptor.

## 5. Data architecture

One PostgreSQL database holds all transactional data, with PostGIS for location and an append-only ledger for money. The Database Design document will define every table and index.

**Core entities**

| Area | Entities |
| --- | --- |
| Identity | `user`, `user_role`, `session`, `otp_challenge`, `staff_permission` |
| Family | `guardian_profile`, `child_profile`, `consent_record` |
| Tutor | `tutor_profile`, `tutor_subject`, `availability_slot`, `service_area` |
| Verification | `verification_level`, `kyc_check`, `credential`, `credential_review` |
| Marketplace | `tutoring_request`, `request_application`, `booking`, `booking_package` |
| Sessions | `session`, `check_event`, `incident_report`, `suspension` |
| Money | `payment`, `ledger_account`, `ledger_entry`, `refund`, `payout`, `reconciliation_run` |
| Learning | `lesson_report`, `progress_entry`, `record_share_grant` |
| Trust | `review`, `reputation_snapshot`, `moderation_action` |
| Messaging | `conversation`, `message`, `notification`, `push_subscription` |
| Platform | `organisation`, `config_setting`, `feature_flag`, `audit_log`, `outbox_event` |
| Reference | `subject`, `class_level`, `curriculum`, `region`, `district`, `locality` |

**Design rules**

- **Keys:** UUID v7 primary keys. Money is stored as integer pesewas, never floating point.
- **Tenancy:** tenant-owned rows carry `organisation_id`. A platform default organisation covers individual tutors and families in Phase 1.
- **Location:** tutor base point and service radius are PostGIS geography values. Home-lesson search uses distance queries with a spatial index.
- **Addresses:** a guardian's home address sits in its own table, encrypted at field level, and is released to a tutor only by the Booking module after payment.
- **Ledger:** `ledger_entry` is append-only and double-entry. Corrections are new entries. Balances are derived, never edited.
- **KYC:** `kyc_check` stores status, date, provider name, provider reference and a masked card number. No image or biometric column exists.
- **Children:** child tables hold first name, class level, subjects and goals. No photo, no school name, no national ID.
- **Audit:** `audit_log` is insert-only at the database permission level.
- **Deletion:** personal data is soft-deleted, then purged by a scheduled job after the retention period. Ledger rows are kept and de-identified.

**Files.** Certificates go to private object storage under random keys. Access is by short-lived signed URL issued only to the owner and to verification staff. Uploads are type-checked, size-limited and virus-scanned before review.

## 6. Key flows

Three flows carry the most risk in Phase 1: tutor identity, paying for a booking, and completing a session.

### 6.1 Tutor identity verification

1. The tutor accepts the code of conduct and gives explicit consent to an identity check.
2. The API creates a `kyc_check` and asks the KYC adapter for a hosted verification session.
3. The tutor completes the check on the provider's page. Card details and biometrics never touch Tutor Link servers.
4. The provider calls the webhook. The API verifies the signature and stores the result fields only.
5. On a pass, the tutor reaches Identity level and the credential review task opens for staff.
6. On a fail or timeout, the tutor can retry a limited number of times, then is routed to in-person verification.

### 6.2 Booking and payment

1. The guardian picks a tutor and slot. The Booking module places a 15-minute hold on the slot.
2. The API creates a `payment` with a unique reference and initialises a Paystack transaction.
3. The guardian pays by Mobile Money, card or bank transfer on Paystack's checkout.
4. Paystack calls the webhook. The API verifies the signature, then confirms the amount and status with Paystack's verify endpoint.
5. In one database transaction the API writes ledger entries, confirms the booking and stores a `booking.confirmed` event in the outbox.
6. Workers notify both parties and release the home address to the tutor.
7. If no payment arrives before the hold expires, the slot is freed. A late payment for an expired hold is refunded automatically.

### 6.3 Session completion and payout

1. Before the start time, the guardian's app shows a one-time code or QR for the session.
2. The tutor enters or scans it on arrival. The API records a check-in event with time.
3. If no check-in exists 15 minutes after the start, the guardian and operations are alerted.
4. At the end, the guardian confirms check-out the same way. The tutor files the lesson report.
5. `session.completed` makes the tutor's share eligible for payout after the dispute window.
6. The payout worker sends a Paystack transfer to the tutor's Mobile Money or bank account and records the ledger entries.
7. An incident report at any step freezes the payout and suspends new bookings until staff close it.

Steps 5 and 6 of flow 6.3 depend on Paystack confirming the settlement design. The ledger works the same whichever option they approve.

## 7. Security architecture

Security is enforced on the server in layers: who you are, what you may do, what data you may see, and what gets recorded.

| Layer | Control |
| --- | --- |
| Authentication | Phone OTP for users: 6 digits, 5-minute life, 5 attempts, resend throttled per number and per IP |
| Staff authentication | Email, password and TOTP; short sessions; console reachable only by staff roles |
| Sessions | Access token of 15 minutes and rotating refresh token in httpOnly, Secure, SameSite cookies; refresh reuse revokes the whole session family |
| Authorisation | Role and permission guard on every route, plus ownership checks, for example a guardian reads only their own children |
| High-risk actions | Fresh OTP or TOTP for payout account changes; second approver for payout changes and credential approval |
| Input and output | Zod validation at the edge; parameterised queries; output encoding; strict Content Security Policy |
| Webhooks | Signature check, replay protection by event ID, then confirmation against the provider's API |
| Secrets | Held in a secrets manager; none in the repository or the frontend bundle |
| Data at rest | Disk encryption for database and storage; field-level encryption for home addresses and payout account details |
| Data in transit | TLS 1.2 or higher everywhere, HSTS enabled |
| Abuse controls | Rate limits per IP, account and phone number; bot checks on sign-up; SMS spend alerts |
| Chat safety | Minors' threads visible to the guardian; phone numbers and links flagged for review; report button on every thread |
| Audit | Insert-only log of staff and sensitive user actions with actor, target, time and reason |
| Logging | No OTPs, tokens, card numbers or message bodies in application logs |

**Threats addressed first**

- Fake or impersonated tutors: KYC, credential review, renewal.
- Account takeover by SIM swap: step-up checks before payout changes, and a cooling-off period after a phone number change.
- Payment fraud: server-side confirmation, idempotency, reconciliation.
- Exposure of children's data: minimal fields, ownership checks, release of address only after payment.
- Insider misuse: least privilege, dual approval, immutable audit log.

A full threat model and penetration test belong to the Security, Privacy and Safeguarding Specification, before public launch.

## 8. Integrations

Every outside service sits behind an interface owned by one module, with a mock for tests and a named fallback.

| Interface | Owner module | Phase 1 implementation | Fallback or future |
| --- | --- | --- | --- |
| `IdentityVerifier` | Verification | KYC provider with authorised NIA access (to be selected) | Direct NIA connection; in-person verification |
| `PaymentGateway` | Payments and Ledger | Paystack: initialise, verify, refund, transfer | Second gateway if required later |
| `SmsSender` | Messaging and Notifications | Ghanaian SMS gateway (to be selected) | Second route for OTP delivery failures |
| `WhatsAppSender` | Messaging and Notifications | WhatsApp Business API through a provider | SMS |
| `PushSender` | Messaging and Notifications | Web Push with VAPID | SMS for critical events |
| `EmailSender` | Messaging and Notifications | Transactional email service | None needed for pilot |
| `VideoRoom` | Booking | LiveKit Cloud rooms, tokens issued by the API, join and leave webhooks | Self-hosted LiveKit or Zoom Video SDK |
| `GeoResolver` | Tutor Profiles | Locality table plus optional GhanaPost GPS code | Map provider geocoding |
| `FileStore` | Shared | S3-compatible object storage | Any S3-compatible vendor |

**Adapter rules**

- Timeouts, retries with backoff and a circuit breaker on every outbound call.
- Provider payloads are mapped to internal types at the adapter. No provider field names leak into modules.
- Each provider has a sandbox configuration for staging and a contract test run in CI.
- Provider outages degrade one feature, not the app. Example: KYC down pauses new verifications; bookings continue.

## 9. Infrastructure and delivery

The pilot runs as four containers on managed infrastructure, deployed by one CI pipeline through three environments.

**Runtime**

| Component | Runs as | Notes |
| --- | --- | --- |
| Web | Next.js container behind a CDN | Static assets and public pages cached at the edge |
| API | NestJS container, 2 or more instances | Stateless; Socket.IO uses the Redis adapter |
| Worker | Same API image, worker entry point | BullMQ consumers and scheduled jobs |
| PostgreSQL | Managed service with PostGIS | Point-in-time recovery enabled |
| Redis | Managed service | Cache, queues, rate limits, socket fan-out |
| Object storage | S3-compatible bucket, private | Signed URLs only |

**Environments**

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Development with Docker Compose | Seed data, provider mocks |
| Staging | Release candidate testing | Synthetic data, provider sandboxes |
| Production | Pilot | Real data, restricted access |

**Pipeline.** Every pull request runs lint, type check, unit tests, API tests and a contract check between `web` and `api`. Merges to main deploy to staging and run Playwright end-to-end tests on booking and payment. Production deploys need a manual approval. Database migrations are backward compatible and run before the new code starts.

**Backups and recovery.** Daily encrypted backups, point-in-time recovery, and a restore test every month. Proposed targets: recovery point 15 minutes, recovery time 4 hours.

**Observability**

- Sentry for errors in web, API and workers.
- OpenTelemetry traces across API, queue and database.
- Structured JSON logs with request IDs and no personal data.
- Alerts on payment webhook failures, OTP delivery rate, queue backlog, payout failures and error spikes.
- A health endpoint per container and an integration status page in the admin console.

**Testing**

| Level | Tool | Focus |
| --- | --- | --- |
| Unit | Jest (API), Vitest (web) | Business rules, fee and ledger arithmetic |
| API | Jest with a real PostgreSQL container | Permissions, module contracts, migrations |
| End-to-end | Playwright | Sign-up, verification, booking, payment, check-in, payout |
| Devices | Real Android phones and iPhones | Install, push, offline, low bandwidth |
| Security | Dependency scanning, static analysis, penetration test before public launch | OWASP ASVS Level 2 baseline |
| Load | k6 | Search and booking at 10 times pilot volume |

## 10. Open technical decisions

Five technical choices remain open; the first two depend on legal answers already listed in the PRD.

- [ ] **Hosting provider and region.** Depends on counsel's view of children's data and cross-border transfer. Options: a cloud region in Africa or in Europe.
- [ ] **KYC provider.** Must show authorised NIA access, a hosted flow, webhooks and a data processing agreement.
- [ ] **Paystack settlement design.** Split at collection, or collect then transfer after the session. Decides payout timing, not the ledger design.
- [ ] **SMS and WhatsApp providers.** Choose on OTP delivery rate across MTN, Telecel and AT, and on price.
- [ ] **Video plan and region.** LiveKit Cloud is chosen; confirm the plan, the media region nearest Ghana, and where recordings are stored.

**Next document:** Database Design, which turns section 5 into tables, columns, indexes and migrations.
