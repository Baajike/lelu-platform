# Backend

Every API route, what it does, and who can call it. Source of truth is `app/api/.../route.js` — this is the prose index.

Auth conventions:

- `Authenticated` — `getServerSession(authOptions)` must return a session.
- `HEAD_ROLES = ["HEAD_OF_UNIT", "ADMIN"]`
- `ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"]`
- `APPROVAL_ROLES = ["HEAD_OF_UNIT", "OFFICE_ADMINISTRATOR", "ADMIN"]`

For request/response shapes, see `API_REFERENCE.md`.

---

## Authentication

### `POST /api/auth/[...nextauth]`, `GET /api/auth/[...nextauth]`

NextAuth handler. Credentials provider. JWT session strategy. `authorize` callback:

- Looks up `User` by email.
- Compares `bcrypt`.
- Throws `DEACTIVATED` if the user is deactivated.
- Throws `PENDING_APPROVAL` if not approved (or `DEACTIVATED` if both flags set).
- On success: writes `lastActive` in the `jwt` callback, attaches `id` and `role` to the session.

### `POST /api/auth/register`

Public (no auth). Body: `{ name, email, password, role? }`.

- `role === "ADMIN"` → 403 (never assignable via registration).
- Allowed roles via registration: `HEAD_OF_UNIT` and `OFFICER`. Anything else is coerced to `OFFICER`.
- If `role === "HEAD_OF_UNIT"` and one already exists → 400. Otherwise the first HEAD_OF_UNIT is auto-approved.
- All others are created with `approved: false`.

---

## Cases

### `GET /api/cases`
Authenticated. Returns cases visible to the user:

- ADMIN_ROLES: all cases (or filtered by `?officerId=<id>`).
- Others: cases they own (`officerId === me`) OR cases they have an `Accepted` `CaseAssignment` for.

Includes: officer, latest entry (take 1), caseAssignments + their users, `_count.entries`.

### `POST /api/cases`
Authenticated. Body: `{ title, category, description }`. Creates a `Case` with a generated `caseNumber` (`LELU-YYYY-NNN`) and writes a `CaseActivity` row.

