# Architecture

How LELU's pieces connect. Read top-to-bottom for a coherent picture, or jump to "Data flow" for specific request types.

## High-level shape

```
┌──────────────────────────────────────────────────────────────┐
│                         Browser (officer)                     │
│                                                                │
│   /login → /dashboard → role-tailored sections + tools         │
│                                                                │
└────────────────┬──────────────────────────┬───────────────────┘
                 │ session cookie (JWT)     │ fetch + JSON
                 ▼                          ▼
┌──────────────────────────────────────────────────────────────┐
│                      Next.js 16 (App Router)                  │
│                                                                │
│   app/dashboard/...       — Client Components, useSession()   │
│   app/api/auth/...        — NextAuth handler (JWT strategy)   │
│   app/api/{cases,cdr,...} — Route handlers, getServerSession  │
│                                                                │
│   app/lib/db.js           — Prisma singleton                  │
│   app/lib/viewerStore.js  — in-memory active viewers          │
└────────────────┬──────────────────────────┬───────────────────┘
                 │ Prisma client            │ fs.writeFile
                 ▼                          ▼
┌──────────────────────────────┐  ┌────────────────────────────┐
│  PostgreSQL (single DB)       │  │  public/uploads/           │
│                               │  │                            │
│  Users, Cases, JournalEntries │  │  Timestamped CDR + Intl    │
│  CdrRequests, ActivityReports │  │  attachments (raw files)   │
│  Notifications, etc.          │  │                            │
└──────────────────────────────┘  └────────────────────────────┘
```

There is no message queue, no cache, no separate worker. Everything is request-driven against PostgreSQL.

## Process & deployment topology

- **One Node process** (`next start`) running under PM2 as `lelu-platform`.
- **nginx** terminates HTTPS (if a domain is configured) and reverse-proxies to `127.0.0.1:3000`.
- **PostgreSQL** runs on the same host, accepting only loopback connections.
- **Static uploads** are written to `public/uploads/` on the same filesystem.

Because PM2 runs a single instance and `viewerStore` is in-memory, you can't horizontally scale this app today — see "Constraints" below.

## Layered code structure

### 1. Edge / routing (`app/`)

Next.js App Router resolves URLs:

- `app/page.js` — public splash, "Enter Platform" → `/login`.
- `app/login/page.js`, `app/register/page.js` — public auth pages.
- `app/layout.js` — root layout, wraps everything in `<SessionProvider>`.
- `app/dashboard/layout.js` — sidebar + topbar; redirects to `/login` if `status === "unauthenticated"`. Renders the notification bell with five distinct buckets (personal, pending approvals, stale cases, overdue CDRs, overdue intl).
- `app/dashboard/{cases,cdr,...}/page.js` — feature pages, all Client Components.

### 2. API handlers (`app/api/.../route.js`)

Each `route.js` exports `GET / POST / PATCH / DELETE` as needed. Every protected handler follows the same pattern:

```js
const session = await getServerSession(authOptions);
if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

// role check (if needed)
if (!HEAD_ROLES.includes(session.user.role)) return Response.json(..., 403);

// Prisma operation
const result = await db.case.findMany({ ... });
return Response.json(result);
```

There are 24 route files; see `BACKEND.md` for the per-route breakdown.

### 3. Data layer (`app/lib/db.js` + Prisma)

`db.js` exports a Prisma singleton that's safe under Next.js HMR — the client is reused across hot-reloads in development via `globalThis.prisma`. In production it's instantiated once per process.

All routes import the same singleton; there's no connection pool to manage manually — Prisma handles it.

### 4. In-memory (`app/lib/viewerStore.js`)

A single mutable object `{ [caseId]: [{ userId, userName, timestamp }] }` is shared across route handlers in the same process. Entries auto-expire after 5 minutes. Used by:

- `GET /api/cases/[id]` — registers the viewer on case page load.
- `GET /api/cases/[id]/viewers` — polled every 30 s by the case detail page; returns others viewing the same case.
- `DELETE /api/cases/[id]/viewers` — fired on page unmount.

## Data flow — three representative requests

### A) Officer opens a case detail page

1. Browser: `GET /dashboard/cases/[id]` (Client Component).
2. Effect: `fetch("/api/cases/" + id)`.
3. Server: `getServerSession` → check JWT cookie → resolve user.
4. Prisma: read case with `officer`, `entries`, `cdrRequests`, `caseActivities`, `caseAssignments` includes.
5. Server runs the **correlation engine**: scans every other case's journal entries and CDR phone numbers for matches against this case's identifiers. Returns `relatedCases` alongside the case payload.
6. Server: `upsertViewer(caseId, userId, userName)` in `viewerStore`.
7. Browser renders. A separate `setInterval` polls `/api/cases/[id]/viewers` every 30 s and surfaces a yellow co-viewer banner if anyone else is on the same case.

