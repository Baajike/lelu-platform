# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project overview

**LELU** (Law Enforcement Liaison Unit) is an internal intelligence management platform for the Ghana Police Service. Officers use it to open and document cases, request Call Data Records from telcos, file international cooperation requests via Interpol/24/7 networks, log weekly activity reports, and search across the system for shared identifiers. Role-based access controls everything an authenticated user can see or do.

It is a single-tenant deployment running on a Linux server behind nginx on a fixed port (`:3000`), supervised by PM2. There is no multi-tenancy, no public sign-up flow, and no external integrations — all data lives in the project's own PostgreSQL database.

## Tech stack (quick reference)

| Layer | Choice |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| UI | React 19, inline styles, `lucide-react` icons |
| Auth | NextAuth 4 — Credentials provider, JWT session |
| ORM | Prisma 5.22 (generated client output to `app/generated/prisma`) |
| Database | PostgreSQL (dev and prod — see "Database notes") |
| Hashing | `bcryptjs` |
| Server runtime | Node 22, PM2 supervised |

Tailwind 4 is installed but not actually used — pages and components use inline styles. Don't introduce Tailwind classes unless you're refactoring an entire section and have approval; inline styles are the prevailing convention and you'll create visual inconsistency by mixing.

## File structure

```
lelu-platform/
├── app/
│   ├── api/                       # Route handlers (all backend lives here)
│   │   ├── auth/[...nextauth]/    # NextAuth handler — exports authOptions
│   │   ├── auth/register/         # New user registration
│   │   ├── cases/                 # /api/cases, /api/cases/[id], nested entries/assignments/viewers
│   │   ├── cdr/                   # CDR requests
│   │   ├── entries/               # Top-level journal endpoints
│   │   ├── international/         # 24/7 network requests
│   │   ├── notifications/         # In-app notifications
│   │   ├── reports/               # Report data + activity reports
│   │   ├── search/                # Cross-system search
│   │   ├── upload/                # File uploads to /public/uploads
│   │   └── users/                 # User management, approval, profile
│   ├── dashboard/                 # Protected app pages
│   │   ├── layout.js              # Sidebar + topbar + notification panel
│   │   ├── page.js                # Main dashboard
│   │   ├── cases/                 # List + detail
│   │   ├── cdr/, fraud/, international/, reports/, admin/, profile/
│   ├── generated/prisma/          # Generated Prisma client (DO NOT EDIT)
│   ├── lib/
│   │   ├── db.js                  # Prisma singleton
│   │   └── viewerStore.js         # In-memory active-viewer tracking
│   ├── login/page.js              # Login
│   ├── register/page.js           # Registration
│   ├── page.js                    # Splash / landing
│   └── layout.js                  # Root layout (SessionProvider)
├── prisma/
│   ├── schema.prisma              # Single source of truth for DB
│   ├── seed.js                    # No-op seed (no default users)
│   └── migrations/                # All migrations, PostgreSQL-flavored SQL
├── public/                        # Static assets + uploads/ subdir at runtime
├── docs/                          # Project documentation (you're contributing here)
├── README.md                      # End-user setup guide
├── setup.sh, setup-domain.sh      # Bootstrap scripts (PostgreSQL + nginx)
├── update.sh                      # Production update flow
├── lelu-nginx.conf                # Production nginx config
├── .env.example                   # Three env vars
└── package.json
```

## Key conventions

