# App Flow

User journeys, top-to-bottom. Each flow describes what the user sees and what the system does behind it. Routes named throughout reference `/dashboard/...` paths and `/api/...` calls.

---

## 0. First touch — splash and login

```
/  (splash page)  →  /login  →  /dashboard
```

The root `app/page.js` shows a centred CSA logo, the LELU title, and an "Enter Platform" button. Click → `/login`.

**Login** (`/login/page.js`):
- Email + password form.
- Submit calls NextAuth's credentials provider.
- On success: redirected to `/dashboard`.
- On failure: error string from NextAuth (`PENDING_APPROVAL`, `DEACTIVATED`, or generic).

**No registration link from login** — `/register` is direct-link-only (the URL is shared by the HEAD when onboarding new officers).

---

## 1. New officer registration

```
/register  →  pending state  →  HEAD approves  →  officer logs in
```

`/register/page.js`:
- Form: name, email, password, role.
- Role options: OFFICER (default), HEAD_OF_UNIT (only shown if `GET /api/users/check-head` returns `{ headExists: false }`).
- Submits to `POST /api/auth/register`.
- Response: `{ autoApproved: true }` only for the first HEAD_OF_UNIT. Otherwise the officer sees a "Pending approval" message.

**The HEAD's view of the new registration**:
- Dashboard bell shows a "Pending Approvals" section with the registration.
- HEAD navigates to `/dashboard/admin`, finds the user, clicks Approve.
- `PATCH /api/users/[userId]/approve` with `{ action: "approve" }`.
- The new officer can now log in.

---

## 2. Officer opens a new case

```
/dashboard  →  + New Case (top-right CTA) → /dashboard/cases  →  modal → /dashboard/cases/[id]
```

The dashboard welcome banner has a `+ NEW CASE` button → navigates to `/dashboard/cases`. On the case list page, a "New Case" modal collects:

- Title.
- Category (one of the cybercrime taxonomy values).
- Description (optional).

Submission calls `POST /api/cases`. The handler generates the `caseNumber` (`LELU-2026-NNN`) in a transaction, creates the row, and writes a `CaseActivity` ("Case opened"). The client routes the user to `/dashboard/cases/[newCaseId]`.

---

## 3. Officer documents an investigation

```
/dashboard/cases/[id]
  ├── Add Entry → /api/cases/[id]/entries (POST)
  ├── Log CDR Request → /api/cdr (POST)
  ├── Invite Officer → /api/cases/[id]/assignments (POST)
  └── Close / Decline → /api/cases/[id] (PATCH)
```

The case detail page is the main workhorse view. When an officer clicks **Add Entry**:

1. Textareas appear inline (content + actions).
2. As they type/blur, the page calls `GET /api/search?q=<extracted_tokens>` for any phone numbers / emails it can extract. If hits are found, a yellow "duplicate identifier" warning surfaces. The officer can still save.
3. Submit → `POST /api/cases/[id]/entries`.
4. Server creates the entry with `dayNumber` derived from existing count, writes a `CaseActivity`, returns the new entry.
5. The page refetches the case.

**Logging a CDR** from within the case:

1. "Log CDR Request" opens a modal with identifier type, telco (only if Phone Number), period dates, justification.
2. On blur of the identifier field, the page calls `GET /api/search?q=<value>` and shows a duplicate warning if the identifier has been seen before — the officer can choose "Log Anyway" or cancel.
3. Submit → `POST /api/cdr` with `caseId` pre-filled.
4. The CDR appears in the case's CDR Requests section.

**Inviting another officer**:

1. "Invite" opens a modal listing all eligible officers (excludes owner, accepted, pending).
2. Click an officer → `POST /api/cases/[id]/assignments` with `{ userId }`.
3. A `Notification` is created for the invitee; a `CaseActivity` row is logged.
4. The invitee's bell badge updates within ~30 s.

**Closing or declining**:

1. "Close Case" / "Decline" buttons (visible to owner, HEAD, ADMIN).
2. Modal collects closure / decline reason.
3. `PATCH /api/cases/[id]` with `{ status, closedAt?, closureReason }`.
4. The case is now read-only in the UI. HEAD/ADMIN can reopen.

---

## 4. Invited officer accepts / declines a case

```
Bell badge increments → click bell → CASE_INVITATION panel
  ├── Accept → PATCH /api/cases/[id]/assignments → redirect to /dashboard/cases/[id]
  └── Decline → PATCH /api/cases/[id]/assignments
```

