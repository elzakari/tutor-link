# Tutor Link — Product Requirements Document (PRD)

Nov 16, 2026 · @Zakari DARO

## 1. Overview

Tutor Link is an installable web app (PWA) with two sides under one account. On the Tuition side, Ghanaian families find, book and pay verified tutors. On the Marketplace side, teachers buy and sell lesson notes, lesson plans, schemes of learning, assessments and other teaching resources. Teachers can also earn from revision classes, assignments and specialist services. Phase 1 proves one thing: a family can safely find a tutor, book, pay and get a reliable lesson.

Tutor Link is the confirmed brand name. The trademark and domain are still to be secured.

**Confirmed decisions**

| Decision | Choice |
| --- | --- |
| Delivery | PWA only, no app stores |
| Frontend | Next.js 16, TypeScript, Tailwind, shadcn/ui, Serwist |
| Backend | NestJS (TypeScript), modular monolith |
| Identity checks | Licensed KYC provider now; adapter ready for a direct NIA contract later |
| Payments | Paystack (Mobile Money, card, bank transfer) |
| Launch | Controlled Greater Accra pilot, then Kumasi |
| Positioning | Educational services marketplace, with safety and learning progress as the differentiators |

**How to read requirements.** Each requirement has an ID, a priority and an acceptance test. P0 = required for pilot launch. P1 = required before public launch. P2 = later phase.

**Coverage of the five teacher outlines.** Every outline from the original brief has a home, requirements and a design.

| Outline | Where it lives | Phase | Requirements | Design (UI/UX spec) |
| --- | --- | --- | --- | --- |
| 1. Find tutoring opportunities | Tuition side: search, matching, request board, bookings | 1 | DIS, BKG, SES, PAY | Sections 4 and 6 |
| 2. Earn from revision classes | Tuition side: BECE and WASSCE programmes | 2 | RCL-01 to RCL-08 | Section 5 |
| 3. Sell educational resources | Marketplace side: Shop | 1 (Lite), 2 (full) | MKT-01 to MKT-11 | Section 5 |
| 4. Access paid teaching assignments | Marketplace side: Jobs | 3 | ASG-01 to ASG-08 | Section 5 |
| 5. Offer specialist services | Marketplace side: Services | 3 | SVC-01 to SVC-07 | Section 5 |

A tutor's **Opportunities** tab gathers tutoring requests, assignments and service requests that match their profile, so all five income streams are reachable from one place.

## 2. Users and roles

One person has one account and can hold several roles. A teacher who is also a parent switches role inside the app without a second login.

| Role | Who | Main jobs | Phase |
| --- | --- | --- | --- |
| Parent / Guardian | Adult responsible for one or more children | Find tutors, book, pay, confirm sessions, read reports | 1 |
| Tutor | Teacher or subject specialist | Get verified, set rates and area, accept bookings, report on lessons, get paid | 1 |
| Student | Child profile under a guardian, or an older learner with own login | See schedule, homework and feedback | 1 (profile), 2 (login) |
| School / Institution | Schools and learning centres | Post assignments, recruit, commission marking | 3 |
| Organisation | Tuition agencies, NGOs, sponsors | Manage tutors or sponsor learners | 3 |
| Platform staff | Internal team | Operate the platform (see below) | 1 |

**Marketplace roles.** Any signed-in user can buy resources; most buyers will be teachers. A tutor or teacher becomes a seller after passing the identity check and adding a payout account. One account can tutor, buy and sell, and all earnings land in one wallet.

**Staff roles.** Permissions are granular and enforced on the server.

| Staff role | Scope |
| --- | --- |
| Super Admin | Platform-wide control, fees, feature flags, staff accounts |
| Operations Admin | Tutor onboarding, bookings, marketplace operations |
| Verification and Safeguarding Officer | Identity and credential review, child-safety incidents |
| Finance Admin | Reconciliation, commissions, payouts, refunds |
| Support Agent | Tickets and authorised dispute handling |
| Content Moderator | Listings, reviews, later resources |
| Marketing Admin | CMS, campaigns, SEO |

Children under the guardian age threshold never get an independent account. The guardian controls enrolment, payments, messaging and privacy. The exact age threshold is a legal decision (section 9).

## 3. MVP scope (Phase 1)

Phase 1 covers home and online one-to-one tutoring in Greater Accra end to end, plus Marketplace Lite.

