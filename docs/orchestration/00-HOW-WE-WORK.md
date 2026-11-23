# How we build Tutor Link with Claude Code

**Roles**
- **Orchestrator (Claude in chat):** turns the specifications into task prompts, reviews the results and writes the next prompts.
- **Executor (Claude Code):** writes, runs and tests the code in the repository.
- **Product owner (you):** runs the prompts, approves plans and merges code. You also paste Claude Code's reports back to the orchestrator.

## One-time setup

1. Create the Git repository `tutor-link` and copy in this kit:
   - `CLAUDE.md` in the repo root. Claude Code reads it automatically every session.
   - `.claude/commands/`, which provides the `/task` and `/review-task` slash commands.
   - `docs/orchestration/`, which holds this guide and the sprint prompt files.
2. Export the 8 specification docs as Markdown. In each doc, open the Export menu and choose Markdown. Save them as:

   | Doc | Save as |
   | --- | --- |
   | Product Requirements Document | `docs/specs/01-prd.md` |
   | Software Architecture Document | `docs/specs/02-architecture.md` |
   | Database Design | `docs/specs/03-database.md` |
   | UI/UX Design Specification | `docs/specs/04-ui-ux.md` |
   | Super Admin and RBAC Specification | `docs/specs/05-rbac.md` |
   | Financial and Marketplace Specification | `docs/specs/06-financial.md` |
   | Security, Privacy and Safeguarding Specification | `docs/specs/07-security-safeguarding.md` |
   | Development Execution Plan | `docs/specs/08-execution-plan.md` |

   Diagrams export as text placeholders. That's fine, because the written sections carry the same rules.
3. Commit everything on `main` before the first task.

## The loop for every task

```
1. Orchestrator writes the task prompt (in the sprint file).
2. You start a fresh Claude Code session and run:   /task S1-01
   (or paste the prompt directly).
3. For tasks marked "Plan first": Claude Code shows a plan → you approve or ask for changes.
4. Claude Code implements, runs tests and ends with a Task report.
5. You review the diff (or run /review-task S1-01 in a new session for a second opinion).
6. Paste the Task report into the orchestrator chat.
7. Orchestrator checks it against the spec and either approves, writes a fix prompt,
   or adjusts the next prompts. Then you merge.
```

## Rules that keep quality high

- **One task per session.** Start a fresh Claude Code session for each task, so its context stays clean.
- **Never skip the report.** If tests weren't run, the task isn't done.
- **Small pull requests.** One task gives one branch and one pull request. Merge within 2 days.
- **Model choice.** Each prompt has a *Model* line.
  - **Strongest** is for architecture, ledger and payments, permissions, safeguarding and migrations.
  - **Standard** is for UI screens, CRUD, tests and docs.
  
  Use your gateway's cheaper models only for Standard tasks.
- **Sensitive areas** (see `CLAUDE.md`) need you or the tech lead to read every line before merging.
- **Spec conflicts** go back to the orchestrator and get fixed in the specs first, never patched quietly in code.

## Task ID format

`S<sprint>-<number>`, for example `S1-04`. Fix tasks add a letter: `S1-04a`.

## Sprint files

| File | Sprint | Weeks |
| --- | --- | --- |
| `sprint-1.md` | Foundations: repo, CI, database base, auth, app shell, PWA | 5–6 |
| `sprint-2.md` | Profiles, identity checks, verification queue, children, consent | 7–8 (written after Sprint 1 review) |
| ... | One file per sprint, written after the previous sprint's review | |
