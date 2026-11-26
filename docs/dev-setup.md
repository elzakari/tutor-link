# Local development setup

For the stack and commands overview see the root `CLAUDE.md`. This page is
the step-by-step walkthrough and port-clash troubleshooting (S1-02).

## 1. Clone

```bash
git clone <repo-url>
cd tutor-link
```

## 2. Install

```bash
pnpm install
```

Requires the Node.js version pinned in `package.json#engines` and Docker
Desktop (or another Docker Engine) running locally.

## 3. Start local services

```bash
pnpm docker:up
```

Starts four containers, defined in `infra/docker/docker-compose.yml`:

| Service | What it is | Default host port(s) |
| --- | --- | --- |
| `postgres` | PostgreSQL 16 with PostGIS | 5432 |
| `redis` | Redis 7 | 6379 |
| `minio` | S3-compatible object storage | 9000 (API), 9001 (console) |
| `mailpit` | Local email capture (no real sending) | 1025 (SMTP), 8025 (web UI) |

A fifth, one-shot `minio-init` container creates two private buckets,
`tl-private` and `tl-public-assets`, then exits — `docker compose ps`
showing it as `Exited (0)` is expected, not a failure.

Check everything is up:

```bash
docker compose -f infra/docker/docker-compose.yml ps
```

All four long-running services should show `healthy`.

Other commands:

```bash
pnpm docker:down    # stop the containers, keep their data
pnpm docker:reset   # stop the containers AND delete their data volumes
                     # (asks "yes" to confirm — never run this unattended)
```

## 4. Copy the environment files

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Both files list every variable with a one-line comment. The defaults match
`infra/docker/docker-compose.yml`'s defaults, so if you did not change any
port in step 3 you do not need to edit anything.

`apps/api/src/config/env.schema.ts` validates `apps/api/.env` with Zod at
boot: if a required variable is missing or invalid, the API prints which
one(s) and exits non-zero instead of starting in a broken state.

## 5. Run

```bash
pnpm dev
```

Starts `apps/web` and `apps/api` together (Turborepo). Web: http://localhost:3000. API: http://localhost:3001/api/v1 (port 3001 unless you changed `PORT` in `apps/api/.env`).

## Troubleshooting: port clashes

If `pnpm docker:up` fails with something like
`Ports are not available: ... bind: ... already in use`, another process on
your machine already holds that port (another project's database, a
natively installed Postgres/Redis service, etc.).

Find what is using a port, then either stop it or give `docker:up` a
different one for just this session:

```bash
# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 5432 | Select-Object OwningProcess

# macOS / Linux
lsof -i :5432
```

Override any of the four services' host ports with an environment variable
on the same command — the container's internal port, and every other
service, stays the same:

```bash
POSTGRES_PORT=5434 pnpm docker:up
```

| Service | Override variable(s) |
| --- | --- |
| `postgres` | `POSTGRES_PORT` |
| `redis` | `REDIS_PORT` |
| `minio` | `MINIO_PORT`, `MINIO_CONSOLE_PORT` |
| `mailpit` | `MAILPIT_SMTP_PORT`, `MAILPIT_UI_PORT` |

If you changed a port, update the matching variable in `apps/api/.env`
(`DATABASE_URL`, `REDIS_URL`, `S3_PORT`, `SMTP_PORT`) to match before running
`pnpm dev`.

To stop guessing and just free the whole stack, `pnpm docker:reset` removes
the containers and their volumes so you can start clean on the default
ports.
