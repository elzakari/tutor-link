# Tutor Link — Super Admin and RBAC Specification

Nov 17, 2026 · @Zakari DARO

## 1. Overview

Every request to Tutor Link passes four checks on the server: who you are, what your role allows, whether the record is yours, and whether the action needs extra proof or a second person. This document defines those rules for users and staff, the admin console that uses them, and the audit trail that records them.

**Principles**

1. **Deny by default.** A route with no permission declared is refused.
2. **Least privilege.** Each staff role gets only what its daily work needs. Nobody gets Super Admin for convenience.
3. **Server decides.** The UI hides what you cannot do, but only the API enforces it.
4. **Ownership beats role.** A guardian role lets you read lesson reports, but only your own children's.
5. **Money and safety need two people.** Payout changes, large refunds and credential approvals need a second approver.
6. **Everything sensitive is logged** with who, what, when and why, and the log cannot be edited.
7. **Staff see the minimum.** Personal data is masked in lists and revealed only on purpose, with a logged reason.

## 2. Access model

&#91;embedded content: request check flow · 4 checks, 4 outcomes\]

A request for someone else's record returns 404 rather than 403, so nobody can learn that a child, booking or file exists by guessing IDs. Actions that need extra proof pause until the OTP is entered or a second person approves, then run once.

## 3. User roles

One account can hold several user roles. Each role unlocks a set of actions, and each action is then limited to records the user owns.

| Role | Granted when | May do | Limited to |
| --- | --- | --- | --- |
| Guardian | Chooses the role at sign-up | Manage children, search, request, book, pay, confirm sessions, join online lessons, read reports, review, report problems | Own children, own bookings, own payments |
| Tutor | Chooses the role; listed only after verification rules are met | Edit profile, apply to requests, accept bookings, check in, teach online, file reports, see earnings, request payouts | Own profile, bookings assigned to them, children of those bookings while the package is active |
| Seller | Invited by staff (Phase 1); identity checked and payout account added | Create, price and submit products; see orders and sales | Own products and their orders |
| Buyer | Any signed-in user | Cart, checkout, Library, download, review purchased products | Own orders and entitlements |
| Student (older learner) | Phase 2, created by a guardian or as an adult learner | See schedule, homework, reports, join online lessons | Own lessons; under 18s stay under guardian oversight |
| Organisation member | Phase 3, invited by an organisation admin | Post assignments, buy services, manage engagements | Own organisation's records |

**Scope rules that apply to every user role**

- A tutor sees a child's first name, class level and goals only after a booking is confirmed, and loses access when the package ends.
- A home address is released to the tutor only for paid home bookings.
- A guardian can read every message in a child's conversation.
- Nobody can see another user's phone number, email or payout details.
- Suspended users can sign in to read their history and receipts, but cannot book, teach, sell or message.

## 4. Staff roles and permission matrix

Seven staff roles cover the pilot. A person holds one staff role; a second role needs Super Admin approval and is logged.

| Role | Purpose |
| --- | --- |
| Super Admin (SA) | Platform settings, staff accounts, final approvals. At least two people, never shared logins |
| Operations Admin (OPS) | Tutor onboarding, bookings, sessions, marketplace operations |
| Verification and Safeguarding Officer (SAFE) | Identity and credential review, incidents, suspensions |
| Finance Admin (FIN) | Payments, refunds, payouts, reconciliation |
| Support Agent (SUP) | Tickets, everyday disputes, account help |
| Content Moderator (MOD) | Reviews, messages flagged for review, marketplace listings, takedowns |
| Marketing Admin (MKT) | Public pages, blog, FAQs, campaigns, SEO |

**Permission matrix.** ✓ = allowed. R = read only. M = read with personal data masked. 2 = may act as second approver. — = no access.