### B) Officer adds a journal entry

1. UI: textarea + "Save Entry" button.
2. Client also fires `/api/search?q=<token>` as the user blurs the textarea — if the entry mentions a phone or email that already appears elsewhere in the system, a yellow duplicate warning shows.
3. `POST /api/cases/[id]/entries` with `{ content, actions }`.
4. Server: count existing entries → `dayNumber = count + 1` → create entry.
5. Server: write a `CaseActivity` row (`action: "Journal entry added"`) for audit.
6. Client refetches the case.

### C) HEAD_OF_UNIT invites another officer to a case

1. UI: Invite modal opens, lists eligible officers (filtered by `allInvitableStaff` — excludes owner, accepted, pending).
2. `POST /api/cases/[id]/assignments` with `{ userId }`.
3. Server: authorize (owner or HEAD/ADMIN), check for existing assignment, upsert `CaseAssignment` with `status: "Pending"`.
4. Server: create a `Notification` row of type `CASE_INVITATION` with `link` and `meta = { assignmentId, caseId }`.
5. Server: write a `CaseActivity` row.
6. The invited user's dashboard layout polls `/api/notifications` every 30 s → the bell badge updates → they click Accept or Decline → `PATCH /api/cases/[id]/assignments` flips the status and the notification is marked read.

## Cross-cutting concerns

### Authentication

- NextAuth handles session establishment. The Credentials provider hashes-compares with bcrypt; on success it returns a minimal user object.
- `jwt` callback writes `id` and `role` onto the token.
- `session` callback reads `id` and `role` off the token onto `session.user`.
- The session is a JWT cookie — there's no DB-backed session table.

### Authorization

There's no central authz layer; each route handler checks `session.user.role` against the action's required roles. The conventions are documented in `CLAUDE.md`. The case-detail PATCH handler also checks `caseAssignments` to grant accepted assignees write access.

### Audit logging

Every meaningful case state change inserts a `CaseActivity` row (case opened, closed, declined, reopened, entry added, officer invited/removed). The case detail page renders these as a timeline at the bottom. The activity log can't be edited or deleted from the UI.

### Notifications

Two distinct concepts:

- **`Notification` rows** — personal, persisted, addressable. Used for case invitations and (in future) any 1:1 message. Read state tracked.
- **Computed alerts** — stale cases, overdue CDRs, overdue international requests, pending registrations. Not stored — recomputed on each dashboard layout mount by the layout's `useEffect`. The bell badge sums both kinds.

### Search / correlation

- **`GET /api/search`** does case-insensitive `contains` queries across `CdrRequest.phoneNumber`, `Case.title|description`, `JournalEntry.content|actions`, and `InternationalRequest.subject|details`. Min query length 3. Used by the Intel DB page, the journal entry duplicate-check, and the CDR submission duplicate-check.
- **Case correlation engine** (in `GET /api/cases/[id]`) is structurally different — it normalises phone numbers from this case's text (regex extraction), then scans other cases' text for those identifiers, returning a `relatedCases[]` array. This runs on every case detail load; it's O(cases × entries) and will need indexing or caching if the dataset grows past a few thousand entries.

### File uploads

`POST /api/upload` writes any `multipart/form-data` file to `public/uploads/<timestamp>_<sanitized_name>`. Filename sanitization regex is `[^a-zA-Z0-9._-] → _`. Static serving is handled directly by Next.js. There's no virus scan, no MIME validation, no size limit beyond Next.js's default.

## Constraints worth knowing

- **Single-process.** `viewerStore` is in-memory; the personal notification poll is per-process. If you scale to multiple PM2 instances, viewers from instance A won't appear on instance B. Move to Redis (or accept the limitation) before adding instances.
- **No background jobs.** Stale-case detection runs on every dashboard load instead of in a cron. For a few hundred cases this is fine; for tens of thousands it isn't.
- **Polling, not push.** Notifications and viewers use 30 s `setInterval`. There's no WebSocket / Server-Sent Events.
- **No rate limiting.** A malicious authenticated user can hammer any endpoint. Trusted internal network is the implicit boundary.
- **Inline styles, no design system primitives.** A button is defined inline at each call site. Visual changes require finding every instance.
