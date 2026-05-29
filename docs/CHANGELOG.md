# CHANGELOG

Feature and infrastructure history for the LELU platform, reconstructed from git history. Newest first within each section.

Dates are derived from the migration filenames and commit ordering; exact commit timestamps live in `git log`.

---

## 2026-05 — CDR assignment, profile, delete case, schema repair

### `e0792cc` — Delete case feature
- Added `DELETE /api/cases/[id]` (HEAD_OF_UNIT / ADMIN only). Transactional cleanup: deletes journal entries, CDR requests, case activities; nulls `caseId` on linked international requests; deletes the case. `CaseAssignment` rows cascade automatically.
- Added "Delete Case" button on case detail page with confirmation modal.

### `53f6b6d` — Missing CaseAssignment + Notification migration
- Production was 500'ing on dashboard fetches because `CaseAssignment` and `Notification` tables were declared in `schema.prisma` but never migrated. Added `20260529000000_add_case_assignment_and_notification` with idempotent `IF NOT EXISTS` table creation and `DO $$ ... EXCEPTION WHEN duplicate_object` FK guards.

### `937180a` — CDR assignment migration (production)
- Migration `20260525000000_add_cdr_assignment` adds `assignedTo` and `assignedAt` columns to `CdrRequest` and a FK to `User`. Idempotent with `IF NOT EXISTS`.

### `ad6d2de` — CDR assignment, duplicate detection, profile, category update
- CDR requests can be assigned to a specific officer (`CdrRequest.assignedTo` + `assignedUser` relation, gated by `User.cdrAccess` flag).
- Duplicate detection at journal entry submission and CDR submission — `/api/search` is called as the user types to surface other cases/CDRs that already reference the same phone number or email.
- New `/dashboard/profile` page: edit display name, change password (requires current password, min 8 chars).
- Case categories revised to the cybercrime taxonomy used in the dashboard heatmap (Electronic Fraud, Cyberstalking, Computer Access Offences, Child Exploitation, Identity Related Crimes, Data Interference, System Interference, Critical Infrastructure Attacks, Other).
- Various bug fixes.

### `6c5bd07` — Schema provider revert
- Reverted an accidental SQLite provider switch back to `postgresql`. The schema datasource must stay PostgreSQL — guarded in `CLAUDE.md`.

---

## 2026-04 — Production readiness, PostgreSQL switch, docs

### `df438ea` — Login + admin permission fixes
- Login flow now blocks deactivated accounts with a distinct `DEACTIVATED` error (separate from `PENDING_APPROVAL`).
- ADMIN role granted parity with HEAD_OF_UNIT for user management operations.
- Cleaned the seed file to a no-op (`seed.js` no longer inserts default users — accounts are created via the registration flow).

### `93ba43b` + `f3fd7c1` — Full documentation set
- Authored `docs/USER_GUIDE.md`, `docs/ADMIN_GUIDE.md`, `docs/TECHNICAL.md`, `docs/SECURITY.md`, `docs/server docs.md`. These are the handover documents shipped with the deployment.

### `499c64e` — Auto-update script
- `update.sh` automates the production update flow: `git pull`, `npm install`, `prisma migrate deploy`, `prisma generate`, `npm run build`, `pm2 restart`.

### `99fbe7c` — PostgreSQL migration conversion
- All existing migrations rewritten from SQLite-flavored SQL to PostgreSQL-compatible syntax (`TIMESTAMP` over `DATETIME`, etc.). Required before the PostgreSQL switch could go live.

### `d5c9492` + `8f33c28` — Production-ready PostgreSQL setup
- `schema.prisma` switched to `provider = "postgresql"`.
- `.env.example` added with three required variables.
- Linux Prisma binary targets configured for the generated client.
- README rewritten as a step-by-step Ubuntu setup guide.
- `.gitignore` updated to exclude the SQLite dev DB.

### `4e1190a` — Remove dev database from repo
- The SQLite `dev.db` file was committed by mistake earlier; this removes it.

### `dd28d30` + `504e8c8` + `adf6671` + `9aad6c6` + `d3500fb` — Server / domain bootstrap
- `setup.sh` and `setup-domain.sh` install PostgreSQL, nginx, PM2 and validate that the dev has filled in `.env` correctly.
- `lelu-nginx.conf` reverse-proxies to `:3000` and pins the upstream so PM2 restarts don't drop the upstream.

---

## 2026-03 to 2026-04 — Feature build-out

### `2f59c42` + `c191ea4` — Final polish, security pass, handover prep
- UI consistency pass: button sizes, color usage, typography unified across dashboard.
- Console log cleanup.
- README rewritten for handover.

### `9f2e78f` — Critical security pass
- Auth checks added to every API route (previously some were missing).
- File upload route: sanitized filenames (alphanumeric + `._-`), timestamped names to prevent collisions.
- XSS fix on a case detail field.
- Race condition fix in entry creation (entry count → `dayNumber`).

### `5f053cb` — Intel DB, activity log, user management, days-open indicator
- `GET /api/search` cross-searches CDRs, cases, journal entries, and international requests by free-text query (min 3 chars).
- `CaseActivity` model + migration `20260415231405_add_case_activity` — every meaningful action on a case (open, close, decline, reopen, entry add, officer invited/removed) is logged for audit.
- `/dashboard/admin` — HEAD_OF_UNIT-only user management page (approve, reject, deactivate, reactivate, reset password, toggle `cdrAccess`).
- Days-open badge on stale-case alerts.

### `106bad3` — Role-based views, team overview, fraud linking, officer filters
- Dashboard renders different sections depending on role: `HEAD_OF_UNIT`/`ADMIN` see Team Overview, Cases Needing Attention, Crime Intelligence Overview; officers see personal stats.
- Team productivity score (`activeCases * 3 + weeklyEntries * 2 + cdrCount`).
- Fraud-case linking via the Intel DB.
- Case list `officerId` filter for admins.

### Migrations between init and feature build
- `20260311131019_add_international` — International requests table.
- `20260311212034_add_activity_reports` — Weekly activity report submissions.
- `20260311221830_add_user_approval` — `approved` flag on User.
- `20260327141339_add_fraud_case_link_and_attachments` — Linking + `attachmentPath`/`attachmentName` on CDR and InternationalRequest.
- `20260414163421_remove_priority` — Dropped the per-case priority column (priority now derives from category + status in the UI).
- `20260414165805_optional_cdr_caseid` — `CdrRequest.caseId` made optional so CDRs can exist independently of a case.
- `20260415092930_add_cdr_access` — `User.cdrAccess` flag.
- `20260415142647_add_last_active` — `User.lastActive` timestamp, set on login.
- `20260415224046_add_deactivated_field` — `User.deactivated` flag.

### `e9f2f6b` — Initial scaffold
- `create-next-app` baseline. Nothing functional yet.
