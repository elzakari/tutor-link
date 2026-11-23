# Tutor Link — Development Execution Plan

Nov 17, 2026 · @Zakari DARO

## 1. Overview

Tutor Link's pilot launches in week 20 from project start: 4 weeks of Phase 0 discovery and legal work, 15 weeks of Phase 1 build and hardening, then a soft launch in Greater Accra. Three gates stop the work if something essential is missing. Weeks are counted from the day the project starts, because no start date is set yet.

**How the documents fit together**

| Document | Answers |
| --- | --- |
| Product Requirements Document | What to build, with requirement IDs and acceptance tests |
| Software Architecture Document | How the system is structured |
| Database Design | What data is stored and how |
| UI/UX Design Specification | What users see and do |
| Super Admin and RBAC Specification | Who may do what |
| Financial and Marketplace Specification | How money moves |
| Security, Privacy and Safeguarding Specification | How people and data are kept safe |
| Development Execution Plan (this document) | When, by whom, and how quality is assured |

Every task, pull request and test names the requirement ID it serves, so progress can be traced from the PRD to the running product.

## 2. Timeline

&#91;embedded content: timeline · weeks 1 to 20 by workstream, three gates\]

Tutor recruitment starts in Phase 0 and runs to launch, because vetting takes weeks and the pilot needs 30 cleared tutors on day one. The admin console is built alongside every feature rather than at the end.

## 3. Phase 0 and the gates

Phase 0 (weeks 1 to 4) clears the legal and vendor questions that could force a redesign, and turns the specifications into tested designs and a ready team.

**Phase 0 work**

- Send the counsel questions from all documents as one brief; register with the Data Protection Commission.
- Open the Paystack business account and confirm manual payouts, transfers and the holding model in writing.
- Select and contract the KYC provider, LiveKit plan, SMS and WhatsApp providers, and hosting region.
- Build clickable prototypes of the six core journeys and test them with 5 guardians and 5 tutors in Accra.
- Finish the logo, final palette and domain.
- Run the threat model workshop and the data protection impact assessment.
- Hire or confirm the team; set up repositories, environments and tools.
- Begin recruiting the first pilot tutors through teacher networks.

**Gates**

| Gate | When | Must be true to pass | If not |
| --- | --- | --- | --- |
| G0: ready to build | End of week 4 | Paystack account approved; KYC provider contracted; counsel has answered or agreed workarounds for identity checks and holding funds; core journeys tested and signed off; team in place | Build starts on modules not blocked; blocked items move behind feature flags |
| G1: feature complete | End of week 16 | All P0 requirements built and passing their acceptance tests on staging | Cut or defer lower-priority items; hardening dates stay fixed |
| G2: ready to launch | End of week 19 | Every item on the security launch checklist ticked; penetration test high findings fixed; staff trained; first 30 tutors fully vetted | Launch moves one week at a time; never launch with a safeguarding item open |

## 4. Sprint plan

Phase 1 runs as seven two-week sprints plus a launch-readiness week. Each sprint ends with a demo on staging and a check against its requirement IDs.

| Sprint | Weeks | Goal | Requirements |
| --- | --- | --- | --- |
| 1 | 5–6 | Foundations: monorepo, CI/CD, environments, phone OTP sign-in, roles, design tokens, PWA shell | ACC-01 to ACC-04, NFR-01, NFR-14 |
| 2 | 7–8 | Tutor profiles, identity check through the KYC adapter, credentials, verification queue, guardian and child profiles, consent | VER-01 to VER-06, DIS-01, ACC-03, ADM-01 |
| 3 | 9–10 | Search and matching, request board, availability, booking holds, Paystack payments, ledger core | DIS-02 to DIS-07, BKG-01, BKG-02, PAY-01 to PAY-03 |
| 4 | 11–12 | Check-in and check-out, lesson reports, payouts, refunds, cancellation rules, messaging | SES-01 to SES-04, LRN-01, PAY-04, PAY-05, PAY-07, BKG-03, MSG-01, MSG-02 |
| 5 | 13–14 | Online classroom, SMS, WhatsApp and push, reviews and reputation, admin modules and approvals | VID-01 to VID-06, VID-08, VID-09, MSG-03, MSG-04, REV-01, REV-02, ADM-02 to ADM-06 |
| 6 | 15–16 | Marketplace Lite, reconciliation, progress record, KPI dashboard, remaining P1 items | MKT-01 to MKT-10, PAY-06, LRN-02, LRN-03, ADM-07, BKG-04, VER-07, VID-07, ACC-05, REV-03 |
| 7 | 17–18 | Hardening: penetration test fixes, load and device testing, accessibility, user acceptance testing with staff and friendly families | NFR-02 to NFR-15 |
| Readiness | 19 | Launch checklist, staff training, incident drills, seed data, safety page | Security launch checklist |

