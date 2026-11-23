---
description: Run a Tutor Link task by its ID from the sprint prompt files
argument-hint: <task-id, e.g. S1-04>
---

You are executing Tutor Link task **$ARGUMENTS**.

1. Find the section headed `## $ARGUMENTS` in `docs/orchestration/sprint-*.md`. If it doesn't exist, stop and say so.
2. Read `CLAUDE.md`, then every spec section the task lists under "Read first".
3. Create the branch named in the task, from an up-to-date `main`.
4. Follow the task exactly. Respect its "Out of scope" list.
5. If the task says **Plan first**, present your plan and wait for approval before writing code.
6. Run lint, typecheck and the tests the task names, and paste the real output.
7. End with the **Task report** in the format defined in `CLAUDE.md`.