- **App Router**, not Pages Router. Every route is `app/.../page.js` or `app/api/.../route.js`. There is no `src/` directory.
- **No TypeScript.** Everything is `.js`. Don't introduce `.ts` files.
- **Server-side auth at the top of every API handler:**
  ```js
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  ```
  Role checks use string arrays: `["HEAD_OF_UNIT", "ADMIN"].includes(session.user.role)`. Conventions in the codebase:
  - `HEAD_ROLES = ["HEAD_OF_UNIT", "ADMIN"]` — destructive/admin actions
  - `ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"]` — case visibility (sees all officers' cases)
  - `APPROVAL_ROLES = ["HEAD_OF_UNIT", "OFFICE_ADMINISTRATOR", "ADMIN"]` — user approval
- **Roles:** `HEAD_OF_UNIT | SUPERVISOR | OFFICE_ADMINISTRATOR | OFFICER | ADMIN`. `HEAD_OF_UNIT` is the top operational role; `ADMIN` is a technical superuser. `OFFICER` is the default.
- **User approval gate.** Newly-registered users are not `approved` until a HEAD_OF_UNIT / OFFICE_ADMINISTRATOR / ADMIN approves them. The login flow throws `PENDING_APPROVAL` (or `DEACTIVATED`) if the account isn't usable yet. The very first HEAD_OF_UNIT registered is auto-approved.
- **IDs are CUIDs.** Don't introduce auto-increment numeric IDs.
- **Soft delete for users.** When a HEAD_OF_UNIT deletes a user (`DELETE /api/users/[userId]`), the handler nullifies FK references on `Case.officerId`, `JournalEntry.authorId`, `CdrRequest.officerId`, `InternationalRequest.officerId`, `ActivityReport.officerId` before deleting the user, so historical case data survives.
- **Hard delete for cases** (DELETE handler added recently). A transaction deletes journal entries, CDR requests, case activities, and nulls international requests' `caseId`, then deletes the case. `CaseAssignment` cascades automatically via FK.
- **Inline styles + Segoe UI font.** Buttons follow a pattern: `padding: "10px 22px"`, `borderRadius: 4`, `fontSize: 12`, `fontWeight: 600`, `cursor: "pointer"`, `fontFamily: "'Segoe UI', sans-serif"`. See `docs/DESIGN.md` for the palette.
- **No "next/dynamic" for client components.** All dashboard pages start with `"use client"` and use `useSession()` from `next-auth/react`.

## What NOT to change

- **`app/generated/prisma/`** — regenerated from `schema.prisma` via `prisma generate` (also runs automatically via `postinstall`). Never hand-edit. If files there look wrong, run `npx prisma generate`.
- **Datasource provider** in `prisma/schema.prisma`. Commit `6c5bd07` is "revert schema provider back to postgresql" — there's a history of accidental SQLite reverts breaking production. The current value is `provider = "postgresql"`. Leave it alone unless you have explicit instructions.
- **Migration files.** Once committed, migration SQL is immutable. To change the schema, run `npx prisma migrate dev --name <change>` to generate a new migration; never edit existing ones.
- **The `app/generated/prisma/schema.prisma`** copy — that's a duplicate emitted by `prisma generate`. The authoritative file is `prisma/schema.prisma`.
- **`viewerStore.js`** is in-memory and process-local on purpose. Don't try to "improve" it into Redis without architectural discussion — it's only used for a 5-minute "X is also viewing this case" warning and the data is genuinely ephemeral.
- **Inline-style consistency.** Don't convert a single component to Tailwind. The visual language must hold across the whole dashboard.

## Database notes

The codebase is PostgreSQL end-to-end as of commit `8f33c28` ("production ready: postgresql"). The earlier SQLite history was converted in commit `99fbe7c` ("convert all migrations from SQLite to PostgreSQL compatible SQL"). All migrations now use PostgreSQL-specific syntax (`TIMESTAMP`, `BOOLEAN`, `DO $$ ... EXCEPTION` blocks). Both the user's local dev environment and production use PostgreSQL.

If a developer wants SQLite for offline dev, they'd have to:
1. Change `provider = "sqlite"` in `prisma/schema.prisma`
2. Rewrite affected migrations (PostgreSQL-only syntax won't run)
3. Switch the binary target in the Prisma client

This is **not supported** as a current workflow — don't help anyone half-do it. Push them onto a real local PostgreSQL via the README setup steps.

### Running migrations

| Situation | Command |
|---|---|
| Local dev — add a schema change | `npx prisma migrate dev --name <descriptive_name>` |
| Production — apply existing migrations | `npx prisma migrate deploy` |
| Regenerate Prisma client | `npx prisma generate` |
| Inspect the DB | `npx prisma studio` |

After pulling new code in production: `git pull && npx prisma migrate deploy && npx prisma generate && pm2 restart lelu-platform`. The `update.sh` script automates this.

A schema model added without a corresponding migration will break production with `relation "X" does not exist` — this happened once already with `CaseAssignment` and `Notification` (fixed in `20260529000000_add_case_assignment_and_notification`). Before merging schema changes, verify a matching migration was generated.

## Common commands

```bash
npm run dev                    # next dev (local development)
npm run build && npm start     # production-style local run
npx prisma migrate deploy      # apply migrations
npx prisma generate            # regenerate client (postinstall runs this automatically)
pm2 restart lelu-platform      # production restart
pm2 logs lelu-platform         # tail production logs
sudo ss -tlnp | grep 3000      # find orphan next-server on prod
```

## Related docs

The `docs/` folder has:

- **PROJECT_REQUIREMENTS.md, APP_FLOW.md** — what the system does and how users move through it
- **ARCHITECTURE.md, BACKEND.md, FRONTEND_STRUCTURE.md** — code structure
- **DATABASE_SCHEMA.md, API_REFERENCE.md** — exact field-level reference
- **CHANGELOG.md** — feature history with commit anchors
- **DESIGN.md** — colors, typography, button patterns
- **SECURITY_CHECKLIST.md, PROJECT_STATUS.md** — operational
- **ENVIRONMENT_SETUP.md, TECH_STACK.md** — onboarding
- Existing **ADMIN_GUIDE.md, USER_GUIDE.md, TECHNICAL.md, SECURITY.md, server docs.md** — handover docs for the deployed system

When you change something significant, update `CHANGELOG.md` and the most relevant reference doc; don't sprawl notes across new files.
