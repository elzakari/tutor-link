# Tutor Link — UI/UX Design Specification

Nov 17, 2026 · @Zakari DARO

## 1. Design principles

Tutor Link should feel safe, simple and quick on a mid-range Android phone with patchy data. Every screen decision is tested against the six principles below.

| # | Principle | What it means on screen |
| --- | --- | --- |
| 1 | Trust is visible | Verification level, review count and completed lessons sit next to every tutor's name. Nothing is shown as verified unless it was checked |
| 2 | Phone first, thumb first | Main actions sit at the bottom within thumb reach. Tap targets are at least 44 by 44 px. Desktop is a wider layout of the same app |
| 3 | Light on data | No autoplay video, few images, system fonts, cached screens. A page should work on a slow 3G connection |
| 4 | Plain English | Short sentences, everyday words, no jargon. Money in GH₵, times in 12-hour Ghana time |
| 5 | The guardian is in control | Parents see every message to their child, confirm every session and approve any sharing of records |
| 6 | Never a dead end | Every error says what happened and what to do next. Offline screens show saved data and queue actions |

**Who we design for first**

- **Ama, a working mother in Accra.** Books a maths tutor for her JHS 2 son. Pays by MTN MoMo. Wants proof the tutor is safe and that lessons help.
- **Kwame, a trained teacher.** Tutors after school for extra income. Wants steady bookings, fair ratings and payment on time to his MoMo wallet.
- **Esi, a verification officer.** Reviews 30 tutor applications a day on a laptop. Needs clear queues and no guesswork.

## 2. Design tokens

Tokens are defined once as CSS variables, mapped into Tailwind, and used by every shadcn/ui component. The palette is a working palette for Tutor Link until the logo is final: teal for trust and action, gold for ratings and highlights. Values change when the final brand lands; token names do not.

**Colour (light theme)**

| Token | Value | Use | Contrast on white |
| --- | --- | --- | --- |
| `--color-primary` | #0F766E | Main buttons, links, active tabs | 5.5:1 |
| `--color-primary-hover` | #115E59 | Hover and pressed | 7.6:1 |
| `--color-primary-soft` | #CCFBF1 | Selected chips, highlights behind text | Background only |
| `--color-accent` | #D97706 | Rating stars, featured marks | Icons only, never text |
| `--color-accent-text` | #92400E | Text on gold highlights | 7.1:1 |
| `--color-text` | #0F172A | Body text | 17.9:1 |
| `--color-text-muted` | #475569 | Secondary text | 7.6:1 |
| `--color-border` | #E2E8F0 | Card and input borders | Decorative |
| `--color-surface` | #FFFFFF | Cards, sheets | Base |
| `--color-background` | #F8FAFC | Page background | Base |
| `--color-success` | #15803D | Paid, completed, verified | 5.0:1 |
| `--color-warning` | #B45309 | Pending, expiring | 5.0:1 |
| `--color-danger` | #B91C1C | Errors, incidents, cancel | 6.5:1 |
| `--color-info` | #1D4ED8 | Tips, neutral notices | 6.7:1 |

Status colours always come with an icon and a word, never colour alone. A dark theme is planned for Phase 2 using the same token names.

**Type.** The system font stack (`system-ui, -apple-system, Segoe UI, Roboto, sans-serif`) costs no download.

| Token | Size / line height | Use |
| --- | --- | --- |
| `text-xs` | 12 / 16 px | Badges, captions |
| `text-sm` | 14 / 20 px | Secondary text, table cells |
| `text-base` | 16 / 24 px | Body text and every input field, which stops iOS zooming in |
| `text-lg` | 18 / 28 px | Card titles |
| `text-xl` | 20 / 28 px | Section titles |
| `text-2xl` | 24 / 32 px | Page titles on mobile |
| `text-3xl` | 30 / 36 px | Page titles on desktop, marketing headings |

Weights: 400 body, 500 labels, 600 titles. No more than two weights on a screen.

**Spacing, shape, depth and motion**

