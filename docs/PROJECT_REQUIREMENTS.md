# Project Requirements

What LELU exists to do, who uses it, and the features it must support.

## Mission

The Law Enforcement Liaison Unit needs a single, controlled system to:

1. Document active investigations (case files with chronological journal entries).
2. Submit and track Call Data Record requests to Ghanaian telcos (MTN, Vodafone, AirtelTigo).
3. Submit and track international cooperation requests via the 24/7 Network / Interpol channel.
4. Detect connections between investigations (same suspect identifier across cases).
5. Provide a unit-wide intelligence search across all stored case material.
6. Hold individual officers accountable via journal entries, weekly activity reports, and audit logs.
7. Manage the unit's user accounts under role-based controls.

Everything else — UI polish, dashboards, notifications — supports these seven jobs.

## User roles

Roles are a single string field on the `User` model. There is no group membership, no permission table — every authorization decision is `if (session.user.role === ...)` or `["X", "Y"].includes(session.user.role)`.

| Role | Who they are | What they can do |
|---|---|---|
| **HEAD_OF_UNIT** | The unit commander | Everything. Sees all cases. Manages users (approve, deactivate, reset password, delete). Can close, decline, delete any case. Can override assignments. Receives stale-case and overdue-request alerts. |
| **ADMIN** | A technical superuser | Functional equivalent of HEAD_OF_UNIT. Created out-of-band; not registrable through the UI. |
| **SUPERVISOR** | Mid-tier leadership | Sees all cases (read mostly). Reviews team reports. Can act on cases like an officer but doesn't manage users. |
| **OFFICE_ADMINISTRATOR** | Admin staff | Approves new registrations. Does *not* see operational case data unless made an explicit assignee. Used to take user-management burden off the HEAD. |
| **OFFICER** | The default field investigator | Opens their own cases, adds entries, requests CDRs, sees only what they own or have been assigned to. |

Exactly one HEAD_OF_UNIT may exist at a time. Subsequent attempts to register that role are rejected.

## Core features

### 1. Account lifecycle
- **Registration**: anyone with the platform URL can register. Default role is OFFICER; HEAD_OF_UNIT can be selected only if none exists.
- **Approval gate**: registrations sit at `approved: false` until an authorised user (HEAD/OFFICE_ADMIN/ADMIN) approves them. Unapproved users get `PENDING_APPROVAL` on login attempt.
- **First-HEAD auto-approval**: the very first HEAD_OF_UNIT account is auto-approved so the unit can bootstrap itself without manual DB intervention.
- **Deactivation**: HEAD/ADMIN can deactivate an account; the user receives `DEACTIVATED` on login. Reactivation is one click.
- **Password reset**: HEAD/ADMIN can set a temporary password for a user.
- **Hard delete**: HEAD_OF_UNIT only. Nullifies FK references first to keep historical case data intact.
- **CDR access flag**: a per-user boolean controlling whether an officer is a valid CDR-assignment target. Managed by HEAD/ADMIN.

### 2. Case management
- Officers open cases. Case number is auto-generated (`LELU-YYYY-NNN`).
- Cases have a category (cybercrime taxonomy: Electronic Fraud, Cyberstalking, etc.) and free-text title + description.
- Three statuses: **Active**, **Closed**, **Declined**. Closed/Declined cases are read-only (no new entries, no new CDRs); HEAD/ADMIN can reopen.
- Cases can be deleted by HEAD/ADMIN. Deletion cascades to entries, CDR requests, and activities; nulls the link on international requests.
- Case visibility:
  - HEAD_OF_UNIT / SUPERVISOR / ADMIN: all cases.
  - Officer: own + cases they've been invited to and accepted.

### 3. Case team / assignments
- A case owner (or HEAD/ADMIN) can invite other officers to a case.
- Invitations create a `Notification` for the invitee. They can accept or decline from the bell panel.
- Accepted assignees gain read + write access to the case (PATCH, add entries, log CDRs against it).
- Pending and declined invitations are visible to the case team.
- Removing an officer is one click for the owner / HEAD / ADMIN.