### `GET /api/cases/[id]`
Authenticated. Returns the full case with `entries`, `cdrRequests`, `caseActivities`, `caseAssignments` (with users). Side effect: registers the caller in the in-memory `viewerStore` for the case. Also computes and returns `relatedCases[]` via the correlation engine (scans other cases' journal text + CDR phone numbers for matching identifiers).

### `PATCH /api/cases/[id]`
Authenticated. Authorized if any of: HEAD_OF_UNIT/ADMIN, owner (`officerId === me`), accepted assignee. Body: any updatable Case field (typically `{ status, closedAt, closureReason }`). Writes a `CaseActivity` row for `Closed`/`Declined`/`Active` transitions.

### `DELETE /api/cases/[id]`
HEAD_OF_UNIT or ADMIN only. Transactional cleanup: deletes `JournalEntry`, `CdrRequest`, `CaseActivity` rows for this case; nulls `caseId` on linked `InternationalRequest`s; deletes the case. `CaseAssignment` cascades automatically.

### `GET /api/cases/[id]/viewers`
Authenticated. Refreshes the caller's viewer timestamp in `viewerStore` (keep-alive), returns the list of *other* viewers. Polled every 30 s by the case detail page.

### `DELETE /api/cases/[id]/viewers`
Authenticated. Removes the caller from the viewer list. Fired on page unmount.

### `POST /api/cases/[id]/entries`
Authenticated. Body: `{ content, actions? }`. Computes `dayNumber = existingCount + 1`. Creates a `JournalEntry` and a `CaseActivity` (`"Journal entry added"`).

### `GET /api/cases/[id]/assignments`
Authenticated. Returns all `CaseAssignment` rows for the case, with users.

### `POST /api/cases/[id]/assignments`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR case owner. Body: `{ userId }`. Creates a Pending assignment (or revives a previously Declined one by flipping it to Pending). Creates a `Notification` of type `CASE_INVITATION` for the invited user. Writes a `CaseActivity`.

### `PATCH /api/cases/[id]/assignments`
Authenticated. Body: `{ assignmentId, action: "accept" | "decline" }`. Only the assignee themselves can respond, and only while status is `Pending`. Flips `status` to `Accepted` or `Declined`, marks the matching notification as read, writes a `CaseActivity`.

### `DELETE /api/cases/[id]/assignments`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR case owner. Body: `{ userId }`. Hard-deletes the assignment, marks any pending invitation notification as read, writes a `CaseActivity`.

### `GET /api/cases/activity`
Authenticated. Returns the latest 10 `CaseActivity` rows globally, or `?me=true` for only the caller's own actions. Used by the dashboard "Recent Activity" timeline.

---

## CDR requests

### `GET /api/cdr`
Authenticated.

- `?assigned=true` → CDRs assigned to me (`assignedTo === me`).
- Otherwise: ADMIN_ROLES see all (or filtered by `?officerId=`); non-admins see their own requests only.

Includes: linked case, officer, assignedUser.

### `POST /api/cdr`
Authenticated. Body: `{ phoneNumber, identifierType?, telco?, periodStart, periodEnd, reason, caseId? }`. Creates the request. If linked to a case, writes a `CaseActivity` ("CDR request logged").

### `PATCH /api/cdr/[cdrId]`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR request creator. Body subset: `{ status, receivedAt, attachmentPath, attachmentName, assignedTo, assignedAt }`. Each is conditionally applied if present.

### `DELETE /api/cdr/[cdrId]`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR request creator. Hard delete.

---

## Journal entries (top-level)

### `GET /api/entries`
Authenticated. Returns journal entries the caller can see:

- ADMIN_ROLES: all entries.
- Others: entries whose case they own OR whose case they have an `Accepted` assignment for.

Used by dashboard widgets that need entry counts / authorship across multiple cases.

### `PATCH /api/entries/[entryId]`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR entry author. Body: `{ content }`. (Only `content` editable, not `dayNumber`.)

### `DELETE /api/entries/[entryId]`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR entry author. Hard delete.

---

## International requests

### `GET /api/international`
Authenticated. ADMIN_ROLES: all (or `?officerId=`); others: their own.

### `POST /api/international`
Authenticated. Body: `{ direction, country, agency, subject, details?, priority, caseId? }`. Generates `refNumber` (`LELU-INTL-YYYY-NNN`).

### `PATCH /api/international/[reqId]`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR creator. Body subset: `{ status, respondedAt, attachmentPath, attachmentName }`.

### `DELETE /api/international/[reqId]`
Authenticated. Authorized: HEAD_OF_UNIT/ADMIN OR creator. Hard delete.

---

## Notifications

### `GET /api/notifications`
Authenticated. Returns the caller's *unread* notifications, ordered by `createdAt desc`. `CASE_INVITATION` rows are enriched with live `assignmentStatus` (re-read from `CaseAssignment` at request time) so the UI can show Accepted/Declined state without stale cache.

### `POST /api/notifications`
Authenticated. Body: `{ userId, type, title, message, link?, meta? }`. Used internally for creating notifications. (No UI surface — exposed primarily for completeness.)

### `PATCH /api/notifications`
Authenticated. Body: `{ id }` to mark one read, or `{ all: true }` to mark all of the caller's notifications read.

---

## Search

### `GET /api/search?q=<term>`
Authenticated. Min 3 chars. Cross-searches:

- `CdrRequest.phoneNumber` (contains)
- `Case.title`, `Case.description` (contains, OR)
- `JournalEntry.content`, `actions` (contains, OR)
- `InternationalRequest.subject`, `details` (contains, OR)

Returns `{ cdrs, cases, entries, intel }`, each capped at 10 records. Powers:

- Intel DB page (`/dashboard/fraud`)
- Journal entry duplicate detection (on blur)
- CDR submission duplicate detection (on blur of identifier field)

---

## Uploads

### `POST /api/upload`
Authenticated. `multipart/form-data` with field `file`. Sanitises the filename (`[^a-zA-Z0-9._-]` → `_`), prefixes with a timestamp, writes to `public/uploads/`. Returns `{ path: "/uploads/<safeName>", name: <original> }`.

No MIME validation. No size limit beyond Next.js's default (~4 MB body). No virus scan.

---

## Reports

### `GET /api/reports/data`
Authenticated. Three modes:

- `?team=true` (SUPERVISOR/HEAD_OF_UNIT/ADMIN) — full team breakdown across cases, CDRs, international, entries, and users in the given date range.
- `?type=case&caseId=<id>` — single case rollup (officer, all entries by `dayNumber`, all CDRs, all international requests).
- Default — cases, CDRs, activity reports, international requests in the date range, optionally filtered by `?officerId=`.

Date range comes from `?from=` and `?to=` (ISO strings); defaults to year-to-date.

### `GET /api/reports/activity`
Authenticated. Returns every `ActivityReport`, newest first.

### `POST /api/reports/activity`
Authenticated. Body: `{ weekStart, weekEnd, summary, casesWorked, challenges, nextSteps }`. Creates an `ActivityReport` for the caller.

---

## Users

### `GET /api/users`
Authenticated. Filters by query string:

- `?pending=true` — accounts awaiting approval (`approved: false`, `deactivated: false`, role ≠ ADMIN).
- `?deactivated=true` — deactivated accounts.
- `?withStats=true` — approved, non-ADMIN users with `_count.cases`, `_count.cdrRequests`, this-week's entries, current active cases. Used by the Team Overview dashboard widget.
- (none) — all approved, non-deactivated, non-ADMIN users (basic profile fields).

### `GET /api/users/me`
Authenticated. Returns the caller's own profile (`id, name, email, role, approved, cdrAccess, createdAt`).

### `PATCH /api/users/me`
Authenticated. Two modes:

- `{ name }` — update display name.
- `{ action: "change_password", currentPassword, newPassword }` — verifies current password via bcrypt; rejects if `newPassword.length < 8`; updates the hash.

### `DELETE /api/users/[userId]`
HEAD_OF_UNIT only. Refuses to delete self. Nullifies all FK references (cases, entries, CDR requests, international requests, activity reports) then deletes the User row.

### `PATCH /api/users/[userId]/approve`
Action-dispatch endpoint. Body: `{ action, ... }`. Required role per action:

| Action | Role |
|---|---|
| `cdrAccess: <bool>` (no `action`) | HEAD_OF_UNIT / ADMIN |
| `approve` | APPROVAL_ROLES |
| `reject` | APPROVAL_ROLES (hard delete) |
| `deactivate` | HEAD_OF_UNIT / ADMIN (sets `approved: false`, `deactivated: true`) |
| `reactivate` | HEAD_OF_UNIT / ADMIN (sets `approved: true`, `deactivated: false`) |
| `reset_password` | HEAD_OF_UNIT / ADMIN (body also requires `newPassword`, min 8 chars) |

### `GET /api/users/check-head`
**Public** — no auth required. Returns `{ headExists: <bool> }`. Used by `/register` to decide whether to allow HEAD_OF_UNIT registration.

---

## Cross-cutting behavior

- **Errors.** Every handler wraps the body in `try/catch` and returns `{ error: <message> }` with 4xx / 500. Stack traces are not exposed.
- **Audit logging.** Case-mutating routes always attempt to write a `CaseActivity` row. The write is wrapped in `.catch(() => {})` so a failed log won't break the parent operation.
- **Status codes.**
  - 200 — success (GET/PATCH/DELETE)
  - 201 — created (POST that creates a row)
  - 400 — validation failure
  - 401 — no session
  - 403 — wrong role / not authorized
  - 404 — entity not found
  - 409 — conflict (e.g., duplicate invitation)
  - 500 — uncaught exception