| Token group | Values |
| --- | --- |
| Spacing (4 px base) | 4, 8, 12, 16, 24, 32, 48, 64 |
| Radius | 6 px inputs and buttons; 12 px cards and sheets; full for pills and avatars |
| Depth | Borders first; one soft shadow for bottom sheets and dialogs only |
| Touch targets | At least 44 by 44 px, with 8 px between targets |
| Motion | 150 to 250 ms ease-out; no motion when the device asks for reduced motion |
| Icons | Lucide, 20 px in lists, 24 px in navigation; outline style |

## 3. Navigation and layout

Each role gets its own bottom bar on phones and a left sidebar on larger screens. A role switcher in the profile menu moves between roles without signing out.

**Main navigation per role**

| Role | Tabs (phone bottom bar, max 5) | Home screen shows |
| --- | --- | --- |
| Guardian | Home, Find tutors, Lessons, Messages, Account | Next lesson, check-in code, latest report, open requests |
| Tutor | Today, Opportunities, Calendar, Earnings, Account | Today's sessions, new requests, verification progress, next payout |
| Staff | Sidebar only: Overview, Verification, Bookings, Payments, Disputes, Incidents, Users, Content, Settings, Audit | Queues with counts and oldest waiting item |
| Visitor (signed out) | Header: Find tutors, How it works, For tutors, Sign in | Search box, trust explainer, featured subjects and areas |

**Two sides, one app.** A **Tuition | Marketplace** switch sits in the header of every screen. Switching changes the bottom bar, not the account.

| Side and role | Tabs (phone bottom bar) |
| --- | --- |
| Marketplace buyer | Shop, Jobs, Services, Library, Account (cart in the header) |
| Seller (any verified teacher) | Studio, Products, Orders, Earnings, Account |

A tutor who also sells sees one Earnings screen with tuition and sales on separate lines.

**Breakpoints**

| Name | Width | Layout |
| --- | --- | --- |
| Phone | Under 640 px | One column, bottom bar, full-screen sheets for filters and forms |
| Tablet | 640 to 1023 px | Two columns where useful, bottom bar stays |
| Desktop | 1024 px and up | Left sidebar, content up to 1200 px wide, side panels for details |

**Layout rules**

- One main action per screen, as a full-width button pinned above the bottom bar on phones.
- Back and close are always top left. Destructive actions sit apart and ask for confirmation.
- Lists load 20 items at a time with "Load more", not infinite scroll, to save data.
- The admin console is desktop-first with dense tables, filters and keyboard shortcuts. It is not optimised for phones in Phase 1.
- Offline status shows as a thin banner under the header on every screen.

## 4. Key screens on phone and desktop

&#91;embedded content: low-fidelity mock-up · guardian screens SCR-PUB-02, SCR-PUB-03, SCR-GRD-09\]

These wireframes fix layout and priority, not final visuals. Each tutor card leads with the verification badge and review count before the price. On lesson day, the guardian's code is the largest thing on the screen, with Report a problem directly below it.

### Desktop (1024 px and wider)

&#91;embedded content: low-fidelity mock-up · desktop SCR-PUB-02 and SCR-ADM-02\]

Desktop is the same app and the same components with a wider layout, not a separate site. Guardians keep the filters open beside a grid of tutor cards. Staff work in a list-and-detail layout: the queue stays on the left, and each decision needs a reason.

**How each screen group changes on desktop**

| Screen group | Phone | Desktop |
| --- | --- | --- |
| Search (SCR-PUB-02) | One column; filters in a bottom sheet | Filter panel always open on the left; 2 card columns, 3 on wide screens |
| Tutor profile (SCR-PUB-03) | One scroll; Book button pinned at the bottom | Two columns: profile and reviews on the left, sticky booking panel with slots and price on the right |
| Booking and payment (SCR-GRD-05 to 07) | One step per screen | One page; booking summary stays visible on the right |
| Guardian home and lessons (SCR-GRD-01, 08, 09) | Cards stacked | Lessons list with the selected lesson beside it; the check-in code stays large |
| Reports and progress (SCR-GRD-10, 11) | One report at a time | Progress timeline with the selected report in a side panel |
| Messages (SCR-SHR-01) | List, then thread | List and thread side by side |
| Tutor today and calendar (SCR-TUT-01, 06) | Day list | Week calendar; new requests in a side panel |
| Tutor earnings (SCR-TUT-10) | Summary cards | Summary row and a payout table with date filters and CSV export |
| Admin console (SCR-ADM-01 to 05) | Not optimised in Phase 1 | List and detail split; tables with column filters; keyboard shortcuts to move through a queue |

