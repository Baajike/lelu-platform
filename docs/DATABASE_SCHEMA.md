# Database Schema

All Prisma models, field-by-field. Authoritative source is `prisma/schema.prisma` — this doc is the prose explanation. Provider is PostgreSQL; all IDs are CUIDs unless noted.

## Diagram

```
            ┌────────┐
            │  User  │
            └───┬────┘
                │ 1
       ┌────────┼────────┬────────────┬─────────────────────┐
       │N       │N       │N           │N                    │N
   ┌───▼──┐ ┌───▼──────┐ ┌───▼──────┐ ┌─────▼──────────┐ ┌──▼──────────────────┐
   │ Case │ │JournalEnt│ │CdrRequest│ │ActivityReport  │ │InternationalRequest │
   └──┬───┘ └─────┬────┘ └─────┬────┘ └────────────────┘ └─────────────────────┘
      │1         │             │
      │          │             │ (also: Case 1—N CdrRequest, optional)
      │N─────────┘             │
      │                        │
   ┌──▼──────────────┐         │
   │ CaseAssignment  │         │
   │ (Case N–N User) │         │
   └─────────────────┘         │
      │                        │
      │N                       │N
   ┌──▼──────────────┐         │
   │  CaseActivity   │         │
   └─────────────────┘         │
                               │
              ┌────────────────┴───────┐
              │ Notification (User 1–N)│
              └────────────────────────┘
```

`InternationalRequest` and `CdrRequest` both have optional `caseId` — they can exist standalone.

---

## `User`

```
id           String   PK  cuid
name         String
email        String   unique
password     String   (bcrypt hash)
role         String   "OFFICER" default
                       — HEAD_OF_UNIT | SUPERVISOR | OFFICE_ADMINISTRATOR | OFFICER | ADMIN
approved     Boolean  false default
deactivated  Boolean  false default
cdrAccess    Boolean  false default
lastActive   DateTime?
createdAt    DateTime now()
updatedAt    DateTime @updatedAt
```

Relations: `cases[]`, `entries[]`, `cdrRequests[]`, `internationalRequests[]`, `activityReports[]`, `caseAssignments[]`, `notifications[]`, `cdrAssignments[]` (named relation `CdrAssignee` — CDR requests assigned to this user, distinct from `cdrRequests` which are CDR requests this user created).

**Lifecycle.** Created via `POST /api/auth/register` with `approved: false`. Only `HEAD_OF_UNIT`, `OFFICE_ADMINISTRATOR`, `ADMIN` can approve them. Deactivation is soft — `deactivated: true` + `approved: false`, all FK references preserved. Hard deletion (only HEAD_OF_UNIT) nullifies FK references to keep case history intact, then deletes the User row.

**Notes.**
- The first HEAD_OF_UNIT registered auto-approves (no admin exists yet to grant approval).
- `cdrAccess` is a separate per-user flag; CDR assignment UI filters by this.
- `lastActive` is set in the `jwt` callback on every login.

---

## `Case`

```
id            String    PK  cuid
caseNumber    String    unique  format LELU-YYYY-NNN
title         String
category      String    — Electronic Fraud | Cyberstalking | Computer Access
                          Offences | Child Exploitation | Identity Related Crimes |
                          Data Interference | System Interference |
                          Critical Infrastructure Attacks | Other
status        String    "Active" default
                       — Active | Closed | Declined
description   String?
createdAt     DateTime  now()
updatedAt     DateTime  @updatedAt
closedAt      DateTime?
closureReason String?
officerId     String?   FK → User.id  ON DELETE SET NULL
```

Relations: `officer` (1), `entries[]`, `cdrRequests[]`, `internationalRequests[]`, `caseActivities[]`, `caseAssignments[]`.

**caseNumber generation.** `LELU-${currentYear}-${(caseCount + 1).padStart(3,'0')}`. Computed in a transaction in `POST /api/cases`. Not strictly collision-safe under high concurrent insert load — acceptable for current usage.