**In scope**

- Installable PWA with guided install on Android and iPhone
- Registration, phone OTP, role switching
- Tutor verification ladder and admin review queue
- Tutor profiles, search, explainable matching, tutor request board
- Booking, scheduling, rescheduling, cancellation
- Paystack payments, ledger, refunds, tutor payouts
- Session check-in and check-out confirmed by the guardian
- Lesson reports and a basic progress record per child
- Verified reviews and reputation score
- In-app messaging between guardian and tutor, and an in-app online classroom with video, screen share and guardian access
- Notifications by push, SMS and WhatsApp
- Essential admin console, audit log, disputes and incident reports; Marketplace Lite behind a feature flag (invited sellers, PDF products, staff review of every listing)

**Out of scope for Phase 1**

- Revision classes, open Marketplace seller sign-up, assignments board, specialist services
- School and organisation dashboards
- AI teaching assistant, local-language interface, group pooling, diaspora sponsorship
- Classroom whiteboard, file sharing and group video rooms

**Pilot targets.** These are goals to validate, not forecasts.

| Target | Goal |
| --- | --- |
| Approved tutors | 100 to 150 |
| Registered families | 300 to 500 |
| Completed paid bookings | 100 or more |
| Families who book again | 30% or more |
| Safeguarding incidents unresolved after 48 hours | 0 |

## 4. Functional requirements

Phase 1 has 70 requirements across twelve modules (sections 4.1 to 4.11 and 4.15); sections 4.12 to 4.14 cover later phases. Each row is one testable requirement.

### 4.1 Accounts and access (ACC)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| ACC-01 | Register with phone number and OTP; email optional | P0 | A new user completes sign-up in under 2 minutes on a 3G connection |
| ACC-02 | One account holds several roles with in-app switching | P0 | A tutor adds the parent role without creating a second account |
| ACC-03 | Guardian creates and manages child profiles | P0 | A guardian adds 3 children, each with class level and subjects |
| ACC-04 | Staff accounts require multi-factor authentication | P0 | A staff login without the second factor is rejected |
| ACC-05 | Account recovery by OTP, with staff-assisted recovery logged | P1 | Every assisted recovery appears in the audit log with actor and reason |

### 4.2 Tutor verification (VER)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| VER-01 | Five-level ladder: Account, Identity, Qualification, Safeguarding, Platform Trusted | P0 | A profile shows only the levels the tutor has passed |
| VER-02 | Identity check runs through the KYC provider behind a provider-neutral adapter | P0 | Switching the adapter to a mock or a second provider needs no change outside the identity module |
| VER-03 | No Ghana Card image is requested, uploaded or stored | P0 | No upload field exists; a storage scan finds no card images |
| VER-04 | Only the check result is stored: status, date, provider reference, masked card number | P0 | The database holds no full card number and no biometric data |
| VER-05 | Tutor submits certificates and NTC licence number for staff review | P0 | An officer approves or rejects with a recorded reason |
| VER-06 | Tutor accepts the code of conduct and safeguarding policy before listing | P0 | An unaccepted tutor cannot appear in search |
| VER-07 | Verification expires and is renewed on a set schedule | P1 | An expired tutor is hidden from new bookings automatically |

### 4.3 Tutor profile and discovery (DIS)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| DIS-01 | Profile with subjects, levels, curriculum, rates, service area, travel radius, availability | P0 | A complete profile passes validation and goes to review |
| DIS-02 | Search by subject, class level, area, budget, home or online, availability | P0 | Results return in under 1 second for the pilot data set |
| DIS-03 | Safety and eligibility are hard filters; ranking uses explainable weights | P0 | An unverified tutor never appears, whatever the score |
| DIS-04 | Each match shows why it was suggested | P1 | A result card lists at least two matching reasons |
| DIS-05 | Guardian posts a tutoring request; eligible tutors apply | P0 | A posted request reaches matching tutors and collects applications |
| DIS-06 | Location uses region, district, town, neighbourhood and optional GhanaPost GPS | P0 | A tutor outside the travel radius is excluded from home-lesson results |
| DIS-07 | Public tutor pages are indexable; home addresses are never shown | P0 | A profile page renders server-side with no address data in the page source |