Keyboard shortcuts move between queue items and open actions, but approve, reject and refund still ask for a reason and confirmation.

## 5. Marketplace and the other earning streams

The Marketplace is a digital bookshop for teachers. It sells lesson notes, lesson plans, schemes of learning, worksheets, assessments and teaching materials written by teachers on the platform. It looks and behaves like a modern online store, while sharing Tutor Link's account, wallet, tokens and components.

**What makes it feel like a store**

- **Covers sell.** Every product has a cover image: the seller's own, or one generated from the first page with the subject colour and class level.
- **Browse like a shop:** a promotional banner, category tiles, "Best sellers" and "New this term" shelves, then a full grid with filters.
- **Clear product cards:** cover, title on two lines, class and term, seller with a verified tick, rating with sales count, price.
- **Try before you buy:** watermarked preview pages and a contents list on every product page.
- **Fast checkout:** cart, one MoMo payment for several items, then straight to the Library.
- **Seasonal timing:** the store home changes with the school calendar, for example Term 2 notes in January and BECE revision packs before the exam.

**Categories**

| Category | Examples |
| --- | --- |
| Lesson notes | Weekly notes for a term, by subject and class |
| Lesson plans | Daily or weekly plans in the standards-based format |
| Schemes of learning | Term or year schemes by subject and class |
| Assessments | Class exercises, mid-term and end-of-term exams with marking schemes |
| Exam preparation | BECE and WASSCE practice papers and revision packs |
| Worksheets and activities | Printable practice for learners |
| Teaching and learning materials | Charts, flashcards, slide decks |

**Filters:** level (KG, Basic 1 to 6, JHS, SHS), subject, term, week, resource type, file format (PDF, Word, PowerPoint), price (free, under GH₵ 20, GH₵ 20 to 50, over GH₵ 50), rating, and verified sellers only.

### Marketplace on desktop

&#91;embedded content: low-fidelity mock-up · Marketplace store home on desktop\]

The header carries the Tuition | Marketplace switch, a wide search box and the cart. Category pages and search results add the filter panel on the left, as on the tutor search page, with a 4 or 5 column product grid.

### Marketplace on phone

&#91;embedded content: low-fidelity mock-up · Marketplace store, product page and checkout on phone\]

On phone, shelves show two products per row and scroll sideways. The product page leads with swipeable watermarked previews. Checkout puts MoMo first and sends the buyer straight to the Library after payment.

### Product page

Top to bottom on phone; on desktop the price box sits on the right and stays visible while scrolling.

1. Cover and up to three watermarked preview pages, swipeable.
2. Title, class, subject, term and weeks covered.
3. Seller name with "Verified teacher" tick, rating and number sold.
4. Price, **Buy now** and **Add to cart**.
5. What's inside: number of files and pages, formats, and a contents list.
6. Curriculum tags: standards-based curriculum, strand and sub-strand where the seller gave them.
7. Description written by the seller.
8. Reviews from buyers only, newest first, with a rating breakdown.
9. "More from this seller" and "Teachers also bought" shelves.

### Cart, checkout and Library

- The cart opens as a drawer on desktop and a full screen on phone. Items can be removed or saved for later.
- Checkout is one screen: items, total, payment method (MoMo first), Pay. Paystack handles the payment.
- After payment the buyer lands in the **Library** with the new files on top. Each file shows Download, Open, and Save offline.
- Every download is stamped with the buyer's name and order number on each page footer.
- Receipts are in Account; refunds follow the 48-hour rule in the PRD.

