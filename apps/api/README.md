# apps/api

NestJS modular monolith, REST under `/api/v1`. See `CLAUDE.md` for the
non-negotiable rules (deny-by-default guards, ownership scoping, money as
integer pesewas, etc.) — they apply to everything added here from S1-05 on.

## Known gaps

Health route lacks `@Public()` until S1-05 adds the global deny-by-default
guard. S1-05 must fix this before any other route is added.

## Module layout convention

Every feature module lives under `src/modules/<module>/` with this shape:

```
apps/api/src/modules/<module>/
  index.ts            # the ONLY file other modules may import
  <module>.module.ts
  <module>.service.ts
  controllers/
  repository/
  dto/
  events/
  internal/
```

`index.ts` re-exports exactly what other modules are allowed to use (the
Nest module class, and any public service/types) — nothing else. A file in
one module may only import another module through that module's `index.ts`;
importing `modules/<other>/internal/...`, `modules/<other>/repository/...`,
etc. directly is a lint error (`boundaries/entry-point`,
`packages/config/eslint/boundaries.mjs`). This is how
`02-architecture.md` §4 rule 6 ("a lint rule blocks imports across module
internals") is enforced, and how rule 1 ("a module reads and writes only its
own tables, reaching other data through that module's service") is checked
by tooling rather than by convention alone.

### Example: `health`

`modules/health/index.ts` exports `HealthModule`. Nothing outside
`modules/health` imports `modules/health/health.service.ts` or
`modules/health/controllers/health.controller.ts` directly — only
`HealthModule`, from `index.ts`.

The full module list (identity-access, verification, tutor-profiles,
discovery, booking, sessions-safety, payments-ledger, learning, reviews,
messaging, admin-audit, marketplace, classroom) is scaffolded in S1-05.