### 4.4 Booking and scheduling (BKG)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| BKG-01 | Book a single lesson or a recurring package | P0 | A guardian books 8 weekly lessons in one flow |
| BKG-02 | Tutor calendar blocks double booking | P0 | Two overlapping bookings for one tutor cannot both confirm |
| BKG-03 | Reschedule and cancel under published rules | P0 | A late cancellation applies the configured fee automatically |
| BKG-04 | Guardian can request a replacement tutor | P1 | A replacement keeps the remaining package balance |

### 4.5 Session safety and attendance (SES)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| SES-01 | Guardian confirms tutor arrival and departure by OTP or QR | P0 | A session cannot be marked complete without both confirmations or a staff override |
| SES-02 | Missed check-in alerts the guardian and operations | P0 | An alert fires 15 minutes after the scheduled start |
| SES-03 | Guardian or tutor can file an incident report from any session | P0 | A report reaches the Safeguarding Officer queue within 1 minute |
| SES-04 | A safeguarding report suspends the tutor from new bookings pending review | P0 | The suspension applies immediately and is logged |

### 4.6 Payments and payouts (PAY)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| PAY-01 | Pay by Mobile Money, card or bank transfer through Paystack | P0 | A test payment on each channel reaches the ledger |
| PAY-02 | Payment status comes from verified webhooks, never the browser | P0 | A forged success redirect does not confirm a booking |
| PAY-03 | Double-entry ledger with unique references and idempotent processing | P0 | A replayed webhook creates no second entry |
| PAY-04 | Tutor payout to Mobile Money or bank after a completed session | P0 | A payout is released only for sessions with check-out confirmed |
| PAY-05 | Refunds and partial refunds with reason codes | P0 | A refund reverses commission and tutor share correctly |
| PAY-06 | Daily reconciliation against Paystack settlement | P1 | Any mismatch raises a Finance Admin task |
| PAY-07 | Commission rate is configurable per service type | P0 | A rate change applies only to bookings made after it |

### 4.7 Learning progress (LRN)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| LRN-01 | Tutor files a short lesson report after each session | P0 | The guardian is notified and can read the report the same day |
| LRN-02 | Each child has a private progress record across tutors | P1 | A second tutor's reports appear in the same timeline |
| LRN-03 | Guardian authorises sharing the record with a replacement tutor | P1 | No tutor sees the record without a logged authorisation |

### 4.8 Reviews and reputation (REV)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| REV-01 | Only paid, completed sessions can be reviewed | P0 | A user with no completed session sees no review form |
| REV-02 | Reputation combines rating, review count, completion, punctuality and complaints | P0 | A tutor with 2 five-star reviews does not outrank one with 100 reviews at 4.8 |
| REV-03 | Moderation removes fraud and abuse, not honest negative reviews | P1 | Every removal has a recorded reason and is appealable |

### 4.9 Messaging and notifications (MSG)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| MSG-01 | In-app chat between guardian and tutor tied to a request or booking | P0 | Chat opens only after a request or booking exists |
| MSG-02 | Minors message tutors only under guardian-visible threads | P0 | A guardian can read every message in a child's thread |
| MSG-03 | Critical events go by SMS or WhatsApp as well as push | P0 | A booking confirmation arrives on a phone with the PWA not installed |
| MSG-04 | iPhone users see a guided Add to Home Screen screen | P0 | The guide appears on iOS Safari and not once installed |

### 4.10 Administration (ADM)

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| ADM-01 | Verification queue with approve, reject and request-more-information | P0 | An officer clears an application without database access |
| ADM-02 | User, booking, payment and dispute management screens | P0 | Support resolves a dispute end to end in the console |
| ADM-03 | Role-based permissions enforced on the server | P0 | A Support Agent calling a finance endpoint gets a 403 |
| ADM-04 | Payout changes and credential approvals need a second approver | P1 | A single admin cannot change a tutor's payout account alone |
| ADM-05 | Audit log of actor, action, time and reason for sensitive actions | P0 | Log entries cannot be edited or deleted from the console |
| ADM-06 | Fees, service areas, policies and feature flags are configurable | P0 | A new service area is enabled without a deployment |
| ADM-07 | Dashboard of pilot KPIs | P1 | Tutors approved, bookings, repeat rate and incidents are visible daily |

### 4.11 Marketplace (MKT)

