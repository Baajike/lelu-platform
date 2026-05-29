# API Reference

Concrete request/response examples for every endpoint. Pair with `BACKEND.md` (which has the prose) and `DATABASE_SCHEMA.md` (which has the field types).

All requests except `POST /api/auth/register` and `GET /api/users/check-head` require a NextAuth session cookie (`__Secure-next-auth.session-token` in production, `next-auth.session-token` in dev). The browser handles this transparently; for API testing you'd need to log in first and forward the cookie.

Bodies are JSON unless noted. Errors return `{ "error": "<message>" }` with an appropriate status.

---

## Authentication

### `POST /api/auth/register`

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Officer Asante",
  "email": "asante@lelu.gov.gh",
  "password": "examplePassword12",
  "role": "OFFICER"
}
```

**201 Created**
```json
{ "success": true, "id": "ckxx...", "autoApproved": false }
```

**400** if email exists, HEAD_OF_UNIT already registered, or fields missing.
**403** if `role === "ADMIN"`.

`autoApproved` is `true` only for the first HEAD_OF_UNIT registration.

### `POST /api/auth/[...nextauth]/callback/credentials`

Handled by NextAuth; you don't call it directly. Form submission from `/login` posts here.

On failure, NextAuth surfaces one of these error strings via the `?error=` query param on the login page: `CredentialsSignin` (generic), `PENDING_APPROVAL`, `DEACTIVATED`.

---

## Cases

### `GET /api/cases`

```http
GET /api/cases
GET /api/cases?officerId=ckxx...
```

**200**
```json
[
  {
    "id": "ckxx...",
    "caseNumber": "LELU-2026-001",
    "title": "Mobile money fraud — Accra Mall",
    "category": "Electronic Fraud",
    "status": "Active",
    "description": "...",
    "createdAt": "2026-05-12T09:00:00.000Z",
    "officerId": "ckyy...",
    "officer": { "id": "ckyy...", "name": "Officer Asante" },
    "entries": [{ "id": "...", "createdAt": "2026-05-15T14:00:00.000Z" }],
    "caseAssignments": [
      {
        "id": "...",
        "userId": "...",
        "status": "Accepted",
        "user": { "id": "...", "name": "Officer Darko" }
      }
    ],
    "_count": { "entries": 4 }
  }
]
```

### `POST /api/cases`

```json
{
  "title": "Phishing scheme targeting bank customers",
  "category": "Electronic Fraud",
  "description": "Free-text background"
}
```

**201**
```json
{
  "id": "...",
  "caseNumber": "LELU-2026-014",
  "title": "Phishing scheme targeting bank customers",
  "category": "Electronic Fraud",
  "status": "Active",
  "officerId": "<callerId>",
  "officer": { "id": "<callerId>", "name": "..." }
}
```

### `GET /api/cases/[id]`

**200** — same as the row in the list, plus `entries[]` (full), `cdrRequests[]`, `caseActivities[]`, `caseAssignments[]` (full), and `relatedCases[]`:

```json
{
  "id": "...",
  "caseNumber": "LELU-2026-014",
  ...
  "relatedCases": [
    {
      "caseId": "ckaa...",
      "caseNumber": "LELU-2026-009",
      "title": "Sister case",
      "status": "Active",
      "officerName": "Officer Darko",
      "matchReason": "Identifier 0244000000 also mentioned in journal entries",
      "matchCount": 2
    }
  ]
}
```

### `PATCH /api/cases/[id]`

```json
{ "status": "Closed", "closedAt": "2026-05-29T12:00:00.000Z", "closureReason": "Case Resolved" }
```

Decline:
```json
{ "status": "Declined", "closureReason": "Insufficient evidence; complainant withdrew" }
```

Reopen:
```json
{ "status": "Active", "closedAt": null, "closureReason": null }
```

**200** returns the updated row.

### `DELETE /api/cases/[id]`

No body. **200**: `{ "success": true }`.

### `POST /api/cases/[id]/entries`

```json
{ "content": "Interviewed complainant. Identified Tigo number 0271234567.", "actions": "Submit CDR for 0271234567" }
```

**201**
```json
{
  "id": "...",
  "dayNumber": 3,
  "content": "...",
  "actions": "...",
  "createdAt": "...",
  "caseId": "...",
  "authorId": "...",
  "author": { "name": "Officer Asante" }
}
```

### `GET /api/cases/[id]/assignments`

**200**
```json
[
  {
    "id": "...",
    "caseId": "...",
    "userId": "...",
    "assignedBy": "...",
    "assignedAt": "2026-05-29T08:00:00.000Z",
    "status": "Pending",
    "user": { "id": "...", "name": "Officer Boateng", "role": "OFFICER", "email": "..." }
  }
]
```

### `POST /api/cases/[id]/assignments`

```json
{ "userId": "ckbb..." }
```

**201**: the new (or revived) assignment row, with the user included.
**409**: officer already has a pending or accepted invitation.

### `PATCH /api/cases/[id]/assignments`

Invited user responds:
```json
{ "assignmentId": "ckxx...", "action": "accept" }
```

**200**: the updated assignment.
**403**: caller is not the assignee.
**409**: already responded.

### `DELETE /api/cases/[id]/assignments`

```json
{ "userId": "ckxx..." }
```

**200**: `{ "success": true }`.

### `GET /api/cases/[id]/viewers`

**200**
```json
[ { "userId": "...", "userName": "Officer Boateng", "timestamp": 1735478400000 } ]
```

Excludes the caller.

### `DELETE /api/cases/[id]/viewers`

**200**: `{ "success": true }`.

### `GET /api/cases/activity`

```http
GET /api/cases/activity
GET /api/cases/activity?me=true
```

**200**
```json
[
  {
    "id": "...",
    "caseId": "...",
    "userName": "Officer Asante",
    "action": "Journal entry added",
    "detail": "Input 3",
    "createdAt": "...",
    "case": { "id": "...", "caseNumber": "LELU-2026-014", "title": "..." }
  }
]
```

---

## CDR

### `GET /api/cdr`

```http
GET /api/cdr
GET /api/cdr?assigned=true
GET /api/cdr?officerId=ckxx...
```

**200**
```json
[
  {
    "id": "...",
    "phoneNumber": "0271234567",
    "identifierType": "Phone Number",
    "telco": "AirtelTigo",
    "periodStart": "2026-04-01T00:00:00.000Z",
    "periodEnd": "2026-05-01T00:00:00.000Z",
    "reason": "Suspect contact in fraud case",
    "status": "Pending",
    "requestedAt": "...",
    "caseId": "...",
    "case": { "id": "...", "caseNumber": "LELU-2026-014", "title": "..." },
    "officerId": "...",
    "officer": { "id": "...", "name": "Officer Asante" },
    "assignedTo": "ckcc...",
    "assignedUser": { "id": "ckcc...", "name": "Officer Darko" }
  }
]
```

### `POST /api/cdr`

```json
{
  "phoneNumber": "0271234567",
  "identifierType": "Phone Number",
  "telco": "AirtelTigo",
  "periodStart": "2026-04-01",
  "periodEnd": "2026-05-01",
  "reason": "Suspect contact",
  "caseId": "ckxx..."
}
```

`caseId` is optional. For non-phone identifiers, set `identifierType` accordingly and pass `null` (or omit) `telco`.

### `PATCH /api/cdr/[cdrId]`

Receive a response:
```json
{ "status": "Received", "receivedAt": "2026-05-20T10:00:00.000Z",
  "attachmentPath": "/uploads/1735478400000_cdr.pdf",
  "attachmentName": "cdr.pdf" }
