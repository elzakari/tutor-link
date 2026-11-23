# Tutor Link — Security, Privacy and Safeguarding Specification

Nov 17, 2026 · @Zakari DARO

## 1. Overview

Tutor Link sends adults into family homes and onto video calls with children, and it holds identity results, addresses and payment details. This document sets the safeguarding rules, privacy duties and security controls that make that safe, and the steps to follow when something goes wrong.

**What we protect, in order**

1. Children's physical and emotional safety.
2. Children's and families' personal data, especially home addresses and lesson recordings.
3. Money held for families, tutors and sellers.
4. Trust: verification results, reviews and records that people rely on.

**Laws and rules this document answers to**

| Law or rule | What it means for Tutor Link |
| --- | --- |
| Data Protection Act, 2012 (Act 843) | Register with the Data Protection Commission, process data lawfully, respect data subject rights, report security compromises |
| Cybersecurity Act, 2020 (Act 1038) | Child online protection offences; possible duty to report cyber incidents |
| Children's Act, 1998 (Act 560) | Rights and welfare of children |
| National Identity Register (Amendment) Regulations, 2026 | No Ghana Card copies; biometric verification only |

This document states product rules, not legal advice. Each legal point is listed for counsel in section 12.

## 2. Safeguarding incident flow

&#91;embedded content: safeguarding incident flow · report to closure\]