Marketplace Lite launches in Phase 1 behind a feature flag: 20 to 30 invited sellers, PDF products only, every listing reviewed by staff. If the NaCCA question is not cleared by launch, the flag stays off and Tuition launches alone.

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| MKT-01 | E-commerce storefront: categories, search, filters by level, subject, term, resource type, price and rating | P0 | A teacher finds Basic 6 Term 1 Maths notes in 3 taps or fewer |
| MKT-02 | Product page with watermarked preview pages, contents list, curriculum tags, format, page count, seller and reviews | P0 | No full file is reachable before purchase |
| MKT-03 | Cart and one checkout for several products by MoMo, card or bank transfer | P0 | Three products are paid for in one Paystack transaction |
| MKT-04 | Buyer library with unlimited re-downloads and offline copies in the PWA | P0 | A purchased file opens offline after one download |
| MKT-05 | Files delivered through short-lived signed links, stamped with the buyer's name and order number | P0 | Every downloaded copy carries its buyer stamp |
| MKT-06 | Seller studio for invited sellers: upload PDF, describe, tag, price, generate previews, publish, see sales | P0 | An invited seller publishes a product without staff help, subject to review |
| MKT-07 | Every listing is reviewed before going live: originality check, curriculum tags, quality checklist, NaCCA rules once confirmed | P0 | An unreviewed product never appears in the store |
| MKT-08 | Only buyers can review a product | P0 | A user without a completed order sees no review form |
| MKT-09 | Seller earnings share the tutor wallet and payout schedule | P0 | Tuition and marketplace earnings show in one balance with separate lines |
| MKT-10 | Copyright and takedown reports; staff can suspend a listing at once | P0 | A suspended listing disappears from search and product pages within 1 minute |
| MKT-11 | Free resources, bundles and discount codes | P3 | A seller creates a 3-product bundle at a set price |
| MKT-12 | Open seller sign-up for any verified teacher; Word and PowerPoint files | P2 | A verified teacher becomes a seller without an invitation |
| MKT-13 | Seller analytics and "Teachers also bought" recommendations | P2 | A seller sees views, conversion and sales per product |

Refunds for digital goods: a buyer can ask for a refund within 48 hours if a file is broken or clearly not as described. Downloading alone does not block a refund; staff decide.

### 4.12 Revision classes (RCL)

Group BECE and WASSCE programmes run by verified tutors, sold by the seat to guardians.

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| RCL-01 | Tutor creates a programme: exam, subjects, level, weekly plan, dates, mode (venue, online or hybrid), seat limit, minimum seats, price per learner | P2 | A programme is published after staff review |
| RCL-02 | Programme page shows weekly plan, tutor, seats left and venue area; the exact venue is shown only after enrolment | P2 | The venue address is absent from the public page source |
| RCL-03 | Guardian enrols one or more children and pays per seat; a waitlist opens when full | P2 | The 21st enrolment on a 20-seat class joins the waitlist |
| RCL-04 | Tutor takes a register each class; guardians are told about absences the same day | P2 | An absent learner's guardian gets a notification |
| RCL-05 | Mock exams with scores and a topic breakdown per learner | P2 | A guardian sees each mock score and the weakest topics |
| RCL-06 | Venues are reviewed by staff before the first class; tutors' private homes are not allowed for groups | P2 | An unreviewed venue blocks publishing |
| RCL-07 | A programme below its minimum seats 3 days before start is cancelled and refunded automatically | P2 | All seat payments are refunded without staff action |
| RCL-08 | Guardians review the programme after it ends | P2 | The review form appears only after the final class |

### 4.13 Teaching assignments (ASG)

A jobs board for holiday teaching, temporary and substitute teaching, and academic support.

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| ASG-01 | Schools, learning centres and guardians post assignments: type, subjects, levels, location, dates, hours, pay, requirements | P3 | A posted assignment appears in matching tutors' Opportunities |
| ASG-02 | Organisations are verified (registration and contact checks) before posting | P3 | An unverified school cannot publish |
| ASG-03 | Tutors filter and apply with their profile and a cover note; posters shortlist, message and send offers | P3 | A poster moves an applicant from applied to offered |
| ASG-04 | An accepted offer creates an engagement with the agreed dates, hours and pay | P3 | Both sides see the same terms after acceptance |
| ASG-05 | Pay goes through Tutor Link, collected upfront or per period | P3 | No engagement starts unpaid |
| ASG-06 | The poster approves timesheets; the tutor is paid after approval | P3 | Payout waits for an approved timesheet |
| ASG-07 | Both sides review each other after the engagement | P3 | Each side can leave one review |
| ASG-08 | Assignments involving children require Safeguarding level | P3 | A tutor below that level cannot apply |