The dashboard layout polls `/api/notifications` every 30 s. `CASE_INVITATION` rows surface in the bell with Accept / Decline buttons inline (no need to navigate first).

- **Accept**: `PATCH /api/cases/[id]/assignments` with `{ assignmentId, action: "accept" }`. The notification is marked read; the assignment status flips to `Accepted`. The user is redirected to the case page. They now appear on the Case Team and can write entries, log CDRs, and PATCH the case.
- **Decline**: same PATCH with `action: "decline"`. Assignment moves to `Declined`. The invitation disappears from the bell.

---

## 5. CDR processing workflow

```
Officer A logs CDR → CDR appears Pending
  → HEAD assigns it to Officer B (cdrAccess: true)
  → B sees it in "CDRs Assigned to Me" on dashboard
  → B uploads telco response → CDR flips to Received
```

CDR list page (`/dashboard/cdr`):

1. Lists CDRs visible to the current user (own + ADMIN_ROLES can see all).
2. Filter / sort by status, telco, requester.
3. **Assignment** (HEAD/ADMIN): pick an officer with `cdrAccess: true` via `PATCH /api/cdr/[cdrId]` `{ assignedTo }`.
4. **Receive a response** (assignee or owner): upload PDF via `POST /api/upload` → `PATCH /api/cdr/[cdrId]` `{ status: "Received", receivedAt, attachmentPath, attachmentName }`.

The dashboard's "CDRs Assigned to Me" widget polls `GET /api/cdr?assigned=true` and highlights what the current user needs to action.

---

## 6. International (24/7 Network) flow

```
/dashboard/international
  → New request modal
  → /api/international (POST) → refNumber LELU-INTL-YYYY-NNN
  → status Pending → upload response → Received
```

Direction is either Outgoing (we're sending) or Incoming (we received). Otherwise identical in shape to CDR: pending → received with an attachment.

---

## 7. Intel DB search

```
/dashboard/fraud
  → search box (min 3 chars)
  → GET /api/search?q=...
  → four result columns: CDRs, Cases, Entries, Network requests
  → click any → drill to its detail page
```

The Intel DB is the read-only unified search — no mutation, just navigation. Officers use it before opening a new case to see if the suspect identifier is already known.

---

## 8. HEAD's stale-case rounds

```
Bell → "Stale Cases" section
  → click a case → /dashboard/cases/[id]
  → reach out to owner / reassign / close
```

Stale = Active + open ≥ 30 days + no entry in last 7 days. Computed by the dashboard layout's `useEffect` from `GET /api/cases` and surfaced both in the bell and on the dashboard's "Cases Needing Attention" panel (HEAD/ADMIN only).

Similarly, the bell exposes overdue CDR (Pending ≥ 14 days) and overdue international (Pending ≥ 14 days) buckets.

---

## 9. Weekly activity report

```
/dashboard/reports
  → "Submit Activity Report" form
  → POST /api/reports/activity
  → submitted reports listed below
```

Officers fill in week range, summary, cases worked, challenges, next steps. HEAD/ADMIN/SUPERVISOR can read all submissions and build a team report via `GET /api/reports/data?team=true&from=...&to=...`.

---

## 10. User management (HEAD only)

```
/dashboard/admin
  ├── Pending Approvals → approve / reject (PATCH /api/users/[userId]/approve)
  ├── Active Users → toggle cdrAccess, reset password, deactivate
  └── Deactivated Users → reactivate
```

Hard deletion is exposed only on the HEAD's profile of a deactivated user (a destructive action behind one extra click) and calls `DELETE /api/users/[userId]`.

---

## 11. Profile

```
/dashboard/profile
  ├── Update name → PATCH /api/users/me (no action)
  └── Change password → PATCH /api/users/me (action: "change_password")
```

Self-service. Available to every authenticated user regardless of role.

---

## 12. Logout

Sidebar avatar → `/dashboard/profile` has the sign-out CTA, which calls NextAuth's `signOut()` and redirects to `/login`. (Some pages also expose a quick sign-out in the topbar.)

---

## Common cross-cutting touchpoints

- **Co-viewing**. On `/dashboard/cases/[id]`, a yellow banner appears if any other user is viewing the same case (HEAD / ADMIN visibility only — the data is fetched for all users but the banner gates on role).
- **Audit timeline**. The bottom of every case detail page shows `caseActivities` newest-first. No interactivity.
- **Theme toggle**. The layout reads `localStorage["lelu-theme"]` and listens for a `lelu-theme-change` window event. Currently a stub — there's no UI to flip it.
