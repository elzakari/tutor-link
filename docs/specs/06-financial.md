# Tutor Link — Financial and Marketplace Specification

Nov 17, 2026 · @Zakari DARO

## 1. Overview

Tutor Link collects every payment through Paystack, keeps the funds in its Paystack balance until the service is delivered, then pays tutors and sellers by Paystack transfer. Money for a lesson is released only after the lesson is confirmed and a short dispute window has passed.

**Settlement model: collect, hold, then transfer.** Paystack supports two ways to pay sellers on a marketplace:

| Model | How it works | Fit for Tutor Link |
| --- | --- | --- |
| Split at collection | Each payment is divided automatically between the platform and the tutor's subaccount and settled on Paystack's schedule | Tutors would be paid before the lesson happens. Refunds for missed lessons become hard to recover |
| Collect, hold, then transfer (chosen) | Payments settle into Tutor Link's Paystack balance with manual payouts; Tutor Link transfers each tutor's share once it is earned | Pays only for delivered lessons. Refunds come from funds still held. One model for tuition and the Marketplace |

With Paystack's Manual Payouts, received funds stay in the Paystack balance instead of settling automatically to the bank account. Paystack Transfers then send money to any Ghanaian mobile money wallet or bank account ([Paystack](https://paystack.com/blog/product-engineering/transfers-in-gh)).

Paystack and Ghanaian counsel must confirm in writing that holding funds this way, for days rather than hours, is allowed for Tutor Link's business type. Split at collection stays as the fallback design; the ledger in section 8 works with either.

**Decisions fixed here**

- All amounts are in Ghana cedis, stored in pesewas.
- Guardians and buyers pay the listed price; Tutor Link pays the Paystack fee out of its commission.
- One wallet per user holds tuition and marketplace earnings on separate lines.
- Every money event is recorded in the double-entry ledger before any balance changes.

## 2. Money flow

&#91;embedded content: tuition money flow · payment to payout, with refunds and commission\]

A guardian's payment for a package stays in Tutor Link's Paystack balance. Each lesson, once confirmed, moves its share to the tutor's pending balance and its commission to revenue. Unused or cancelled lessons go back to the guardian from the same held funds.

## 3. Fees and commission

Tutor Link earns a commission on each service; the Paystack fee comes out of that commission, so families and buyers pay exactly the listed price. All rates are proposals for the owner to confirm (section 12) and are stored as configuration.

**Proposed commission**

| Service | Commission | Paid by | Reasoning |
| --- | --- | --- | --- |
| Tuition, first package with a new family | 15% | Tutor (deducted from earnings) | Covers matching, safety checks and support |
| Tuition, repeat bookings with the same family | 10% | Tutor | Rewards staying on the platform instead of arranging lessons privately |
| Online lessons | Same as tuition | Tutor | Video costs are small per lesson and absorbed |
| Marketplace sales | 20% | Seller | Covers hosting, previews, file stamping and moderation |
| Revision classes (Phase 2) | 12% | Tutor | Larger sales per programme |
| Teaching assignments (Phase 3) | 8% | Poster, added on top of pay | Keeps the tutor's advertised pay whole |
| Specialist services (Phase 3) | 12% | Provider | Similar to tuition |

**Who pays which fee**

| Fee | Amount | Paid by |
| --- | --- | --- |
| Paystack collection fee, Ghana local payments | 1.95% of the payment (reported rate, confirm on signup) | Tutor Link, from commission |
| Transfer to a mobile money wallet | GH₵ 1 per transfer (reported) | Tutor Link |
| Transfer to a bank account | GH₵ 8 per transfer (reported) | Deducted from that payout, so MoMo stays the cheaper default |
| Video classroom usage | A small amount per online lesson | Tutor Link |
| SMS and WhatsApp messages | Per message | Tutor Link |