| Permission | SA | OPS | SAFE | FIN | SUP | MOD | MKT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `user.view` | ✓ | M | ✓ | M | M | M | — |
| `user.reveal_personal_data` (with reason) | ✓ | ✓ | ✓ | — | ✓ | — | — |
| `user.suspend` / `user.unsuspend` | ✓ | ✓ | ✓ | — | — | — | — |
| `account.assisted_recovery` | 2 | 2 | — | — | ✓ | — | — |
| `verification.view_queue` | ✓ | ✓ | ✓ | — | — | — | — |
| `verification.decide` | ✓ | ✓ | ✓ | — | — | — | — |
| `verification.approve_safeguarding_level` | 2 | 2 | ✓ | — | — | — | — |
| `verification.revoke` | ✓ | — | ✓ | — | — | — | — |
| `booking.view` | ✓ | ✓ | ✓ | R | ✓ | — | — |
| `session.override_check` | ✓ | ✓ | — | — | ✓ | — | — |
| `booking.cancel_on_behalf` | ✓ | ✓ | ✓ | — | ✓ | — | — |
| `incident.view` | ✓ | R | ✓ | — | R | — | — |
| `incident.manage` | ✓ | — | ✓ | — | — | — | — |
| `suspension.lift_safeguarding` | 2 | — | ✓ | — | — | — | — |
| `dispute.resolve` | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| `payment.view` | ✓ | R | — | ✓ | R | — | — |
| `refund.approve_small` (up to the threshold) | ✓ | — | — | ✓ | ✓ | — | — |
| `refund.approve_large` (above the threshold) | 2 | — | — | ✓ | — | — | — |
| `payout.freeze` / `payout.release` | ✓ | — | ✓ | ✓ | — | — | — |
| `payout_account.approve_change` | 2 | — | — | ✓ | — | — | — |
| `reconciliation.run` | ✓ | — | — | ✓ | — | — | — |
| `listing.review` | ✓ | ✓ | — | — | — | ✓ | — |
| `listing.takedown` | ✓ | ✓ | — | — | — | ✓ | — |
| `seller.invite` | ✓ | ✓ | — | — | — | — | — |
| `review.moderate` / `message.moderate` | ✓ | — | ✓ | — | — | ✓ | — |
| `recording.view` (disputes only) | ✓ | — | ✓ | — | — | — | — |
| `cms.edit` / `campaign.manage` | ✓ | — | — | — | — | — | ✓ |
| `config.fees` / `config.policies` | ✓ | — | — | R | — | — | — |
| `config.feature_flags` / `config.service_areas` | ✓ | ✓ | — | — | — | — | — |
| `staff.manage` | ✓ | — | — | — | — | — | — |
| `audit.view` | ✓ | R | R | R | — | — | — |
| `data.export` (with reason) | ✓ | — | — | ✓ | — | — | — |

Staff never act on their own user account: a staff member who is also a tutor or guardian cannot approve, refund or moderate anything that involves themselves. The API checks this on every staff action.

## 5. Approvals and step-up checks

Twelve actions need extra proof, a second person, or both. A second approver can never be the person who started the action.

| Action | Started by | Step-up check | Second approver | Notes |
| --- | --- | --- | --- | --- |
| Tutor changes own payout account | Tutor | Fresh OTP | Finance Admin | Blocked for 72 hours after a phone number change; old and new account owner notified |
| Staff edits a payout account | Finance Admin | TOTP | Super Admin | Only with a support ticket attached |
| Approve Safeguarding level | Safeguarding Officer | TOTP | Operations Admin or Super Admin | Unlocks home lessons with children |
| Lift a safeguarding suspension | Safeguarding Officer | TOTP | Super Admin | Written resolution required |
| Refund above the threshold | Finance Admin or Support | TOTP | Finance Admin or Super Admin | Proposed threshold GH₵ 500 |
| Release a frozen payout | Finance Admin | TOTP | Safeguarding Officer if frozen for an incident | Linked incident must be closed |
| Assisted account recovery | Support Agent | Identity questions recorded | Operations Admin | New phone number cools off for 72 hours before payouts |
| Change commission or fees | Super Admin | TOTP | Second Super Admin | Takes effect at a future date shown to users |
| Grant or change a staff role | Super Admin | TOTP | Second Super Admin | Role change notified to the staff member |
| Data export | Super Admin or Finance Admin | TOTP | None | Reason required; file watermarked and expires in 24 hours |
| View a lesson recording | Safeguarding Officer or Super Admin | TOTP | None | Only with an open dispute or incident |
| Reveal a guardian's address or a child's details | OPS, SAFE, SUP | None | None | Reason required; more than 20 reveals a day alerts Super Admin |