The admin console grows alongside each feature: every sprint ships the staff screens for what it builds.

## 5. Team and responsibilities

A core team of about six people builds Phase 1, with operations staff joining before the pilot. Headcounts are recommendations.

| Role | People | From week | Owns |
| --- | --- | --- | --- |
| Product owner | 1 (the project owner) | 1 | Priorities, decisions, sign-off at each gate |
| Tech lead (full-stack) | 1 | 1 | Architecture, code review, ledger and RBAC modules, releases |
| Full-stack developers (NestJS and Next.js) | 2 | 5 | Feature modules, API and screens |
| Frontend and PWA developer | 1 | 5 | Design system, PWA, offline, classroom UI |
| UI/UX designer | 1, half-time after week 6 | 1 | Prototypes, usability tests, screen designs |
| QA engineer | 1 | 9 | Test plans, end-to-end tests, device testing, user acceptance testing |
| DevOps (part-time or contracted) | 0.25 | 3 | Infrastructure, CI/CD, monitoring, backups |
| Designated Safeguarding Lead | 1 | 1 (part-time), full-time from 14 | Safeguarding policy, tutor vetting, incidents |
| Operations and support staff | 2 | 14 | Tutor onboarding, bookings, support, verification queue |
| Counsel (external) | As needed | 1 | Legal answers, terms, policies |
| Security firm (external) | As needed | 16 | Penetration test |

With a smaller team, the order of work stays the same and the timeline stretches. Roughly, each missing developer adds 3 to 4 weeks to Phase 1.

## 6. External dependencies and the critical path

The critical path runs through Paystack approval, the KYC contract and counsel's answers: payments and identity checks block bookings, and bookings block everything after them.

| Dependency | Needed by | Blocks | Fallback |
| --- | --- | --- | --- |
| Paystack business approval, manual payouts, transfers | Week 9 (Sprint 3) | Payments, payouts, Marketplace | Build against Paystack's test mode; switch to split at collection if holding is refused |
| KYC provider contract with NIA access | Week 7 (Sprint 2) | Tutor identity checks | Mock adapter for development; in-person verification days for the pilot |
| Counsel's answers on identity checks and holding funds | Week 4 (G0) | Verification and payment design | Most conservative option until answered |
| Data Protection Commission registration | Week 19 (G2) | Launch | None: launch waits |
| LiveKit account and media region | Week 13 (Sprint 5) | Online classroom | Online lessons switched off by feature flag |
| SMS sender ID and WhatsApp Business approval | Week 13 (Sprint 5) | OTP at scale, notifications | Second SMS provider; email and push |
| NaCCA position on teaching materials | Week 19 (G2) | Marketplace going live | Marketplace flag stays off |
| Domain, logo and final palette | Week 6 | Final visuals | Working palette continues |
| Penetration test booking | Week 16 | Launch | Book in Phase 0 to secure dates |

## 7. Engineering standards

One way of working for every contributor, human or AI, keeps the codebase consistent and traceable to the PRD.

**Code and repository**

- TypeScript in strict mode everywhere; ESLint and Prettier enforced in CI.
- Lint rules block imports across module internals (Architecture document, section 4).
- Trunk-based development: short-lived branches, small pull requests, merged within 2 days.
- Pull request titles start with requirement IDs, for example `[PAY-03] Idempotent webhook processing`.
- Conventional commit messages; changelog generated from them.
- Architecture decisions recorded as short ADRs in `docs/adr`.
- Unfinished features merge behind feature flags, never on long-lived branches.

**Reviews**

| Change touches | Reviewers required |
| --- | --- |
| Most code | 1 |
| Ledger, payments, payouts, RBAC, authentication, database migrations | 2, including the tech lead |
| Safeguarding rules (check-in, guardian visibility, address release, recordings) | 2, plus a product owner sign-off on behaviour |

**Rules for AI coding assistants**

1. Each task given to an assistant names its requirement ID, acceptance test and the module it may change.
2. Assistants work on branches and open pull requests; they never push to the main branch or deploy.
3. Every assistant-written pull request gets the same human review as any other, and must pass the same tests.
4. Business rules get tests first: the acceptance test is written or approved by a person before the code.
5. Ledger postings, permission rules and migrations are written or line-by-line reviewed by the tech lead.
6. No secrets, production data or real personal data in prompts; use synthetic data.
7. Cheaper models handle routine work (tests, UI wiring, documentation); the strongest model handles ledger, security and architecture tasks.

## 8. Quality gates and definition of done

A requirement is done only when it works on staging, passes its acceptance test, and an operator can support it.

**Definition of done**