### Seller studio

A teacher becomes a seller from Account, after the identity check and adding a payout account.

1. **Upload** PDF, Word or PowerPoint files, up to 50 MB in total per product. Phase 1 (Lite) accepts PDF only, and only invited sellers see the studio.
2. **Describe:** title, category, level, subject, term, weeks, description and contents list.
3. **Cover:** upload one, or use the generated cover.
4. **Preview:** choose up to 3 pages, or 10% of pages, whichever is fewer. They are watermarked automatically.
5. **Price** in GH₵, or mark the product free.
6. **Declare** that the work is original and the seller holds the rights to sell it.
7. **Submit** for review. Status shows as Draft, In review, Live, Changes requested or Suspended.

The Studio home shows sales this week, earnings, best-selling products, recent reviews and items needing changes.

### Marketplace screens (Phase 1 Lite)

| ID | Screen | Role |
| --- | --- | --- |
| SCR-MKT-01 | Store home: banner, categories, shelves | Buyer |
| SCR-MKT-02 | Category and search results with filters | Buyer |
| SCR-MKT-03 | Product page | Buyer |
| SCR-MKT-04 | Cart | Buyer |
| SCR-MKT-05 | Checkout and payment result | Buyer |
| SCR-MKT-06 | Library of purchases | Buyer |
| SCR-MKT-07 | Seller public page | Buyer |
| SCR-MKT-08 | Write a product review | Buyer |
| SCR-SEL-01 | Studio home | Seller |
| SCR-SEL-02 | Products list with status | Seller |
| SCR-SEL-03 | Create or edit product (upload, describe, cover, preview, price) | Seller |
| SCR-SEL-04 | Orders and sales | Seller |
| SCR-SEL-05 | Become a seller | Teacher |
| SCR-ADM-06 | Listing review queue, copyright reports and takedowns | Staff |

### Marketplace components

| Component | Shows | States |
| --- | --- | --- |
| `ProductCard` | Cover, title, class and term, seller tick, rating and sold count, price | Default, loading, free, discounted, owned ("In your Library") |
| `PromoBanner` | Seasonal message and link to a collection | Image, text-only for data saver |
| `CategoryTile` | Icon and category name | Default, selected |
| `ProductShelf` | Titled row of product cards | Loading, empty (hidden) |
| `PreviewViewer` | Swipeable watermarked pages | Loading, page error, last preview page with "Buy to see all" |
| `PriceBox` | Price, Buy now, Add to cart | Not owned, in cart, owned |
| `CartItem` and `CheckoutSummary` | Line items, total, payment method | Editing, paying, paid, failed |
| `LibraryItem` | Cover, title, files, download and offline actions | Not downloaded, downloading, saved offline |
| `ListingStatus` | Seller's product status | Draft, in review, live, changes requested, suspended |
| `UploadDropzone` | File drop area with progress | Empty, uploading, failed, scanned and ready |

### Revision classes, assignments and services

The three remaining earning streams reuse the components above, so they need no new visual language.

| Stream | Side and tab | Who buys | Built from |
| --- | --- | --- | --- |
| Revision classes (BECE, WASSCE) | Tuition side, inside Find tutors as "Revision classes" | Guardians, per seat | Product-style page, seat counter, booking and payment flow |
| Teaching assignments | Marketplace side, Jobs tab | Schools, learning centres, guardians | Job cards, apply flow, offers, timesheets |
| Specialist services | Marketplace side, Services tab | Schools, organisations, teachers | Service listings like products, orders with milestones and deliverables |

For tutors, all three also appear in the **Opportunities** tab, next to tutoring requests that match their profile.

&#91;embedded content: low-fidelity mock-up · revision class, jobs board and service order on phone\]

**Screens**