**`status` semantics.** "Closed" and "Declined" both freeze further actions in the UI (the Add Entry, Log CDR, etc. buttons gate on status === "Active"). HEAD_OF_UNIT can reopen either via PATCH. Closed cases hold a `closedAt` + `closureReason`; declined cases hold only `closureReason`.

**`closureReason`** is used both for closure ("Case Resolved", "Suspect Arrested", etc.) and for decline reasons (free text). That dual purpose is intentional — they share a column.

---

## `CaseAssignment`

```
id          String    PK  cuid
caseId      String    FK → Case.id  ON DELETE CASCADE
userId      String    FK → User.id  ON DELETE CASCADE
assignedBy  String    (not a FK — just an audit field)
assignedAt  DateTime  now()
status      String    "Pending" default
                       — Pending | Accepted | Declined

UNIQUE (caseId, userId)
```

The N–N table between Case and User. Cascades on either parent deletion.

**Invitation lifecycle.** Created with `Pending`. The invited user accepts or declines via `PATCH /api/cases/[id]/assignments`. A new invitation to a previously-declined user reuses the same row by flipping back to `Pending` (the `UNIQUE` constraint forbids two rows for the same pair).

---

## `JournalEntry`

```
id        String    PK  cuid
dayNumber Int       (sequence within a case, 1-based)
content   String    (free text)
actions   String?   (optional next-steps section)
createdAt DateTime  now()
caseId    String    FK → Case.id  (no cascade — entries are manually deleted)
authorId  String?   FK → User.id  ON DELETE SET NULL
```

Relations: `case`, `author`.

**`dayNumber`** is computed as `existingCount + 1` at insert time. Subject to a TOCTOU race under concurrent inserts — acceptable for current single-officer-per-case workflow. Don't use it as a stable primary key.

When a case is deleted, the DELETE handler manually `deleteMany`s entries first (no cascade on the FK).

---

## `CaseActivity`

```
id        String    PK  cuid
caseId    String    FK → Case.id  (RESTRICT)
userId    String?
userName  String    (denormalised — survives user deletion)
action    String    (e.g., "Case opened", "Journal entry added")
detail    String?
createdAt DateTime  now()
```

Audit trail. Append-only — no UI to edit or delete. `userName` is denormalised so the timeline still reads sensibly even if the user is later deleted.

Written automatically by case-mutating routes (`/api/cases`, `/api/cases/[id]`, `/api/cases/[id]/entries`, `/api/cases/[id]/assignments`). All writes are wrapped in `.catch(() => {})` so a logging failure doesn't break the parent operation.

---

## `CdrRequest`

```
id              String    PK  cuid
phoneNumber     String    (identifier — name is historic, holds any identifier type now)
identifierType  String    "Phone Number" default
                          — Phone Number | IMEI | ID Document | Email Address |
                            Physical Address | Bank Account | Device Serial Number | Other
telco           String?   — MTN | Vodafone | AirtelTigo | Other  (nullable when not a phone)
periodStart     DateTime
periodEnd       DateTime
reason          String    (justification)
status          String    "Pending" default — Pending | Received | Rejected
requestedAt     DateTime  now()
receivedAt      DateTime?
caseId          String?   FK → Case.id     (optional, see migration 20260414165805)
officerId       String?   FK → User.id     ON DELETE SET NULL
attachmentPath  String?
attachmentName  String?
assignedTo      String?   FK → User.id     ON DELETE SET NULL
                           (named relation CdrAssignee)
assignedAt      DateTime?
```

Relations: `case`, `officer` (requester), `assignedUser` (handler).

**Two officers in play.** `officerId` is who created the request; `assignedTo` is who's currently processing it (used by the "CDRs Assigned to Me" dashboard widget). `cdrAccess` flag on User controls who's a valid assignee in the UI.

**Attachments.** When a telco returns data, the handler uploads the file via `/api/upload`, then PATCHes the CDR with `attachmentPath` + `attachmentName` and flips `status` to `Received`.

---

## `InternationalRequest`