- [ ] Acceptance test from the PRD passes, automated where possible
- [ ] Unit and API tests written; access and ownership tests updated for new routes
- [ ] Works on a mid-range Android phone and an iPhone, online and on slow 3G
- [ ] Accessible: keyboard, screen reader labels, contrast
- [ ] Staff screens and audit entries in place for anything staff must manage
- [ ] Logs, metrics and alerts added for anything that can fail
- [ ] Feature flag set as intended
- [ ] Help text and user messages written in plain English
- [ ] Reviewed and merged; deployed to staging; demoed

**Release gates (checked by the pipeline)**

| Check | Threshold |
| --- | --- |
| Unit, API and end-to-end tests | All pass |
| Ledger and payment modules | Every posting rule covered by a test; 95% line coverage |
| Overall line coverage | 80% |
| Access-control matrix test | No route differs from the RBAC matrix |
| Dependency and static analysis | No high or critical findings |
| Performance budget | Key pages under 200 KB on first load; LCP under 2.5 s on throttled 3G |
| Accessibility scan | No critical issues |

## 9. Release management and pilot rollout

The pilot opens in four widening steps, each with a short review before the next.

| Step | Week | Who can use it | Move on when |
| --- | --- | --- | --- |
| Staff alpha | 17–18 | Team and their families, real payments of small amounts | No high-severity bugs open |
| Friendly families | 19 | 10 invited families and 15 vetted tutors | Journeys complete without staff help |
| Soft launch | 20 | 50 invited families, 30 vetted tutors, invited sellers | Payments, payouts and safety reports work end to end |
| Open pilot | 24 | Anyone in the pilot areas of Greater Accra | Support queues within target for 2 weeks |

**Release rules**

- Production deploys happen on weekday mornings, outside the after-school lesson peak.
- Every release can be rolled back within 15 minutes; database changes stay backward compatible.
- New features reach staff first through feature flags, then pilot users.
- Release notes go to staff before users see a change.

## 10. Risk register

Ten risks are tracked weekly by the product owner; the first three can move the launch date.

| # | Risk | Effect | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| 1 | Counsel's answers arrive late | Verification or payment design changes mid-build | Send one combined brief in week 1; build the most conservative option meanwhile | Product owner |
| 2 | Paystack refuses the holding model or approval is slow | Payout design changes | Apply in week 1; split-at-collection fallback already designed | Tech lead |
| 3 | No KYC provider with NIA access fits | Tutors cannot be verified remotely | Shortlist three providers in Phase 0; in-person verification days | Safeguarding Lead |
| 4 | Too few vetted tutors for the pilot | Families find no match | Start recruiting in Phase 0 through teacher networks; focus on a few neighbourhoods | Operations |
| 5 | Families arrange lessons privately after meeting | Lost revenue | Lower repeat commission; safety and payment protection only on-platform | Product owner |
| 6 | Few iPhone users install the app, so they miss push alerts | Missed lessons | SMS and WhatsApp for every critical alert | Frontend developer |
| 7 | Video quality on weak networks | Poor online lessons | Audio-only mode, adaptive quality, pre-join check | Frontend developer |
| 8 | Scope grows during the build | Launch slips | Gate G1 cuts scope, not dates; new ideas go to Phase 2 backlog | Product owner |
| 9 | A key developer leaves | Delay | Shared code ownership, ADRs, two reviewers on critical modules | Tech lead |
| 10 | Copyrighted material sold in the Marketplace | Legal claims | Invited sellers, review queue, duplicate checks, fast takedown | Content Moderator |

## 11. Pilot success measures and the decision to expand

The pilot runs for 12 weeks after the soft launch. Metrics are reviewed every week; the decision to expand to Kumasi and to start Phase 2 is taken at week 12.

| Measure | Target by week 12 of the pilot |
| --- | --- |
| Approved tutors | 100 to 150 |
| Registered families | 300 to 500 |
| Completed paid bookings | 100 or more |
| Families who book again | 30% or more |
| Lessons completed as scheduled | 90% or more |
| Payouts that succeed first time | 99% or more |
| Urgent safety reports acknowledged within 1 hour | 100% |
| Safeguarding incidents unresolved after 48 hours | 0 |
| Marketplace products live (if the flag is on) | 150 or more |

**Expand when** repeat bookings, safety and payouts all meet target and the unit economics in the Financial Specification hold. **Fix first** if any safety target is missed, whatever the growth numbers say.

## 12. Open decisions

Four decisions turn this plan into a dated schedule.

- [ ] **Start date** for week 1, so weeks can become calendar dates.
- [ ] **Team:** who fills each role, and whether any role is contracted.
- [ ] **Budget** for the team, external counsel, the security test and vendors.
- [ ] **Pilot neighbourhoods** within Greater Accra to recruit tutors and families in first.