**How approval requests work**

1. The action is saved as a pending request with the full change, the reason and the requester.
2. Eligible approvers see it in their Approvals queue and get a notification.
3. The approver sees the before and after, then approves or rejects with a reason.
4. Approved requests run once, at approval time. Requests not handled within 72 hours expire.
5. Every step goes to the audit log.

## 6. Admin console modules and queues

The console has 16 modules. Each staff member sees only the modules their role allows, and the Overview lists their own queues first.

| Module | Main jobs | Roles | Phase |
| --- | --- | --- | --- |
| Overview | KPIs, my queues, oldest waiting items, platform health | All staff | 1 |
| Approvals | Pending second approvals | SA, OPS, SAFE, FIN | 1 |
| Users | Search, view, suspend, recover accounts, guardian and child links | SA, OPS, SAFE, SUP | 1 |
| Verification | Identity results, credentials, safeguarding level, renewals | SA, OPS, SAFE | 1 |
| Bookings and sessions | Bookings, check-ins, online attendance, overrides | SA, OPS, SUP | 1 |
| Incidents and safeguarding | Reports, investigations, suspensions | SA, SAFE | 1 |
| Disputes | Lesson, payment and marketplace disputes | SA, OPS, SAFE, FIN, SUP | 1 |
| Payments and payouts | Transactions, refunds, payouts, freezes, reconciliation | SA, FIN | 1 |
| Marketplace | Listing review, seller invitations, takedowns | SA, OPS, MOD | 1 (Lite) |
| Reviews and messages | Flagged reviews and chat messages | SA, SAFE, MOD | 1 |
| Curriculum and locations | Subjects, levels, curricula, regions, service areas | SA, OPS | 1 |
| Communication | SMS, WhatsApp, push and email templates, delivery logs | SA, OPS | 1 |
| CMS and SEO | Public pages, blog, FAQs, metadata | SA, MKT | 1 |
| Settings | Fees, policies, feature flags | SA, OPS (flags and areas only) | 1 |
| Staff and permissions | Staff accounts and roles | SA | 1 |
| Audit and system | Audit log, integration status, queues, errors | SA, read-only for OPS, SAFE, FIN | 1 |

**Queues and proposed response targets.** Targets apply during staffed hours; staffing is still to be set (section 10).

| Queue | Owner | Target |
| --- | --- | --- |
| Safeguarding incidents marked urgent | SAFE | Acknowledge within 1 hour; on-call phone outside staffed hours |
| Other incidents | SAFE | Acknowledge within 24 hours |
| Missed check-ins | OPS | Contact the guardian within 30 minutes of the alert |
| Tutor verification | SAFE, OPS | Decision within 48 hours |
| Marketplace listing review | MOD | Decision within 72 hours |
| Disputes | SUP, FIN | First response within 24 hours; resolved within 5 working days |
| Second approvals | Approvers | Within 24 hours; expire after 72 hours |
| Takedown reports | MOD | Listing suspended within 4 hours if the claim looks credible |

## 7. Audit log

The audit log records every staff action and every sensitive user action in an insert-only table that no one can edit from the app.

**Each entry holds:** actor, actor's role at the time, action code, target type and ID, reason, before and after values for changed fields (personal data masked), approval request ID if any, IP address, device, and time.

