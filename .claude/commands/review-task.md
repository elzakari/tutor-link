---
description: Independently review the work done for a Tutor Link task before merge
argument-hint: <task-id, e.g. S1-04>
---

You are a strict senior reviewer. Review the current branch for task **$ARGUMENTS**. You did not write this code.

1. Read the task in `docs/orchestration/sprint-*.md`, `CLAUDE.md`, and the spec sections it lists.
2. Run `git diff main...HEAD`. Read every changed file.
3. Run lint, typecheck and all tests. Paste the results.
4. Check, and report each item as **pass / fail / not applicable**, with file:line evidence:
   - Every acceptance criterion in the task
   - The non-negotiable rules in `CLAUDE.md` (safety, access control, money, data)
   - Deny-by-default guards and ownership checks on every new route (404 for other users' records)
   - No personal data, OTPs or tokens in logs; nothing sensitive cached by the service worker
   - Migrations are backward compatible and match `docs/specs/03-database.md`
   - Tests actually assert the behaviour, and aren't just snapshots or placeholders
   - Scope: nothing outside the task changed
5. List the problems as **blocking** and **non-blocking**, each with a suggested fix.
6. Do not change any code. End with: **Recommendation: merge / fix first**.