| ID | Screen | Phase |
| --- | --- | --- |
| SCR-RCL-01 | Revision class listing with exam, subject and area filters | 2 |
| SCR-RCL-02 | Programme page and enrolment | 2 |
| SCR-RCL-03 | Tutor: create and manage a programme | 2 |
| SCR-RCL-04 | Register, mock scores and learner results | 2 |
| SCR-ASG-01 | Jobs board with filters | 3 |
| SCR-ASG-02 | Assignment detail and apply | 3 |
| SCR-ASG-03 | Poster: post an assignment, review applicants, send offers | 3 |
| SCR-ASG-04 | Engagement with timesheets | 3 |
| SCR-SVC-01 | Services browse and service page | 3 |
| SCR-SVC-02 | Brief and quote request | 3 |
| SCR-SVC-03 | Provider: list a service, manage orders | 3 |
| SCR-SVC-04 | Order with milestones and deliverables | 3 |
| SCR-TUT-12 | Tutor Opportunities tab | 2 |

## 6. Core journeys

Six journeys must work end to end for the pilot. Each lists the screens it passes through and its target time.

### 5.1 Guardian finds and books a tutor (target: under 5 minutes)

1. **Sign up** with phone number and OTP. Add one child: first name, class level, subjects.
2. **Search** by subject and class level. Area comes from the child's saved locality. Choose home or online.
3. **Compare** tutor cards: verification badge, rating with review count, completed lessons, price per hour, distance band.
4. **Open a profile.** Read about the tutor, subjects, availability and reviews.
5. **Pick a slot** or a weekly package. See the total price before paying.
6. **Confirm details:** child, address for home lessons, and the adult-present acknowledgement.
7. **Pay** on Paystack by MoMo, card or bank transfer. The app waits for confirmation, then shows the booking.
8. **Confirmation screen** with lesson times, the tutor's first name and photo, and a button to add the PWA to the home screen.

Alternative path: the guardian posts a request instead, then picks from tutors who apply.

### 5.2 Tutor joins and gets verified (target: profile done in one sitting)

1. Sign up and pick the tutor role.
2. Accept the code of conduct and safeguarding policy.
3. Build the profile: photo, headline, subjects and levels, rates, area, travel radius, availability.
4. Start the identity check. The app explains that the check runs with a licensed provider and that no card photo is kept. The tutor completes it on the provider's page and returns.
5. Upload certificates and enter the NTC licence number.
6. Add a MoMo or bank account for payouts.
7. A progress tracker shows each verification level, what is pending and the expected review time.

### 5.3 Lesson day at home

1. Both sides get a reminder the evening before and one hour before.
2. The guardian's Home screen shows today's lesson with a 6-digit code and a QR.
3. On arrival the tutor taps **Check in** and enters or scans the code. The guardian sees "Kwame has arrived".
4. At the end the guardian taps **Confirm lesson ended**, or shows the code again.
5. The tutor files a short report: attendance, topics, homework, next steps.
6. The guardian gets the report and a prompt to rate the lesson.

If there is no check-in 15 minutes after the start, the guardian sees "Your tutor hasn't checked in" with options to message, wait, or report a no-show.

### 5.4 Something goes wrong

1. A **Report a problem** button sits on every lesson and every chat.
2. The guardian picks a category. Safety concerns are listed first and marked urgent.
3. A short form, with an optional photo for non-safety issues.
4. The confirmation explains what happens next and when staff will respond. Urgent safety reports also show emergency numbers.

### 5.5 Installing on iPhone

1. After a first booking, iOS Safari users see a card: "Get lesson alerts on your iPhone".
2. Tapping it opens a three-step illustrated guide: Share button, Add to Home Screen, Add.
3. When the app opens from the home screen, it asks for notification permission with a clear reason.
4. Users who skip it still get SMS or WhatsApp for critical events.

### 6.6 Online lesson in the classroom

1. When a tutor is beyond their travel range, search still shows them with an **Online** label. A guardian can also switch any single booked lesson to online.
2. Ten minutes before the start, the lesson card on both Home screens shows **Join lesson**. No link or phone number is shared.
3. A pre-join check tests camera, microphone and connection, and suggests audio-only on a weak signal.
4. In the room: tutor and learner video, screen share, chat, and a data-used counter. A banner tells everyone when the guardian is watching.
5. The guardian can join from their own phone at any time, with camera off by default.
6. Join and leave times count as attendance. The tutor then files the lesson report as usual.
7. If the guardian turned recording on for this booking, a red dot shows throughout, and the recording appears in the lesson for 30 days.

