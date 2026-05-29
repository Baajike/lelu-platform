# Project Status

Honest snapshot of where the platform stands as of 2026-05-29. Grouped by Done / In Progress / Pending.

For commit-level chronology see `CHANGELOG.md`. For security-specific gaps see `SECURITY_CHECKLIST.md`.

---

## Done — shipped to production

### Authentication & users
- [x] NextAuth credentials flow with JWT sessions
- [x] bcrypt password hashing
- [x] Self-registration with approval gate
- [x] First-HEAD_OF_UNIT auto-approval
- [x] Account approval / rejection / deactivation / reactivation
- [x] Password reset by HEAD/ADMIN; self-service password change
- [x] CDR access flag (per-user)
- [x] Hard delete (HEAD_OF_UNIT only) with FK nullification

### Cases
- [x] Create, list, view, edit, close, decline, reopen
- [x] Auto-generated `LELU-YYYY-NNN` case numbers
- [x] Categories (cybercrime taxonomy)
- [x] **Delete case** (HEAD/ADMIN) with transactional cleanup ← shipped this session
- [x] Case assignments with invitation flow (Pending → Accepted / Declined)
- [x] Co-viewing banner (in-memory, 5-min TTL)
- [x] Case activity audit log
- [x] Stale-case detection (≥ 30 d open, no entry in 7 d)

### CDR
- [x] Log requests with identifier type (phone or other), telco, period, justification
- [x] Optional case link
- [x] Assign to officer (with `cdrAccess` filter)
- [x] Receive response (file upload + status flip)
- [x] Duplicate identifier detection at submission

### Journal entries
- [x] Per-case append + edit (author/HEAD/ADMIN) + delete
- [x] dayNumber sequencing
- [x] Duplicate identifier detection while typing

### International requests
- [x] Outgoing + Incoming directions
- [x] Auto-generated `LELU-INTL-YYYY-NNN` reference
- [x] File attachment for responses
- [x] Optional case link

### Intelligence
- [x] Cross-system free-text search (Intel DB)
- [x] Case correlation engine (related cases via shared identifiers)

### Notifications
- [x] In-app notification model
- [x] Case invitation notifications with accept/decline in the bell
- [x] Computed alerts: pending approvals, stale cases, overdue CDR, overdue international
- [x] 30-second polling

### Reports
- [x] Weekly activity report submission
- [x] Team report generator (HEAD/SUPERVISOR/ADMIN)
- [x] Single-case report data

### Dashboard
- [x] Role-tailored sections
- [x] Stat cards
- [x] Team Overview with productivity score
- [x] Crime Intelligence heatmap
- [x] Personal vs. command-level widgets
- [x] CDRs Assigned to Me widget

### Infrastructure
- [x] PostgreSQL migrations (PostgreSQL-compatible SQL throughout)
- [x] PM2 process supervision
- [x] nginx reverse proxy
- [x] HTTPS via Let's Encrypt (`setup-domain.sh`)
- [x] `update.sh` for production updates
- [x] Linux Prisma binary committed for the generated client
- [x] `setup.sh` + `setup-domain.sh` bootstrap scripts
- [x] **Missing CaseAssignment + Notification migration patched** ← shipped this session

---

## In Progress — partly built / used in dev

- [ ] **Light / dark theme toggle**. The dashboard layout reads `localStorage["lelu-theme"]` and listens for a custom `lelu-theme-change` window event, but there's no UI to toggle the value. State machinery exists; the switch doesn't.
- [ ] **Profile page**. Display name and password change are wired. Missing: profile picture upload, email change, notification preferences.
- [ ] **Reports page (UI polish)**. The data endpoints are solid; the page itself is functional but not visually consistent with the rest of the dashboard.
- [ ] **CDR assignment UI rollout**. Backend supports it (commit `937180a` + `ad6d2de`); the frontend exposes it on the CDR list. Adoption by users is mid-rollout — onboarding screens not yet built.

---

## Pending — known to be wanted, not started

### Functional
- [ ] **Soft-delete for cases** as an alternative to hard-delete (so HEAD can "archive" rather than permanently remove).
- [ ] **Bulk operations** in admin (bulk approve, bulk deactivate).
- [ ] **Case templates / categories sub-types** to standardise journal structure per offence type.
- [ ] **Export to PDF** for completed case reports and weekly activity reports.
- [ ] **Saved searches / filters** on the case list.
- [ ] **Email notifications** in addition to in-app (currently bell-only). Requires SMTP wiring.
- [ ] **Mobile-friendly responsive layout**. Currently desktop-first; small screens overflow.
- [ ] **Per-user notification preferences** (mute, frequency).
- [ ] **Full-text search index** instead of `contains` substring matches. Postgres `tsvector` would be sufficient.

### Security (from `SECURITY_CHECKLIST.md`)
- [ ] Rate limiting at nginx for `/api/auth/*`.
- [ ] Session timeout reduction (currently NextAuth default 30 d).
- [ ] 2FA for HEAD_OF_UNIT and ADMIN.
- [ ] File upload MIME validation, size cap, virus scan.
- [ ] Auth event audit log (logins, logouts, failed attempts).
- [ ] HSTS, CSP, X-Content-Type-Options headers in nginx.

### Operational
- [ ] **Automated backups**. `pg_dump` on cron + offsite copy.
- [ ] **Staging environment** mirroring production.
- [ ] **CI / CD**. At minimum: lint + `prisma validate` on PR.
- [ ] **Observability**. Sentry or equivalent for unhandled exceptions, basic uptime alerting.
- [ ] **Test suite**. There are no automated tests. The bell flow, case-team flow, and CDR assignment are mature enough to warrant integration tests.

### Documentation
- [x] CLAUDE.md, full `docs/` set (this batch, 2026-05-29)
- [ ] Per-feature one-pagers for officers (could be linked from the UI's "Help" overlay — overlay not built either).
- [ ] Disaster recovery runbook (DB restore, PM2 reset, nginx fallback).

---

## Recently fixed regressions

- Production 500s on `/api/cases`, `/api/notifications` — root cause was missing migrations for `CaseAssignment` and `Notification` tables. Patched in `20260529000000_add_case_assignment_and_notification`. Schema/code already had the models; only the SQL was missing.
- Schema provider drift to SQLite (caught in commit `6c5bd07`). Guarded in `CLAUDE.md`.

---

## Stability assessment

- **Core flows** (login, case open, entry add, CDR log, search) are exercised daily and stable.
- **Edge flows** (delete case, mass approval, role transitions) are recently shipped and lightly tested.
- **Infrastructure** is stable but fragile: single Node process, no failover, no automated backup.
- **Performance** is adequate for the current scale (single unit, low hundreds of cases). The case correlation engine on `GET /api/cases/[id]` is the most likely first bottleneck at the next order of magnitude.