**Always logged**

- Every staff write action and every reveal of masked personal data.
- Every approval request, approval and rejection.
- Staff sign-ins, failed sign-ins, MFA changes and role changes.
- User actions on money and identity: payout account changes, phone number changes, identity check results, refunds requested.
- Refused attempts on sensitive routes, such as a Support Agent calling a finance endpoint.
- Data exports and recording views.

**Who can read it**

| Role | Access |
| --- | --- |
| Super Admin | Everything, including other Super Admins' actions |
| Operations, Safeguarding, Finance | Read-only, for actions in their own area |
| Everyone else | No access |

**Alerts to Super Admins:** more than 20 data reveals by one person in a day, any second approval outside staffed hours, failed staff sign-ins above 5 in 15 minutes, any data export, and any change to fees or staff roles.

Retention is 5 years, as set in the Database Design.

## 8. Staff account lifecycle and emergency access

Staff accounts are created, reviewed and removed on a fixed routine, so access never outlives the job.

1. **Create.** A Super Admin creates the account with one role; a second Super Admin approves. The new staff member sets a password and enrols an authenticator app before first use.
2. **Train.** Safeguarding, data protection and the code of conduct are acknowledged in the console before any queue opens.
3. **Work.** Sessions last 8 hours at most and lock after 15 minutes idle. Sign-in from a new device sends an alert.
4. **Review.** Every 90 days, Super Admins confirm each staff member's role. Unconfirmed accounts are suspended.
5. **Leave.** On the last day, the account is deactivated and all sessions revoked. Records the person created stay, linked to their name.

**Emergency (break-glass) access.** One sealed emergency Super Admin account exists for when both Super Admins are unavailable. Its password and authenticator are held offline by the business owner. Any use alerts all Super Admins, every action is logged, and its credentials are replaced after each use.

**Rules**

- No shared staff accounts.
- Staff use separate staff accounts, never their personal tutor or guardian accounts, for console work.
- Lost authenticator: a Super Admin resets it after a live video identity check, logged.

## 9. Implementation notes

Permissions are code constants, roles are data, and every route declares what it needs.

- **Permission codes** live in `packages/contracts` as one typed list (for example `refund.approve_large`). The web app and API import the same list.
- **Role to permission mapping** is seeded into `staff_permission` and changed only through the approval flow.
- **Route guards.** Each NestJS controller method carries a decorator such as `@RequirePermission('payout.release')`. A global guard refuses any route without one.
- **Ownership checks** live in each module's repository functions, which always take the current user and scope the query, for example `findLessonReport(user, reportId)`. No module exposes an unscoped read to controllers.
- **Step-up** is a short-lived claim on the session, set by a fresh OTP or TOTP and valid for 10 minutes.
- **Approvals** are a shared service: a guarded action returns `202 Accepted` with an approval request instead of running.
- **Masking** happens in the API response layer, so masked fields never reach the browser.
- **Audit** is written by an interceptor in the same database transaction as the change.

**Tests that must pass before release**

- A generated test calls every route with every role and compares the result with the matrix in section 4.
- Ownership tests: a guardian cannot read another family's child, report or receipt by changing an ID.
- Approval tests: each action in section 5 cannot complete with one person.
- Self-dealing tests: staff cannot approve or refund anything involving their own user account.

## 10. Open decisions

Four operating choices are yours to make before the pilot.

- [ ] **Refund threshold** for a second approver. Proposed: GH₵ 500.
- [ ] **Staffed hours** for the admin team during the pilot, and who holds the on-call phone for urgent safety reports.
- [ ] **Pilot team size.** In a small team one person may hold two roles; list which combinations are allowed. Safeguarding and Finance should never be combined.
- [ ] **Who the two Super Admins are**, and who holds the emergency account.

**Next document:** Financial and Marketplace Specification.