**Screens:** SCR-GRD-15 Online classroom (guardian and learner view), SCR-TUT-13 Online classroom (tutor view), SCR-SHR-07 Pre-join device and connection check.

## 7. Phase 1 screen inventory

Phase 1 has 46 screens. IDs follow `SCR-<area>-<number>` and trace to PRD requirements.

| ID | Screen | Role | PRD link |
| --- | --- | --- | --- |
| SCR-PUB-01 | Home | Visitor | DIS-07 |
| SCR-PUB-02 | Search results | Visitor, Guardian | DIS-02, DIS-03 |
| SCR-PUB-03 | Tutor public profile | Visitor, Guardian | DIS-01, DIS-07 |
| SCR-PUB-04 | Subject and area landing pages | Visitor | DIS-07 |
| SCR-PUB-05 | How it works, safety, for tutors | Visitor | - |
| SCR-PUB-06 | Help and FAQ | All | - |
| SCR-AUTH-01 | Phone entry | All | ACC-01 |
| SCR-AUTH-02 | OTP entry | All | ACC-01 |
| SCR-AUTH-03 | Choose role | All | ACC-02 |
| SCR-AUTH-04 | Consent and terms | All | Business rules |
| SCR-GRD-01 | Guardian home | Guardian | SES-01, LRN-01 |
| SCR-GRD-02 | Children list and child profile | Guardian | ACC-03 |
| SCR-GRD-03 | Post a tutoring request | Guardian | DIS-05 |
| SCR-GRD-04 | Request applications | Guardian | DIS-05 |
| SCR-GRD-05 | Choose slot or package | Guardian | BKG-01 |
| SCR-GRD-06 | Booking summary and pay | Guardian | PAY-01 |
| SCR-GRD-07 | Payment waiting and result | Guardian | PAY-02 |
| SCR-GRD-08 | Lessons list | Guardian | BKG-01 |
| SCR-GRD-09 | Lesson detail with check-in code | Guardian | SES-01 |
| SCR-GRD-10 | Lesson report | Guardian | LRN-01 |
| SCR-GRD-11 | Progress record per child | Guardian | LRN-02 |
| SCR-GRD-12 | Write a review | Guardian | REV-01 |
| SCR-GRD-13 | Reschedule, cancel, replace tutor | Guardian | BKG-03, BKG-04 |
| SCR-GRD-14 | Receipts and payments | Guardian | PAY-05 |
| SCR-TUT-01 | Tutor today | Tutor | SES-01 |
| SCR-TUT-02 | Profile editor | Tutor | DIS-01 |
| SCR-TUT-03 | Verification tracker | Tutor | VER-01 to VER-07 |
| SCR-TUT-04 | Identity check start and return | Tutor | VER-02 |
| SCR-TUT-05 | Credentials upload | Tutor | VER-05 |
| SCR-TUT-06 | Availability calendar | Tutor | BKG-02 |
| SCR-TUT-07 | Open requests and apply | Tutor | DIS-05 |
| SCR-TUT-08 | Check in and check out | Tutor | SES-01 |
| SCR-TUT-09 | File lesson report | Tutor | LRN-01 |
| SCR-TUT-10 | Earnings and payouts | Tutor | PAY-04 |
| SCR-TUT-11 | Payout account | Tutor | PAY-04, ADM-04 |
| SCR-SHR-01 | Messages list and thread | Guardian, Tutor | MSG-01, MSG-02 |
| SCR-SHR-02 | Notifications | All | MSG-03 |
| SCR-SHR-03 | Report a problem | Guardian, Tutor | SES-03 |
| SCR-SHR-04 | Account, role switch, privacy and data requests | All | ACC-02, NFR-10 |
| SCR-SHR-05 | Install guide (iOS and Android) | All | MSG-04 |
| SCR-SHR-06 | Offline and error states | All | NFR-03 |
| SCR-ADM-01 | Overview dashboard | Staff | ADM-07 |
| SCR-ADM-02 | Verification queue and review | Staff | ADM-01 |
| SCR-ADM-03 | Bookings and sessions | Staff | ADM-02 |
| SCR-ADM-04 | Payments, refunds, payouts, reconciliation | Staff | ADM-02, PAY-06 |
| SCR-ADM-05 | Disputes, incidents and suspensions | Staff | SES-03, SES-04 |