When a child may be in danger, staff call the police before anything else, then protect: suspend the tutor, freeze their payouts and keep all evidence. The app's safety page lists the official routes: police on 191, 112 or 18555, the DOVVSU hotline 05 5100 0900, the Gender Ministry's Helpline of Hope 0800 800 800, and 292 for online abuse ([Ghana Police lines](https://www.graphic.com.gh/junior-graphic/junior-news/don-t-abuse-security-helplines-police-caution-children.html); [helplines](https://lgs.gov.gh/wp-content/plugins/download-attachments/includes/download.php?id=7905)). Numbers are checked again before launch.

## 3. Safeguarding policy

Tutor Link names a Designated Safeguarding Lead, a senior person who owns this policy, decides on serious cases and is the contact for police and social welfare. Every rule below appears in the app, the tutor code of conduct and the guardian terms.

**Tutor vetting before any lesson with a child**

| Step | Required for home lessons | Required for online-only |
| --- | --- | --- |
| Phone and email verified | Yes | Yes |
| Identity verified through the KYC provider | Yes | Yes |
| Qualifications and NTC licence checked | Yes | Yes |
| Two references contacted by staff | Yes | Yes |
| Police clearance or equivalent background check, as counsel advises | Yes | Owner decision |
| Safeguarding training module passed (about 30 minutes, with a quiz) | Yes | Yes |
| Code of conduct accepted | Yes | Yes |
| Recheck | Every 12 months, or at once after any incident | Same |

**Code of conduct: key rules for tutors**

- Meet children only at booked times, through Tutor Link.
- No contact with a child outside the app: no phone numbers, social media, gifts or favours.
- Never be alone behind a closed door with a child; teach in a shared or open space.
- No photos or videos of children, and no recording of online lessons on your own device.
- No physical punishment, threats, or comments about a child's body or appearance.
- Report any concern about a child's welfare to Tutor Link, even if it does not involve you.
- Breaking these rules leads to suspension, removal and, where the law requires, a report to the police.

**Home lesson rules**

- An adult from the household is present in the home for every lesson with a child, confirmed at booking.
- The guardian confirms arrival and departure with the check-in code.
- The tutor never takes the child out of the home.

**Online lesson rules**

- Lessons happen only in the Tutor Link classroom, never on outside video apps.
- The guardian can join any lesson; a banner shows when they are watching.
- Tutors use a neutral background and keep the camera on during teaching.
- Recording happens only when the guardian turns it on, and only on Tutor Link's system.

**Messaging rules**

- Children's conversations are visible to their guardian.
- Messages containing phone numbers, social media handles or links are flagged for review.
- Any user can report a message; reported messages are kept as evidence even if deleted.

**Marketplace content**

Resources must suit their stated class level. Content that sexualises, demeans or endangers children is removed at once and reported.

## 4. Data inventory and classification

Every data type has a class that decides how it is stored, who sees it and how long it is kept.

**Classes**

| Class | Meaning | Handling |
| --- | --- | --- |
| Restricted | Harm if exposed: children's details, addresses, recordings, incident reports, payout accounts | Encrypted fields or private storage; revealed only with a logged reason; never in logs or analytics |
| Confidential | Personal data of adults: names, phone numbers, bookings, payments, messages | Role and ownership checks; masked in admin lists |
| Internal | Operational data: configuration, aggregated metrics | Staff only |
| Public | Tutor profiles, product pages, reviews | Shown to everyone, with personal details removed |

**Inventory**

| Data | Class | Collected from | Shared with |
| --- | --- | --- | --- |
| Child first name, class level, subjects, goals | Restricted | Guardian | The child's booked tutor, during the package |
| Guardian home address and GhanaPost GPS | Restricted | Guardian | The booked tutor, for paid home lessons only |
| Lesson recordings | Restricted | Classroom, with guardian consent | Guardian; staff for disputes |
| Incident reports and evidence | Restricted | Users, staff | Safeguarding staff; police where required |
| Identity check result and masked ID number | Restricted | KYC provider | Verification staff |
| Payout account details | Restricted | Tutor or seller | Paystack; Finance staff |
| Names, phone numbers, emails | Confidential | Users | Paystack, SMS and WhatsApp providers, as needed |
| Bookings, payments, ledger | Confidential | System | Paystack; Finance staff |
| Messages | Confidential | Users | Conversation members; guardian for children's threads; moderators when flagged |
| Lesson reports and progress | Confidential | Tutors | Guardian; new tutor with guardian approval |
| Certificates | Confidential | Tutors | Verification staff |
| Tutor profiles, products, reviews | Public | Users | Everyone |

**Not collected:** Ghana Card images, full ID numbers, biometrics, children's photos, children's surnames, school names, dates of birth, religion, ethnicity or health data.

## 5. Privacy compliance

Tutor Link must register with the Data Protection Commission before collecting any personal data. The Commission says processing without registration is an offence and is actively enforcing ([GNA, Oct 2026](https://gna.org.gh/2026/10/data-protection-commission-intensifies-enforcement-to-safeguard-personal-information/)).

| Duty | How Tutor Link meets it |
| --- | --- |
| Register as a data controller | Register before the pilot; renew on schedule; show the registration number in the privacy notice |
| Lawful, limited processing | Each data type has a stated purpose (section 4); nothing is collected "just in case" |
| Consent where needed | Recorded in `consent_record` with policy version and time: terms, privacy, guardian consent for each child, identity check, record sharing, recordings, marketing |
| Transparency | Plain-English privacy notice, plus short notices at the moment data is asked for |
| Data subject rights | Access, correction, export and deletion requests from Account; answered within a set period counsel confirms |
| Security safeguards | Sections 7 and 8 |
| Data processors | Written agreements with Paystack, the KYC provider, LiveKit, SMS and WhatsApp providers, email and hosting providers |
| Cross-border transfers | Hosting region and every processor's location recorded and approved by counsel |
| Impact assessment | A data protection impact assessment before launch, covering children's data, home addresses, identity checks and recordings |
| Security compromises | Commission and affected users notified (section 9) |
| Data protection supervisor | A trained person appointed to oversee compliance |

**The law may change.** A new Data Protection Bill went to public consultation in October 2025. The system keeps retention periods, consent types and notice texts in configuration so new rules mean updates, not rebuilds.

## 6. Children's data and online protection

Children never hold their own accounts in Phase 1; every child is a profile owned by a guardian, who gives consent for that child.

- **Minimum data.** First name, class level, subjects and goals only.
- **Guardian consent** is recorded per child, before any booking, in plain words.
- **No profiling or advertising** to children. Marketing messages go to adults only.
- **No public exposure.** Children never appear in reviews, profiles or marketing, by name or image.
- **Recordings** need the guardian's opt-in per booking, last 30 days, and are viewed only by the guardian and safeguarding staff for disputes.
- **Online abuse.** Ghana's Cybersecurity Act, sections 62 to 67, makes child sexual abuse material, online grooming, cyberstalking of a child and sextortion criminal offences ([Cyber Security Authority](https://www.csa.gov.gh/president_of_fida_leads_cop.php)). Any such material found on Tutor Link is preserved for police, never forwarded or deleted by staff, and reported.
- **Older learners (Phase 2).** Learners under 18 get limited accounts linked to a guardian, who can see their lessons and messages.

## 7. Threat model

Twelve threats ranked by harm and likelihood drive the controls in this document. Rows are ordered most serious first.

| # | Threat | Harm | Main controls |
| --- | --- | --- | --- |
| 1 | A tutor harms a child | Severe | Vetting, adult present, check-in codes, guardian access to lessons and messages, fast reporting and suspension |
| 2 | Someone grooms a child through chat or video | Severe | Guardian-visible threads, contact-detail flags, no outside apps, room access limited to booked people |
| 3 | A fake or impersonated tutor is listed | High | KYC identity check, credential review, references, profile photo matched to identity |
| 4 | Home addresses leak | High | Field encryption, release only for paid home bookings, logged reveals, no addresses in logs |
| 5 | Account takeover through SIM swap or reused passwords | High | OTP rate limits, step-up for sensitive actions, payout block after phone change, new-device alerts |
| 6 | Payout fraud | High | Payouts only after delivery, name matching, second approver, daily caps |
| 7 | Staff misuse of data or money | High | Least privilege, masking, second approvers, audit log, reveal alerts |
| 8 | Broken access control lets one family read another's data | High | Ownership checks in every query, 404 for others' records, generated access tests |
| 9 | Injection, cross-site scripting or request forgery | Medium | Parameterised queries, output encoding, strict Content Security Policy, SameSite cookies |
| 10 | Malicious uploads (malware in certificates or products) | Medium | Type and size checks, virus scanning, files served from a separate domain, PDFs re-rendered for previews |
| 11 | Piracy of marketplace files | Medium | Buyer-stamped downloads, signed short links, duplicate detection, takedown process |
| 12 | Outage of a provider (Paystack, SMS, KYC, video) | Medium | Adapters with timeouts and fallbacks, status page, queued retries |

The threat model is reviewed before each phase launch and after any serious incident.

## 8. Security controls

The baseline is OWASP ASVS Level 2 for the web app and API. The controls below add to those already set in the Architecture and RBAC documents.

**Application**

| Area | Control |
| --- | --- |
| Sessions | Access token 15 minutes; rotating refresh token in httpOnly, Secure, SameSite cookies; reuse revokes all sessions |
| OTP | 6 digits, 5 minutes, 5 tries; at most 3 sends per number per hour; SMS spend alerts |
| Input | Shared Zod schemas validate every request; unknown fields rejected |
| Output | React escaping; no raw HTML from users; rich text sanitised |
| Browser headers | Strict Content Security Policy, HSTS, frame blocking, no referrer leakage, permissions policy limiting camera and microphone to the classroom |
| Files | Allow-listed types; size limits; virus scan before use; stored privately; served from a separate domain through short-lived signed links |
| PWA cache | The service worker never caches API responses holding addresses, messages, payment or identity data; cached data is cleared on sign-out |
| Rate limits | Per IP, account and phone on sign-in, OTP, search, booking, payment and messaging |
| Secrets | In a secrets manager; rotated at least yearly and after staff departures |
| Dependencies | Lockfiles, automated vulnerability alerts, monthly updates, no unmaintained packages |
| Webhooks | Signature check, event ID replay protection, then confirmation with the provider |

**Infrastructure**

| Area | Control |
| --- | --- |
| Network | Database and Redis on private networks only; API reachable only through the load balancer |
| Encryption | TLS 1.2 or higher; disks and backups encrypted; field encryption keys in a managed key service |
| Access | Production access for named engineers only, with MFA and logged sessions; no shared accounts |
| Backups | Daily encrypted backups, point-in-time recovery, monthly restore test |
| Logging | Centralised logs without personal data, OTPs or tokens; kept 90 days; alerts on anomalies |
| Environments | Staging uses synthetic data only; production data never copied to developer machines |

## 9. Security incident and data breach response

A named incident lead runs every security incident through five steps, with a written record from the first minute.

1. **Detect and declare.** Alerts, user reports or staff spot it. The on-call engineer declares an incident and its severity.
2. **Contain.** Revoke keys or sessions, block accounts, take features offline behind feature flags.
3. **Assess.** What data, whose, how many people, and whether children's data or addresses are involved.
4. **Notify.** See the table below.
5. **Recover and learn.** Fix the cause, restore service, and write a review within 10 working days.

**Who is told**

| Who | When | How |
| --- | --- | --- |
| Data Protection Commission | When personal data is compromised, as soon as possible; counsel confirms the deadline | Formal notice with facts and remedial steps |
| Affected users | When their data is compromised, after containment, unless police ask for a delay | Email and SMS in plain language, with steps they can take |
| Cyber Security Authority or national CERT | If the incident falls under the Cybersecurity Act's reporting duty; counsel confirms whether it applies and the time limit | As the Authority directs |
| Police | Crimes, including any child abuse material or threats | Through the Safeguarding Lead |
| Paystack and other processors | When their systems or keys are involved | Their security contacts |

Act 843 includes a section on notifying security compromises, and the Data Protection Commission expects prompt breach reporting ([DPC guidelines](https://dataprotection.org.gh/compliance/)). One summary of the Cybersecurity Act describes mandatory reporting of incidents to the relevant CERT within 24 hours ([Digital Watch](https://dig.watch/?p=206500)); counsel must confirm whether this covers Tutor Link.

## 10. Testing, assurance and training

Security is tested on every change, by an outside firm before launch, and by people through training.

| Activity | When | Who |
| --- | --- | --- |
| Static analysis and dependency scan | Every pull request | CI pipeline |
| Access-control matrix test (every route, every role) | Every pull request | CI pipeline |
| Ownership tests (changing IDs to reach other families' data) | Every pull request | CI pipeline |
| Threat model review | Before each phase launch | Engineering lead and Safeguarding Lead |
| External penetration test | Before the pilot opens to the public, then yearly | Independent security firm |
| Restore test from backup | Monthly | Engineering |
| Incident drill (security and safeguarding) | Before launch, then every 6 months | Whole team |
| Safeguarding training | Before first lesson, then yearly | All tutors |
| Safeguarding and data protection training | Before console access, then yearly | All staff |
| Responsible disclosure page and security contact | From launch | Public |

## 11. Launch checklist

The pilot does not open to families until every item below is ticked.

- [ ] Registered with the Data Protection Commission
- [ ] Privacy notice, terms, tutor code of conduct and safeguarding policy published
- [ ] Data protection impact assessment completed and signed off
- [ ] Processor agreements signed with every provider
- [ ] Designated Safeguarding Lead and data protection supervisor appointed
- [ ] Counsel's answers on background checks, recordings, breach deadlines and identity checks received
- [ ] Every pilot tutor fully vetted to Safeguarding level
- [ ] All staff trained; incident drills run for safety and security
- [ ] External penetration test done, and every high finding fixed
- [ ] Access-control and ownership tests passing
- [ ] Backups restored successfully at least once
- [ ] On-call rota for urgent safety reports staffed
- [ ] Emergency numbers and reporting routes shown in the app's safety page

## 12. Open decisions and questions for counsel

**Decisions for the owner**

- [ ] Who is the Designated Safeguarding Lead, and who deputises.
- [ ] Whether online-only tutors need the same background check as home tutors.
- [ ] Which security firm runs the penetration test, and its budget.

**Questions for counsel**

- [ ] Which background or police check tutors working with children can lawfully be asked for, and how.
- [ ] Deadlines for notifying the Data Protection Commission and users of a security compromise.
- [ ] Whether the Cybersecurity Act's incident reporting duty applies to Tutor Link.
- [ ] Rules for recording children's online lessons, and the right retention period.
- [ ] When Tutor Link must report a safeguarding concern to the police or social welfare without the family's agreement.
- [ ] Approved hosting regions for children's data.

**Next document:** Development Execution Plan.

## Sources

- [Data Protection Commission intensifies enforcement (GNA, Oct 2026)](https://gna.org.gh/2026/10/data-protection-commission-intensifies-enforcement-to-safeguard-personal-information/)
- [Guidelines for data controllers (Data Protection Commission)](https://dataprotection.org.gh/compliance/)
- [Data Protection Act, 2012, arrangement of sections](https://openresearch-repository.anu.edu.au/bitstream/1885/278576/1/GhaData_8.pdf)
- [Child Online Protection provisions (Cyber Security Authority)](https://www.csa.gov.gh/president_of_fida_leads_cop.php)
- [Ghana's Cybersecurity Act 2020 summary (Digital Watch)](https://dig.watch/?p=206500)
- [Child protection helplines (Local Government Service)](https://lgs.gov.gh/wp-content/plugins/download-attachments/includes/download.php?id=7905)
- [Ghana Police emergency lines (Graphic Online)](https://www.graphic.com.gh/junior-graphic/junior-news/don-t-abuse-security-helplines-police-caution-children.html)
