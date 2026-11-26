<!--
Title: start with the requirement IDs this PR implements, e.g.
[BKG-01][BKG-02] Booking and calendar
-->

## Requirement IDs

<!-- e.g. BKG-01, BKG-02. If this PR is pure infra/chore with no PRD
     requirement ID, say so and name the task ID instead (e.g. S1-03). -->

## Summary

<!-- What changed and why, in a few sentences. -->

## Sensitive area touched?

- [ ] Yes — this PR touches a sensitive area listed in `CLAUDE.md`
      ("Sensitive areas: two human reviewers required"): payments, ledger,
      identity, RBAC guards, sessions-safety, a migration, or address/
      recording code. It needs **2 reviewers**, including the tech lead
      (see `CODEOWNERS`).
- [ ] No

## Definition of done

<!-- From CLAUDE.md "Definition of done". Tick only what is actually true;
     leave unticked items and explain why in the summary. -->

- [ ] The PRD acceptance test passes, automated where possible
- [ ] Unit and API tests are written. Access and ownership tests are
      updated for new routes
- [ ] Lint, typecheck and tests are green in CI
- [ ] Works on mobile width (360px) and desktop (1280px). Works offline
      where the spec requires it
- [ ] Accessible: labels, focus states, contrast
- [ ] Staff screens and audit entries exist for anything staff must manage
- [ ] Logs, metrics and alerts exist for anything that can fail
- [ ] It sits behind a feature flag if it is not ready for users

## Test evidence

<!-- Paste the real command output: lint, typecheck, unit/API tests, and
     anything else you ran. Do not claim a test passed without pasting
     its output. -->

```
$ pnpm lint

$ pnpm typecheck

$ pnpm test
```

## Decisions made / spec conflicts

<!-- Anything not specified that you decided, and why. Any conflict
     between this change and a spec — flagged, not silently resolved. -->

## Out of scope / follow-ups

<!-- What you noticed but didn't fix, per CLAUDE.md "Implement" step. -->