```

Assign to an officer:
```json
{ "assignedTo": "ckcc...", "assignedAt": "2026-05-29T09:00:00.000Z" }
```

Unassign:
```json
{ "assignedTo": null }
```

### `DELETE /api/cdr/[cdrId]`

**200**: `{ "success": true }`.

---

## Journal entries (top-level)

### `GET /api/entries`

**200**: array of entries (with case + author). Scope determined by caller's role.

### `PATCH /api/entries/[entryId]`

```json
{ "content": "Updated text" }
```

**200**: the updated entry.

### `DELETE /api/entries/[entryId]`

**200**: `{ "success": true }`.

---

## International requests

### `GET /api/international`

Filters analogous to `/api/cdr`.

### `POST /api/international`

```json
{
  "direction": "Outgoing",
  "country": "United Kingdom",
  "agency": "NCA",
  "subject": "Subscriber lookup",
  "details": "Cross-border fraud investigation",
  "priority": "High",
  "caseId": "ckxx..."
}
```

**201**: the created row with auto-generated `refNumber` (`LELU-INTL-YYYY-NNN`).

### `PATCH /api/international/[reqId]`

```json
{ "status": "Received", "respondedAt": "2026-05-25T12:00:00.000Z",
  "attachmentPath": "/uploads/...", "attachmentName": "response.pdf" }
```

### `DELETE /api/international/[reqId]`

**200**: `{ "success": true }`.

---

## Notifications

### `GET /api/notifications`

**200**: caller's unread notifications. `CASE_INVITATION` entries include the live `assignmentStatus` and `assignmentId`:

```json
[
  {
    "id": "...",
    "type": "CASE_INVITATION",
    "title": "Case Invitation",
    "message": "Officer Asante has invited you to work on LELU-2026-014 — Phishing scheme...",
    "link": "/dashboard/cases/ckxx...",
    "meta": "{\"assignmentId\":\"...\",\"caseId\":\"...\"}",
    "read": false,
    "createdAt": "...",
    "assignmentId": "...",
    "assignmentStatus": "Pending"
  }
]
```

### `POST /api/notifications`

```json
{ "userId": "...", "type": "INFO", "title": "...", "message": "...", "link": null, "meta": null }
```

### `PATCH /api/notifications`

Single:
```json
{ "id": "ckxx..." }
```

All:
```json
{ "all": true }
```

**200**: `{ "success": true }`.

---

## Search

### `GET /api/search?q=<term>`

`q` minimum 3 chars; shorter returns empty arrays.

**200**
```json
{
  "cdrs":    [ { ...CdrRequest, "case": {...}, "officer": {...} } ],
  "cases":   [ { ...Case, "officer": {...} } ],
  "entries": [ { ...JournalEntry, "case": {...}, "author": {...} } ],
  "intel":   [ { ...InternationalRequest, "case": {...} } ]
}
```

Each array capped at 10.

---

## Upload

### `POST /api/upload`

`multipart/form-data` with field `file`.

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Cookie: next-auth.session-token=..." \
  -F "file=@cdr_response.pdf"
```