The 1% mobile money levy (E-Levy) no longer applies: it was abolished from 2 April 2025, so payments and transfers carry no levy ([Graphic Online](https://www.graphic.com.gh/business/business-news/mtn-ghana-abolishes-1-e-levy-as-new-tax-reforms-take-effect.html)).

Fee sources: Paystack's Ghana local rate is reported at a flat 1.95% for cards, mobile money and bank transfer ([gateway overview](https://learnwithhasan.com/payment-gateways/country/ghana/)), and transfers at GH₵ 1 to mobile money and GH₵ 8 to a bank ([Paystack in Ghana review](https://www.lilachbullock.com/paystack-in-ghana/)). Confirm both on Paystack's own pricing page before launch.

## 4. Worked examples

On a GH₵ 960 first package, the tutor receives GH₵ 816 and Tutor Link keeps about GH₵ 124 before running costs. Amounts use the proposed rates and the reported Paystack fees above.

**Tuition: 8 lessons at GH₵ 120 an hour**

| Line | First package (15%) | Repeat package (10%) |
| --- | --- | --- |
| Guardian pays | GH₵ 960.00 | GH₵ 960.00 |
| Tutor Link commission | GH₵ 144.00 | GH₵ 96.00 |
| Tutor earns (GH₵ 102 or 108 per lesson as each is delivered) | GH₵ 816.00 | GH₵ 864.00 |
| Paystack collection fee, 1.95% | − GH₵ 18.72 | − GH₵ 18.72 |
| MoMo transfer to tutor | − GH₵ 1.00 | − GH₵ 1.00 |
| Tutor Link keeps before SMS, video and staff costs | GH₵ 124.28 | GH₵ 76.28 |

**Marketplace: one cart with two products from two sellers**

| Line | Amount |
| --- | --- |
| Buyer pays (GH₵ 25 + GH₵ 30) | GH₵ 55.00 |
| Tutor Link commission, 20% | GH₵ 11.00 |
| Sellers earn (GH₵ 20 + GH₵ 24) | GH₵ 44.00 |
| Paystack collection fee, 1.95% | − GH₵ 1.07 |
| Tutor Link keeps before transfer and hosting costs | GH₵ 9.93 |

Seller transfers are batched with their other earnings, so the GH₵ 1 transfer fee is paid once per payout, not once per sale.

## 5. Tuition money rules

A guardian pays for a whole package upfront; the tutor earns each lesson's share only when that lesson is delivered. All time limits below are proposals stored as configuration.

**Packages**

- A package is 1 to 60 lessons with one tutor, one child and one subject.
- A package must be used within twice its planned length, with a minimum of 30 days. An 8-week package is valid for 16 weeks.
- Unused lessons can be refunded at any time before expiry, to the original payment method or as Tutor Link credit.
- At expiry, unused lessons are refunded automatically to Tutor Link credit, never forfeited.

**Cancellations and no-shows**

| Situation | Guardian gets | Tutor gets | Other effect |
| --- | --- | --- | --- |
| Guardian cancels 24 hours or more before | Lesson returned to the package | Nothing | None |
| Guardian cancels less than 24 hours before | 50% of the lesson back | 50% of their share | None |
| Learner not home or not online (guardian no-show) | Nothing back | Full share | Tutor waited at least 20 minutes, shown by check-in or room join |
| Tutor cancels 24 hours or more before | Lesson returned to the package | Nothing | None |
| Tutor cancels less than 24 hours before | Lesson returned, plus a free rescheduling | Nothing | One strike |
| Tutor no-show | Lesson returned, and a 10% credit on the next payment | Nothing | One strike; 3 strikes in 90 days triggers review |
| Bad weather, power or network outage confirmed by staff | Lesson returned | Nothing | No strike |

**Disputes**

- A guardian can dispute a lesson within 48 hours of its scheduled end. That lesson's earnings stay pending until staff decide.
- Staff can refund in full or in part, or confirm the lesson. Each decision has a reason and is logged.
- A safeguarding incident freezes all the tutor's pending and available earnings until the incident is closed.

**Switching tutor**

If a guardian replaces a tutor, the remaining lessons move to the new tutor at the new tutor's rate. Any price difference is charged or credited to the guardian.

## 6. Marketplace money rules

A marketplace sale is earned when the buyer pays, but the seller's share stays pending for 7 days to cover refunds.

**Pricing**

- Sellers set their own prices between GH₵ 5 and GH₵ 500 per product. Free products arrive in Phase 3.
- Prices are whole cedis or end in .50, to keep MoMo amounts simple.
- Platform promotions, such as a term-start discount, are paid by Tutor Link: the seller still earns their share of the full price.

**Seller earnings**

- Each order item records the price and commission at the moment of purchase.
- The seller's share becomes available 7 days after the sale, if no refund or takedown is open.

**Refunds**

| Situation | Buyer gets | Seller | Decided by |
| --- | --- | --- | --- |
| File broken or will not open, reported within 48 hours | Full refund | Share reversed | Support, after checking the file |
| Clearly not as described, reported within 48 hours | Full refund | Share reversed | Support |
| Changed mind | No refund | Keeps share | Automatic |
| Bought the same product twice by mistake | Refund of the duplicate | Share reversed | Automatic |
| Listing taken down for copyright | Full refund to every buyer in the last 30 days | Shares reversed, or taken from future earnings | Moderator and Super Admin |

A refund revokes the buyer's Library access to that product.

**Fake sales**

Purchases by the seller of their own product are blocked, as are purchases from accounts that share the seller's device or payment number. These sales count toward neither earnings nor ratings.

## 7. Wallet and payouts

Each user has one wallet with two balances: pending, which cannot be withdrawn yet, and available, which is paid out automatically twice a week.

| Earning | Moves from pending to available |
| --- | --- |
| Tuition lesson | 48 hours after the lesson ends, if not disputed |
| Marketplace sale | 7 days after the sale, if not refunded |
| Revision class seat (Phase 2) | 48 hours after each class, pro rata |
| Assignment or service milestone (Phase 3) | When the poster or buyer approves, or 5 days after submission with no response |

**Payout schedule**

- Automatic payouts run every Tuesday and Friday for all available balances.
- Minimum payout: GH₵ 20 to MoMo, GH₵ 100 to a bank account. Smaller balances roll over.
- A tutor can request an extra payout once a week, at their own transfer fee.
- A user's first payout waits until 7 days after their first earning, to catch early fraud.

**Payout accounts**

- MoMo (MTN, Telecel, AirtelTigo) or a Ghanaian bank account.
- The account name must match the verified identity name, checked with Paystack's account lookup before saving.
- Changes follow the RBAC rules: fresh OTP, Finance Admin approval, and no payouts for 72 hours after a phone number change.

**Statements**

Each user gets a monthly statement of earnings, commission, fees, refunds and payouts, downloadable as PDF and CSV for their own tax records.

## 8. Ledger

Every money event posts balanced debit and credit entries; balances are always computed from entries, never edited. Account codes below fill `ledger_account.code` in the Database Design.

**Chart of accounts**

| Code | Type | Holds |
| --- | --- | --- |
| `asset:paystack_balance` | Asset | Money sitting in Tutor Link's Paystack balance |
| `asset:bank` | Asset | Tutor Link's own bank account, after it withdraws its revenue |
| `liability:funds_held:tuition` | Liability | Guardians' money for lessons not yet delivered |
| `liability:wallet:<user>:pending` | Liability | Earned but not yet withdrawable |
| `liability:wallet:<user>:available` | Liability | Ready for the next payout |
| `liability:credit:<user>` | Liability | Tutor Link credit held for a guardian or buyer |
| `revenue:commission:tuition` | Revenue | Tuition commission |
| `revenue:commission:marketplace` | Revenue | Marketplace commission |
| `expense:processing_fees` | Expense | Paystack collection fees |
| `expense:transfer_fees` | Expense | Paystack transfer fees paid by Tutor Link |
| `expense:goodwill` | Expense | Credits given for tutor no-shows and service failures |

**Postings for common events** (amounts from the tuition example)

| Event | Debit | Credit |
| --- | --- | --- |
| Guardian pays GH₵ 960 for a package | `asset:paystack_balance` 960.00 | `liability:funds_held:tuition` 960.00 |
| Paystack fee recorded at settlement | `expense:processing_fees` 18.72 | `asset:paystack_balance` 18.72 |
| Lesson delivered (1 of 8) | `liability:funds_held:tuition` 120.00 | `liability:wallet:tutor:pending` 102.00; `revenue:commission:tuition` 18.00 |
| Dispute window passes | `liability:wallet:tutor:pending` 102.00 | `liability:wallet:tutor:available` 102.00 |
| Payout of GH₵ 816 to MoMo | `liability:wallet:tutor:available` 816.00 | `asset:paystack_balance` 816.00 |
| MoMo transfer fee | `expense:transfer_fees` 1.00 | `asset:paystack_balance` 1.00 |
| Two unused lessons refunded to MoMo | `liability:funds_held:tuition` 240.00 | `asset:paystack_balance` 240.00 |
| Unused lessons refunded as credit instead | `liability:funds_held:tuition` 240.00 | `liability:credit:guardian` 240.00 |
| Marketplace sale of GH₵ 25 | `asset:paystack_balance` 25.00 | `liability:wallet:seller:pending` 20.00; `revenue:commission:marketplace` 5.00 |
| Marketplace refund within 48 hours | `liability:wallet:seller:pending` 20.00; `revenue:commission:marketplace` 5.00 | `asset:paystack_balance` 25.00 |
| Tutor Link withdraws its revenue to its bank | `asset:bank` | `asset:paystack_balance` |

**Rules**

- Each posting has an idempotency key built from the event, for example `lesson_delivered:<session id>`. A repeated event posts nothing.
- `liability:funds_held:tuition` must always be covered by `asset:paystack_balance`; a daily check alerts Finance if it is not.
- If a refund comes after the earning was paid out, the amount is recovered from the user's future earnings. A negative wallet blocks new payouts until it is back to zero.
- Whether Paystack returns its fee on refunds is to be confirmed. Until then, the fee is treated as a cost Tutor Link keeps.

## 9. Reconciliation and reporting

A job matches Tutor Link's ledger against Paystack's records every morning, and Finance closes the books each month.

**Daily reconciliation (06:00)**

1. Fetch the previous day's Paystack transactions, refunds and transfers.
2. Match each one to a ledger transaction by reference and amount.
3. Compare the ledger's `asset:paystack_balance` with Paystack's reported balance.
4. Create a Finance task for every mismatch: missing in the ledger, missing at Paystack, or amount different.
5. Store the run and its result in `reconciliation_run`.

**Monthly close**

- All daily mismatches resolved or explained.
- Funds held for undelivered lessons match the sum of open package balances.
- Wallet balances match the sum of pending and available entries.
- Revenue and fee totals exported for the accountant.

**Finance dashboard**

| Metric | Meaning |
| --- | --- |
| Gross booking value | Total paid by guardians and buyers |
| Net revenue | Commission minus processing and transfer fees |
| Funds held | Money for lessons not yet delivered |
| Wallets owed | Pending plus available balances |
| Refund rate | Refunds as a share of payments, by service |
| Payout success rate | Transfers that succeed first time |
| Take rate | Commission as a share of gross booking value |

## 10. Fraud and risk controls

The main risks are fake tutors cashing out, stolen phone numbers redirecting payouts, and fake marketplace sales. Each has a control built into the money flow.

| Risk | Control |
| --- | --- |
| Fake lessons to cash out guardian money | Payouts only after guardian check-out or online attendance; first payout waits 7 days |
| SIM swap redirects payouts | 72-hour payout block after a phone change; OTP and Finance approval for payout account changes |
| Payout to someone else's wallet | Account name must match the verified identity name |
| Fake marketplace sales and reviews | Self-purchase and shared-device purchases blocked |
| Card fraud on checkout | Paystack's card checks; card payments above a set amount reviewed before the booking is confirmed |
| Collusion between guardian and tutor to move lessons off platform | Lower commission on repeat bookings; chat flags phone numbers; tutor ranking rewards on-platform history |
| Staff misuse | Second approver for large refunds and payout changes; audit log; daily reveal limits |
| Too many payouts at once | Daily payout cap per user and platform-wide; anything above is held for Finance review |

Proposed limits, to tune after the pilot: GH₵ 5,000 payout per user per day; card payments over GH₵ 3,000 reviewed; more than 3 refunds requested by one user in 30 days reviewed.

## 11. Tax and regulatory points

These points need answers from a Ghanaian tax adviser and lawyer before launch. The system is built so each answer becomes a configuration change, not a rebuild.

| Question | Why it matters | System readiness |
| --- | --- | --- |
| Can Tutor Link hold guardians' money in its Paystack balance until lessons are delivered? | Holding customer funds may need approval or a different structure | Ledger also supports split at collection |
| Must Tutor Link charge VAT on its commission, and from what turnover? | Changes the amount Tutor Link keeps and what receipts must show | Receipts and statements have a tax line, off by default |
| Must Tutor Link withhold tax from tutors' and sellers' earnings? | Would reduce payouts and require filings | Payout calculation has a withholding step, off by default |
| Are tutors independent contractors? | Affects contracts and liability | Terms of service written for independent tutors |
| What records must be kept, and for how long? | Sets financial record retention | Retention period is configurable |
| Are online marketplace sales of teaching materials subject to extra rules? | Links to the NaCCA question | Marketplace sits behind a feature flag |

The 1% E-Levy on electronic transfers was repealed from 2 April 2025, so it is not built in.

## 12. Open decisions

Five money decisions are yours; the rest of this document works with any answer.

- [ ] **Commission rates:** 15% first package and 10% repeat for tuition; 20% for the Marketplace.
- [ ] **Cancellation policy:** 24-hour notice, and 50% charged for late cancellations.
- [ ] **Payout days and minimums:** Tuesday and Friday; GH₵ 20 to MoMo, GH₵ 100 to a bank.
- [ ] **Marketplace price range:** GH₵ 5 to GH₵ 500.
- [ ] **Refunds by default:** to the original payment method, or Tutor Link credit first.

**Next document:** Security, Privacy and Safeguarding Specification.

## Sources

- [Introducing Transfers to bank accounts in Ghana (Paystack)](https://paystack.com/blog/product-engineering/transfers-in-gh)
- [Multi-split Payments (Paystack docs)](https://paystack.com/docs/payments/multi-split-payments/)
- [Best Payment Gateways in Ghana: Paystack local rate](https://learnwithhasan.com/payment-gateways/country/ghana/)
- [Paystack in Ghana: payouts and transfer fees](https://www.lilachbullock.com/paystack-in-ghana/)
- [MTN Ghana abolishes 1% E-Levy (Graphic Online)](https://www.graphic.com.gh/business/business-news/mtn-ghana-abolishes-1-e-levy-as-new-tax-reforms-take-effect.html)
- [Ghana E-Levy Repeal Act, 2025 (EY)](https://www.ey.com/en_gl/technical/tax-alerts/ghanas-parliament-amends-tax-laws-following-the-2025-budget-statement-presentation)