```
id              String    PK  cuid
refNumber       String    unique  format LELU-INTL-YYYY-NNN
direction       String    — Outgoing | Incoming
country         String
agency          String
subject         String
details         String?
status          String    "Pending" default
priority        String    "Medium" default
caseId          String?   FK → Case.id (optional)
officerId       String?   FK → User.id  ON DELETE SET NULL
createdAt       DateTime  now()
respondedAt     DateTime?
attachmentPath  String?
attachmentName  String?
```

24/7 network requests — the Interpol-style cross-jurisdictional info exchange. Independent records: can be linked to a case or standalone. `refNumber` follows the same generation pattern as `caseNumber`.

When a case is deleted, the DELETE handler nulls `caseId` on linked `InternationalRequest`s rather than deleting them (they have their own audit value).

---

## `Notification`

```
id        String    PK  cuid
userId    String    FK → User.id  ON DELETE CASCADE
type      String    e.g., "CASE_INVITATION"
title     String
message   String
link      String?   — URL the bell click should navigate to
meta      String?   — stringified JSON, holds assignmentId / caseId for invitations
read      Boolean   false default
createdAt DateTime  now()
```

In-app notifications. Polled by the layout every 30 s. The `meta` JSON is used to enrich `CASE_INVITATION` rows server-side with the current `assignmentStatus` (so the bell shows "Accepted" / "Declined" state in real time).

`meta` is stored as a string (Prisma `String?`) — Postgres doesn't get a proper JSONB type here. That was the simplest choice; revisit if you start querying on meta fields.

---

## `ActivityReport`

```
id          String    PK  cuid
weekStart   DateTime
weekEnd     DateTime
summary     String
casesWorked String?
challenges  String?
nextSteps   String?
status      String    "Submitted" default
officerId   String?   FK → User.id  ON DELETE SET NULL
createdAt   DateTime  now()
```

Weekly self-report submitted by officers via `/dashboard/reports`. No mutation after submission (status is informational only).

---

## Cascade & nullification summary

| Parent delete | Child behavior |
|---|---|
| `User` deleted (hard, HEAD_OF_UNIT only) | Manual nullification in handler before delete: `Case.officerId`, `JournalEntry.authorId`, `CdrRequest.officerId`, `InternationalRequest.officerId`, `ActivityReport.officerId` → `null`. Then `User.delete`. |
| `User` deleted via cascade | `CaseAssignment` rows cascade, `Notification` rows cascade. |
| `Case` deleted (HEAD_OF_UNIT / ADMIN) | Manual deleteMany in transaction: `JournalEntry`, `CdrRequest`, `CaseActivity`. `InternationalRequest.caseId` nulled (preserve refNumber). `CaseAssignment` cascades. |

---

## Migration history at a glance

Migrations are PostgreSQL-flavored SQL in `prisma/migrations/`. Newest at bottom (chronological order matches the timestamp prefix):

| Migration | Effect |
|---|---|
| `20260307232246_init` | Initial schema: User, Case, JournalEntry, CdrRequest |
| `20260311131019_add_international` | InternationalRequest table |
| `20260311212034_add_activity_reports` | ActivityReport table |
| `20260311221830_add_user_approval` | `User.approved` flag |
| `20260327141339_add_fraud_case_link_and_attachments` | Attachment columns on CDR + International |
| `20260414163421_remove_priority` | Drop Case.priority column |
| `20260414165805_optional_cdr_caseid` | Make CdrRequest.caseId nullable |
| `20260415092930_add_cdr_access` | `User.cdrAccess` flag |
| `20260415142647_add_last_active` | `User.lastActive` |
| `20260415224046_add_deactivated_field` | `User.deactivated` flag |
| `20260415231405_add_case_activity` | CaseActivity table + soften several FK constraints to SET NULL |
| `20260525000000_add_cdr_assignment` | CdrRequest.assignedTo, assignedAt + FK |
| `20260529000000_add_case_assignment_and_notification` | CaseAssignment + Notification tables (idempotent — fixes prod drift) |