### 4. Investigation journal
- Per-case, append-only by default (delete is gated on author or HEAD/ADMIN; edit on author or HEAD/ADMIN).
- Each entry has `dayNumber` (1, 2, 3...), free-text content, and an optional "actions / next steps" section.
- Duplicate identifier detection: as the user types, the platform searches the global index for phone numbers / emails the entry mentions and surfaces a warning if they've appeared elsewhere.

### 5. CDR requests
- Officers log CDR requests with identifier (phone or other), telco, period start/end, justification, and optional case link.
- Status: `Pending` → `Received` (with attachment + receivedAt) → optionally `Rejected`.
- CDRs can be assigned to a specific officer for processing (`assignedTo`), filtered by `cdrAccess`.
- Duplicate-check at submission: warns the requester if the identifier has been requested or mentioned elsewhere; allows "Log Anyway".

### 6. International / 24/7 Network requests
- Direction is Outgoing or Incoming. Country and agency are free text. Subject + details narrative. Priority.
- Auto-generated `refNumber` (`LELU-INTL-YYYY-NNN`).
- Optional case link.
- Status: `Pending` → `Received` (with attachment + respondedAt).

### 7. Cross-system search (Intel DB)
- `/dashboard/fraud` is a unified search across CDR requests, cases, journal entries, and international requests.
- Min 3 characters. Substring match. Top 10 results per category.

### 8. Case correlation
- On every case detail page load, the server scans every other case's journal text and CDR phone numbers for shared identifiers (phones via regex; emails via regex).
- Matched cases appear as a "Related Cases" panel with the match reason.

### 9. Co-viewing
- When two officers view the same case at the same time, both see a yellow banner naming the other. Refreshes every 30 s. 5-minute TTL.
- Implementation is in-memory; resets on server restart.

### 10. Notifications
- Personal: persisted `Notification` rows. Currently only `CASE_INVITATION` is in use.
- Computed alerts (re-derived on every dashboard mount):
  - Pending account approvals (HEAD/OFFICE_ADMIN/ADMIN).
  - Stale cases — Active + open ≥ 30 days + no entry in last 7 days (HEAD only).
  - Overdue CDR — Pending ≥ 14 days (HEAD only).
  - Overdue international — Pending ≥ 14 days (HEAD only).
- All surface through the top-bar bell with a single badge count.

### 11. Activity reports
- Weekly self-report submitted by officers via `/dashboard/reports`.
- Free-text summary, cases worked, challenges, next steps.

### 12. Audit log
- Every meaningful case action (open, close, decline, reopen, entry added, officer invited / removed / accepted / declined, CDR logged, case deleted) writes a `CaseActivity` row.
- Visible at the bottom of every case detail page.
- Append-only. No UI to edit or delete.

### 13. Dashboards (role-tailored)
- **HEAD / ADMIN** see: Team Overview (per-officer productivity score), Cases Needing Attention (stale cases), Crime Intelligence Overview heatmap, This Week's Activity digest.
- **Officers** see: motivational status banner, My Active Cases, My CDR Requests, Entries This Week, Quick Actions, Your Activity.
- Everyone sees: Recent Cases (last 6), CDRs Assigned To Me (if any).

### 14. File attachments
- CDR responses and international-request responses are uploaded via `/api/upload`.
- Stored in `public/uploads/<timestamp>_<sanitized_name>`.
- Linked from the request record via `attachmentPath` + `attachmentName`.

### 15. Profile management
- `/dashboard/profile` lets users edit their display name and change their password.
- Password change requires current password verification + ≥ 8 chars new.

## Non-functional requirements

- **On-premise deployment.** No cloud dependencies, no SaaS lock-in. Must run on a single Ubuntu server.
- **HTTPS in production** (via Let's Encrypt when a domain is configured).
- **Audit-friendly.** Every state change must be traceable to a user and timestamp. The append-only CaseActivity log is the primary mechanism.
- **Data sovereignty.** All data (including uploads) lives on the unit's own server.
- **Browser support.** Modern Chromium-based browsers. No IE / no progressive enhancement effort.
- **Single-user-per-account.** No SSO; no shared accounts.

## Out of scope (deliberately)

- Public-facing portal for complainants.
- Mobile applications (responsive web only).
- External integrations (telco APIs, Interpol systems, court systems).
- Multi-tenant deployment.
- Real-time collaboration on case editing.
- E2E encryption of case content at rest beyond filesystem permissions.
- Automated translation.