**200**
```json
{ "path": "/uploads/1735478400000_cdr_response.pdf", "name": "cdr_response.pdf" }
```

The returned `path` is what you store in `CdrRequest.attachmentPath` / `InternationalRequest.attachmentPath`. The original `name` goes into `attachmentName` for display.

---

## Reports

### `GET /api/reports/data`

```http
GET /api/reports/data?team=true&from=2026-01-01&to=2026-05-29
GET /api/reports/data?type=case&caseId=ckxx...
GET /api/reports/data?from=2026-05-01&to=2026-05-29&officerId=ckyy...
```

**Team mode (`team=true`, SUPERVISOR/HEAD_OF_UNIT/ADMIN)**:
```json
{
  "cases": [ ... ],
  "cdrs": [ ... ],
  "internationalRequests": [ ... ],
  "entries": [ ... ],
  "users": [ ... ]
}
```

**Case mode (`type=case`)**:
```json
{
  "caseData": {
    "id": "...",
    "caseNumber": "LELU-2026-014",
    "officer": { "name": "..." },
    "entries": [ ... ordered by dayNumber asc ... ],
    "cdrRequests": [ ... ],
    "internationalRequests": [ ... ]
  }
}
```

**Default**:
```json
{ "cases": [ ... ], "cdrs": [ ... ], "activityReports": [ ... ], "internationalRequests": [ ... ] }
```

### `GET /api/reports/activity`

**200**: array of `ActivityReport` rows with officer name + role.

### `POST /api/reports/activity`

```json
{
  "weekStart": "2026-05-25",
  "weekEnd":   "2026-05-31",
  "summary":   "Worked on LELU-2026-014, opened LELU-2026-015.",
  "casesWorked": "LELU-2026-014, LELU-2026-015",
  "challenges":  "Awaiting MTN response on three CDRs",
  "nextSteps":   "Follow up with MTN liaison Monday"
}
```

**201**: the created report.

---

## Users

### `GET /api/users`

```http
GET /api/users
GET /api/users?pending=true
GET /api/users?deactivated=true
GET /api/users?withStats=true
```

**Default response (200)**:
```json
[
  {
    "id": "...",
    "name": "Officer Asante",
    "email": "asante@lelu.gov.gh",
    "role": "OFFICER",
    "cdrAccess": false,
    "lastActive": "2026-05-29T08:30:00.000Z"
  }
]
```

**`withStats=true`** adds `_count.cases`, `_count.cdrRequests`, `cases` (active only, IDs), `entries` (this week, IDs).

### `GET /api/users/me`

**200**
```json
{
  "id": "...",
  "name": "Officer Asante",
  "email": "asante@lelu.gov.gh",
  "role": "OFFICER",
  "approved": true,
  "cdrAccess": false,
  "createdAt": "..."
}
```

### `PATCH /api/users/me`

Rename:
```json
{ "name": "Officer Asante Boateng" }
```

Change password:
```json
{ "action": "change_password", "currentPassword": "...", "newPassword": "newOne123" }
```

**400** if `newPassword.length < 8` or `currentPassword` doesn't match.

### `DELETE /api/users/[userId]` (HEAD_OF_UNIT only)

**200**: `{ "success": true }`.
**400** if `userId === session.user.id` (can't delete self).
**403** if caller isn't HEAD_OF_UNIT.

### `PATCH /api/users/[userId]/approve`

CDR access toggle (HEAD_OF_UNIT / ADMIN):
```json
{ "cdrAccess": true }
```

Approve registration (APPROVAL_ROLES):
```json
{ "action": "approve" }
```

Reject registration (APPROVAL_ROLES — hard deletes the User row):
```json
{ "action": "reject" }
```

Deactivate (HEAD_OF_UNIT / ADMIN):
```json
{ "action": "deactivate" }
```

Reactivate (HEAD_OF_UNIT / ADMIN):
```json
{ "action": "reactivate" }
```

Reset password (HEAD_OF_UNIT / ADMIN):
```json
{ "action": "reset_password", "newPassword": "tempPass1234" }
```

### `GET /api/users/check-head` (public)

**200**
```json
{ "headExists": true }
```

Used during registration to decide whether to expose the HEAD_OF_UNIT role option.