Admin also needs screens for users, content moderation, settings and feature flags, staff and permissions, and the audit log. They are specified in the Super Admin and RBAC Specification and are not counted here.

## 8. Component library

Components live in `packages/ui`, built on shadcn/ui and the tokens above. Each product component below lists the states it must handle; every state has a story in Storybook and a visual test.

**Product components**

| Component | Shows | States |
| --- | --- | --- |
| `TutorCard` | Photo, first name and initial, badge, rating with count, completed lessons, price per hour, distance band, home or online | Default, loading, unavailable, featured (labelled) |
| `VerificationBadge` | Highest level reached, with an icon and a word | Account, Identity, Qualification, Safeguarding, Trusted, Expired |
| `VerificationTracker` | Five steps with status and next action | Not started, pending, passed, failed, expired |
| `RatingSummary` | Stars, average to one decimal, review count | No reviews yet, under 5 reviews ("New"), normal |
| `PriceTag` | GH₵ amount per hour or package total | Hourly, package, discounted |
| `SlotPicker` | Week view of open slots | Loading, no slots, slot held, slot taken |
| `BookingSummary` | Child, tutor, times, address label, price breakdown | Review, paying, confirmed, cancelled |
| `PaymentStatus` | Live status after checkout | Waiting, confirmed, failed, timed out |
| `CheckInCode` | 6-digit code and QR for the guardian | Upcoming, active, used, expired |
| `CheckInPad` | Code entry and QR scan for the tutor | Ready, wrong code, success, offline queued |
| `LessonReportCard` | Attendance, topics, homework, next steps | Draft, submitted, read |
| `ProgressTimeline` | Objectives and mastery across lessons | Empty, single tutor, several tutors |
| `RequestCard` | Subject, level, area, budget, schedule | Open, has applications, closed |
| `ChatThread` | Messages with guardian visibility note | Empty, sending, failed, flagged |
| `ReportProblemSheet` | Category list and form | Safety (urgent), other, submitted |
| `EarningsSummary` | Pending, eligible, paid out | Empty, normal, frozen |
| `InstallPrompt` | Android install button or iOS guide | Android, iOS, installed (hidden) |
| `OfflineBanner` | Connection state and queued actions | Offline, syncing, synced |
| `EmptyState` | Message and one next action | Per screen |

**Base components from shadcn/ui:** Button, Input, OTP input, Select, Combobox, Checkbox, Radio, Switch, Textarea, Dialog, Sheet, Tabs, Toast, Tooltip, Avatar, Badge, Skeleton, Table, Calendar, Pagination.

**Rules for all components**

- Loading uses skeletons shaped like the content, not spinners, except for payment waiting.
- Errors appear next to the field or block that failed, in plain words, with a retry.
- Every interactive element has visible focus, a label for screen readers and a 44 px target.

## 9. Trust, safety, offline and PWA patterns

These patterns repeat across screens, so they are designed once and reused.

**Trust and safety**

- **Badges tell the truth.** A badge names the level reached and links to a short page explaining what was checked. Expired checks show as expired, not hidden.
- **New tutors are labelled "New"**, not shown with an empty or perfect rating. Fewer than 5 reviews never shows as top-rated.
- **Tutor names show as first name and last initial** in search. The full name appears after booking.
- **No home address on any public screen.** The tutor sees the address only on the confirmed lesson detail, and only until the package ends.
- **No Ghana Card field, upload or photo prompt anywhere.** The identity step shows one sentence: "We check your identity with a licensed provider. We never store a photo of your card."
- **Guardian visibility is stated in the chat**: "Messages with your child's tutor are visible to you." Phone numbers and links typed in chat are flagged with a gentle reminder to keep contact in the app.
- **Report a problem** is always one tap away on lessons, profiles and chats. Safety reports are styled as urgent and never hidden behind a menu.
- **Sponsored listings** carry a visible "Sponsored" label in the same place every time.

