# Tech Stack

Every technology in `package.json` and the deployment, with a one-line rationale.

## Application runtime

| Tech | Version | Why it's here |
|---|---|---|
| **Node.js** | 22 (production) | Long-term support, native fetch, `await params` in route handlers. |
| **Next.js** | 16.1.6 | App Router for colocated routes + page handlers. Server Components were available but the dashboard intentionally uses Client Components everywhere because `useSession()` needs the client context. |
| **React** | 19.2.3 | Comes with Next 16; used as the rendering layer. No experimental features (Server Actions, etc.) in use. |
| **PostgreSQL** | 14+ recommended | Single source of truth. Chosen over SQLite for: concurrent writes (multiple officers updating cases), production hosting on a real DB server, and FK cascade behavior that's well-defined under load. |

## Auth & cryptography

| Tech | Why |
|---|---|
| **NextAuth.js 4** | Battle-tested for credentials flows. JWT strategy chosen so the session is stateless — no separate session table to maintain. |
| **bcryptjs 3** | Password hashing (cost factor 10). Pure-JS (no native build) so it works the same on dev (Windows) and prod (Linux). |
| **NEXTAUTH_SECRET** | 32-byte random secret, used to sign JWTs. Generated with `openssl rand -base64 32`. |

## Database access

| Tech | Why |
|---|---|
| **Prisma 5.22** | Type-safe queries even in JS (autocomplete via JSDoc inference), migration tooling, generated client. Output is to `app/generated/prisma` (not the default `node_modules/.prisma`) — this lets the Linux binary be committed in production. |
| **@next-auth/prisma-adapter** | Listed in dependencies but **not** actively wired (current setup uses JWT strategy without a DB-backed session table). Safe to leave; pulling it would require a package.json edit. |

## Frontend

| Tech | Why |
|---|---|
| **lucide-react** | Icon set. ~25 distinct icons used across the dashboard. Tree-shakes per icon import. |
| **Inline styles** | Convention across every page. Originally an attempt at fast iteration; now ingrained. There is no styled-components, no CSS modules, no theme provider. |
| **Tailwind 4 + PostCSS** | Installed but **not used** in any rendered component. Removing it would simplify the build; leaving it costs ~no runtime weight (purged in production builds). |

## Build tooling

| Tech | Why |
|---|---|
| **ESLint 9** + **eslint-config-next** | Default Next.js ruleset; `.next/**`, `out/**`, `build/**` ignored explicitly. |
| **PostCSS** | Required because Tailwind is installed. |
| **Prisma `postinstall` hook** | `npm install` automatically regenerates the Prisma client. This prevents the "client is stale after pull" bug. |

## Deployment

| Tech | Why |
|---|---|
| **PM2** | Process manager. Auto-restart on crash, `pm2 startup` enrolls it as a systemd service so the app survives reboots. |
| **nginx** | Reverse proxy on `:80`/`:443` → `:3000`. Config in `lelu-nginx.conf`. Handles TLS termination (when a domain is configured via `setup-domain.sh`). |
| **Ubuntu 20.04 / 22.04** | Target server OS — the `setup.sh` scripts assume `apt`. |
| **Bash setup scripts** | `setup.sh` installs PostgreSQL + nginx + PM2 and validates `.env`. `setup-domain.sh` extends with a domain + Let's Encrypt cert. `update.sh` runs the pull/migrate/build/restart sequence. |

## What's NOT here, and why

- **No TypeScript.** The project was scaffolded in JS and the team is comfortable there. Don't introduce `.ts` without a wider conversion.
- **No state management library** (Redux/Zustand). Each page is self-contained; cross-page state is held in NextAuth session or fetched on mount.
- **No SWR / React Query.** Data fetching is plain `fetch` in `useEffect`. Some routes are polled at 30 s intervals (notifications, case viewers) via `setInterval`.
- **No CI/CD pipeline.** Deployments are manual via `update.sh` on the server.
- **No test suite.** Manual QA only. This is a known gap — flagged in `PROJECT_STATUS.md`.
- **No observability stack** beyond `pm2 logs`. No Sentry, Datadog, or structured logging.
- **No Docker.** The deployment is bare-metal under PM2.
- **No Redis / queue.** The in-memory `viewerStore` is intentional for its narrow use case; everything else hits PostgreSQL directly.

## Versions worth pinning attention on

- **Prisma 5.22**, not 6. Upgrading to 6 will likely require regenerating migrations and updating the client output path conventions.
- **next-auth 4**, not Auth.js v5. The session/JWT callback shape changes in v5; an upgrade is non-trivial.
- **Next.js 16**, not 15. The README still says "Next.js 15" — outdated but harmless.