### 4.14 Specialist services (SVC)

Examination marking, curriculum support and educational content development, sold as service orders.

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| SVC-01 | Educators list services with scope, fixed price or quote, delivery time and samples | P3 | A listed service shows its price or "Request a quote" |
| SVC-02 | Buyers send a brief with files and get a quote or order directly | P3 | A quote can be accepted in one step |
| SVC-03 | Orders run by milestones: pay per milestone, upload deliverables, approve or request changes | P3 | A milestone payout waits for approval or the auto-approval period |
| SVC-04 | The number of revision requests is set per order | P3 | A request beyond the limit opens a dispute instead |
| SVC-05 | Exam scripts and learner data are confidential: access limited to the two parties and deleted after a set period | P3 | Script files are purged on schedule and access is logged |
| SVC-06 | Order terms state who owns delivered content | P3 | Ownership is shown on the order before payment |
| SVC-07 | Both sides review each other after completion | P3 | Each side can leave one review |

Marking for schools makes Tutor Link a data processor for learner scripts. Counsel should confirm the data processing terms before Phase 3.

### 4.15 Online classroom (VID)

Online lessons run in Tutor Link's own classroom, built on a managed video service (LiveKit). No Zoom or Google Meet links are shared.

| ID | Requirement | Priority | Acceptance test |
| --- | --- | --- | --- |
| VID-01 | Online lessons open in the in-app classroom from the booking; no external meeting links or contact details are exchanged | P0 | An online booking shows Join lesson and no URL |
| VID-02 | The room opens 10 minutes before the start and closes 15 minutes after the scheduled end; only the booked tutor, learner and guardian can join | P0 | Anyone else is refused entry |
| VID-03 | The guardian can join or watch any lesson for their child | P0 | A guardian joins a live lesson from Home |
| VID-04 | Join and leave times are recorded and count as attendance for online lessons | P0 | A lesson completes only if the tutor was present for at least 80% of the booked time, unless staff override |
| VID-05 | Adaptive quality, audio-only mode and a data-saver default, with an estimate of data used | P0 | A lesson continues on a weak 3G connection in audio-only mode |
| VID-06 | Screen sharing and in-room chat | P0 | A tutor shares a worked example from a laptop |
| VID-07 | Recording is off by default; a guardian can turn it on per booking; recordings are kept 30 days for the guardian and for disputes | P1 | A recording is deleted automatically after 30 days |
| VID-08 | Search offers tutors outside their travel range as online options, and a booking can switch single lessons between home and online | P0 | A tutor 25 km away appears with an Online label |
| VID-09 | The video provider sits behind an adapter, so self-hosted LiveKit or Zoom's Video SDK can replace it | P0 | A provider switch changes only the classroom module |
| VID-10 | Shared whiteboard and file sharing in the room | P2 | Tutor and learner both draw on one board |
| VID-11 | Group rooms of up to 30 learners for revision classes | P2 | A revision class runs with 30 learners joined |

## 5. Business rules

These rules hold everywhere in the product, whatever the screen or API.

**Identity and the Ghana Card**

1. The platform never requests, uploads, photographs or stores a Ghana Card image. The National Identity Register (Amendment) Regulations, 2026 prohibit it.
2. Identity is confirmed by the KYC provider against the NIA register. The platform keeps the result only.
3. Guardians are not asked for a Ghana Card. Phone OTP and a paid booking establish the account.
4. The identity module exposes one internal interface. A direct NIA connection later replaces the provider without touching other modules.
5. If remote verification is not accepted by the NIA, tutors verify in person on an approved device during pilot onboarding days.

**Tutor eligibility**

1. A tutor is bookable for home lessons only at Safeguarding level or above.
2. A tutor can be visible for online-only lessons at Qualification level, if policy allows.
3. Any open safeguarding report removes the tutor from new bookings until staff close it.

**Bookings and sessions**

1. A booking is confirmed only after verified payment.
2. A home session counts as delivered only with guardian check-in and check-out, or a logged staff override.
3. An adult from the household must be present for home lessons with a minor. The guardian accepts this at booking.
4. Cancellation and no-show fees follow one published policy, configurable by staff.