**Offline and low data**

| Situation | Behaviour |
| --- | --- |
| Offline on open | Show cached Home, lessons, codes and recent reports with "Saved" and the last update time |
| Offline action | Lesson report drafts and check-ins queue; the banner shows "1 action waiting to send" |
| Back online | Queue syncs automatically, then a toast confirms |
| Action that needs a connection | Payment, search and chat send are disabled with "Needs a connection" |
| Slow connection | Skeletons appear within 300 ms; images load after text |
| Data saver | An Account setting hides tutor photos in search and lowers image quality |

Check-in offline: the code is checked against a hash cached on the tutor's device for that lesson, then confirmed with the server when the connection returns.

**PWA behaviour**

- Android: a custom **Install app** button appears after the first meaningful action, never on the first visit.
- iOS: the guided card from journey 5.5. It is shown once per week at most and disappears once installed.
- Notification permission is requested only with a clear reason, after a booking or request.
- A new version shows "Update available" with a button. It never reloads during a payment or a check-in.

## 10. Accessibility, content and local formats

The target is WCAG 2.1 AA for public pages and core booking flows, tested with screen readers on Android (TalkBack) and iPhone (VoiceOver).

**Accessibility checklist**

- Text contrast at least 4.5:1; large text and icons at least 3:1.
- Every image has alt text; tutor photos use the tutor's first name.
- Forms have visible labels, not placeholder-only fields. Errors are announced.
- OTP inputs accept paste and SMS autofill.
- Pages work at 200% text size without horizontal scrolling.
- Nothing depends on colour, sound or a gesture alone.
- Reduced motion is respected.

**Voice and wording**

| Do | Don't |
| --- | --- |
| "Kwame has arrived for Kofi's maths lesson." | "Session check-in event recorded." |
| "Your payment didn't go through. Try again or use another wallet." | "Transaction failed: error 402." |
| "Verified identity" | "KYC passed" |
| "Lesson report" | "Session log" |

Write in UK English spelling, which matches Ghanaian schools. Address users as "you". Keep button labels to two or three words, starting with a verb.

**Local formats**

| Item | Format | Example |
| --- | --- | --- |
| Currency | GH₵ with two decimals; no decimals for whole amounts in lists | GH₵ 150 per hour; total GH₵ 1,200.00 |
| Phone | Typed as local, stored and shown as +233 | 024 123 4567 shown as +233 24 123 4567 |
| Date | Day month year | Tue 17 Nov 2026 |
| Time | 12-hour with am and pm, Ghana time (GMT) | 4:30 pm |
| Class levels | GES names | Basic 6, JHS 2, SHS 3 |
| Mobile Money | Network names as users know them | MTN MoMo, Telecel Cash, AirtelTigo Money |
| Location | Region, district, then neighbourhood; GhanaPost GPS optional | Greater Accra, Ga East, Haatso |

**Languages.** English only in Phase 1. Every string sits in translation files from day one, so Twi, Ga and Ewe can be added in Phase 4 without code changes.

## 11. Open design decisions

Four design choices wait on the brand or on testing with real users.

- [ ] **Tutor Link logo, final palette and domain.** Tokens are ready to swap; component names stay. Mock-ups show tutorlink.com.gh only as a placeholder address.
- [ ] **Tutor photo rules.** Required or optional, and how photos are checked against the identity result.
- [ ] **Illustration style** for empty states, the install guide and the safety page. Must stay small in file size.
- [ ] **Usability test plan.** Five guardians and five tutors in Accra on their own phones, covering journeys 5.1 to 5.3, before the build freeze.

**Next document:** Super Admin and RBAC Specification.