**Money**

1. The platform does not run its own escrow or hold customer funds in an ordinary business account.
2. Hold-then-release uses only what Paystack's settlement and transfer features support, once confirmed in writing.
3. Commission is charged on completed sessions. Searching and requesting are free for guardians.
4. Mobile Money has no automatic recurring charge, so packages renew by reminder and a fresh authorisation.
5. Every money movement has a ledger entry before any balance changes.

**Reviews**

1. One review per completed, paid session, by the paying guardian or the adult learner.
2. Tutors can reply publicly once. They cannot remove a review.
3. Sponsored placement is always labelled and never changes the reputation score.

**Children's data**

1. A child's profile, progress record and messages belong to the guardian's account.
2. Tutors see a child's first name, class level and learning goals only after a booking is confirmed.
3. The home address is released to the tutor only after confirmed payment, and never shown publicly.

## 6. Non-functional requirements

The targets below are proposed starting points for the pilot and should be confirmed in Phase 0.

| ID | Area | Requirement |
| --- | --- | --- |
| NFR-01 | PWA | Installable on current Android Chrome and iOS Safari; standalone display; custom icon and splash |
| NFR-02 | PWA | Push works on Android and on installed iOS apps; every critical event also has an SMS or WhatsApp path |
| NFR-03 | Offline | Schedule, booking details and the last 20 lesson reports are readable offline |
| NFR-04 | Low data | Key pages under 200 KB transferred on first load; images compressed and lazy-loaded |
| NFR-05 | Performance | Largest Contentful Paint under 2.5 seconds on a mid-range Android phone over 3G |
| NFR-06 | Availability | 99.5% monthly uptime during the pilot |
| NFR-07 | Security | TLS everywhere; encryption at rest for database and file storage |
| NFR-08 | Security | Rate limiting on OTP, login and payment endpoints; OWASP ASVS Level 2 as the review baseline |
| NFR-09 | Privacy | Data collected is limited to what each feature needs; retention periods defined per data type |
| NFR-10 | Privacy | Guardians can request access, correction, export and deletion of their family's data |
| NFR-11 | Audit | Sensitive actions are logged immutably with actor, time and reason |
| NFR-12 | Resilience | Daily encrypted backups; a restore test every month |
| NFR-13 | Accessibility | WCAG 2.1 AA for public pages and core booking flows |
| NFR-14 | Quality | Automated tests gate every release: unit, API and end-to-end on booking and payment |
| NFR-15 | Observability | Error tracking, tracing and alerts on payment, OTP and queue failures |

Test on real iPhones and Android devices. iOS installation, notifications and background behaviour differ from Android.

## 7. Architecture summary

One Next.js PWA talks to one NestJS API built as a modular monolith. The Software Architecture Document will carry the detail.

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | Next.js 16, React, TypeScript | Public site, dashboards, PWA |
| PWA layer | Serwist service worker, web app manifest | Install, offline cache, push |
| UI | Tailwind CSS, shadcn/ui | Responsive, accessible design system |
| API | NestJS, versioned REST with OpenAPI | Business logic; shared types with the frontend |
| Database | PostgreSQL with PostGIS | Records and location search |
| ORM | Prisma or Drizzle (decide in the architecture document) | Schema and migrations |
| Cache and jobs | Redis, BullMQ | Caching, rate limiting, background work |
| Realtime | Socket.IO | Chat and live booking updates; online lessons run on LiveKit (managed WebRTC) |
| Files | S3-compatible object storage | Certificates and, later, resources |
| Payments | Paystack | Collection, refunds, payouts |
| Identity | KYC provider behind an adapter | Ghana Card verification result |
| Messaging | SMS and WhatsApp gateway, web push | OTP and notifications |
| Monitoring | OpenTelemetry, Sentry | Errors and performance |
| Delivery | Docker, managed cloud, CI pipeline | Reproducible deployments |
| Testing | Jest, Vitest, Playwright | API, frontend, end-to-end |

**NestJS modules.** Each owns its tables and talks to others through defined interfaces: Identity and Access, Verification, Tutor Profiles, Discovery and Matching, Booking, Sessions and Safety, Payments and Ledger, Learning Progress, Reviews, Messaging and Notifications, Admin and Audit, Online Classroom, Marketplace.

**Principles**

- No microservices at the start. Extract a module only when load or team size requires it.
- API-first, so a native app can reuse the backend later.
- Background work is retried and idempotent, especially payments and notifications.
- Organisation accounts are isolated by tenant ID from day one, ready for Phase 3.
- AI features, when they come, run as a separate service called by the API.

## 8. Later phases

Phases 2 to 4 add the remaining pillars once the pilot shows repeat bookings and safe delivery. Durations are planning estimates.

| Phase | Estimate | Scope | Gate to start |
| --- | --- | --- | --- |
| 0 Discovery | 3 to 4 weeks | Remaining documents, legal checks, vendor onboarding, UX prototypes, threat model | This PRD approved |
| 1 Core MVP | 12 to 17 weeks | Everything in section 3 | Phase 0 legal and vendor items closed |
| 2 Expansion | 6 to 10 weeks | Full Marketplace (open sellers, more formats), classroom whiteboard, BECE and WASSCE revision classes, mock assessments, student login, group pooling | Pilot targets met; NaCCA position on resources confirmed |
| 3 Institutions | 6 to 8 weeks | School and organisation dashboards, assignments board, specialist services, institutional billing | Demand validated with at least 5 partner schools |
| 4 Scaling | Ongoing | AI teaching assistant, advanced matching, local languages, diaspora sponsorship, Kumasi and beyond | Sustainable unit economics in Accra |

**Revenue model by phase**

| Stream | Structure | Phase |
| --- | --- | --- |
| Home and online tutoring | Percentage commission per completed session | 1 |
| Revision classes | Commission per enrolment | 2 |
| Resource sales | Marketplace commission | 2 |
| Tutor Pro | Monthly or annual subscription | 2 |
| Job postings | Optional listing fee for employers | 3 |
| Institution plans | Tiered subscription | 3 |
| Featured placement | Labelled sponsored listings | 3 |

The commission rate for the pilot is still to be set (section 9).

## 9. Open items and launch dependencies

Six items block the pilot launch and four product decisions are still yours to make.

**Launch blockers (legal and vendor)**

- [ ] NIA or Ghanaian counsel confirms in writing that remote verification through the chosen KYC provider satisfies the 2026 biometric rules.
- [ ] KYC provider selected, with proof of authorised NIA access and a data processing agreement.
- [ ] Paystack confirms the settlement design for hold-then-release, split payments and tutor payouts.
- [ ] Data Protection Commission registration completed before any personal data is collected.
- [ ] Counsel sets the guardian consent wording, the age threshold for independent student accounts, and data retention periods.
- [ ] Counsel advises on tutor classification, contracts and tax treatment of commissions and payouts, and confirms the recording policy for children's online lessons.

**Check before the Marketplace goes live**

- [ ] Whether the NaCCA 2026 teaching-materials regulation requires approval for resources sold on the platform. Not yet verified.

**Decisions for the project owner**

- [ ] Pilot commission rate.
- [ ] Cancellation and no-show policy: notice period and fee.
- [ ] Whether online-only tutors can list at Qualification level before Safeguarding clearance.
- [ ] Register the Tutor Link trademark and secure the domain.

**Documents still to prepare**

1. Software Architecture Document
2. Database Design
3. UI/UX Design Specification
4. Super Admin and RBAC Specification
5. Financial and Marketplace Specification
6. Security, Privacy and Safeguarding Specification
7. Development Execution Plan

## Sources

- [Government deadline to stop photocopying Ghana Cards (MyJoyOnline)](https://www.myjoyonline.com/government-gives-institutions-until-nov-2-2026-to-stop-photocopying-ghana-cards/)
- [What the new Ghana Card regulations mean for organisations (Afriwise)](https://www.afriwise.com/blog/ghana-moves-to-biometric-verification-of-the-ghana-card-what-the-new-regulations-mean-for-your-organisation)
- [NIA Identity Verification Services](https://nia.gov.gh/?p=7914)
- [Data Protection in Ghana (DLA Piper)](https://www.dlapiperdataprotection.com/index.html?c=GH&t=law)
- [Paystack Multiple Transaction Splits](https://paystack.com/blog/product-engineering/multisplits)
- [PWA on iOS feature table (MobiLoud)](https://www.mobiloud.com/blog/progressive-web-apps-ios)
- [Serwist Turbopack docs](https://serwist.pages.dev/docs/next/turbo)

Legal points here come from news and law-firm summaries, not legal advice.
