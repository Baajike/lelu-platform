# Security Checklist

What's implemented today and what's still open. Grounded in the actual code, not aspirational. For broader security posture context, see also `docs/SECURITY.md` (existing handover doc).

---

## Implemented

### Authentication
- [x] Passwords hashed with `bcryptjs` (cost 10) — see `app/api/auth/register/route.js` and `/api/users/[userId]/approve` `reset_password`.
- [x] Login does constant-time-ish bcrypt compare via `bcrypt.compare`.
- [x] JWT sessions signed with `NEXTAUTH_SECRET` (server-side only).
- [x] Sessions are HttpOnly + Secure (when `NEXTAUTH_URL` is HTTPS) — NextAuth default.
- [x] Login throws distinct errors for `PENDING_APPROVAL` and `DEACTIVATED`. The error message is bland on the client side; no user-enumeration disclosure beyond "the credential combination is invalid".

### Authorization
- [x] Every API route except `POST /api/auth/register` and `GET /api/users/check-head` enforces `getServerSession(authOptions)` at the top.
- [x] Role-based gates use exact role lists, not boolean flags. Easier to audit.
- [x] Per-resource ownership checks for sensitive mutations:
  - `PATCH /api/cases/[id]` — owner OR accepted assignee OR HEAD/ADMIN
  - `DELETE /api/cases/[id]` — HEAD/ADMIN only
  - `PATCH/DELETE /api/cdr/[cdrId]` — requester OR HEAD/ADMIN
  - `PATCH/DELETE /api/entries/[entryId]` — author OR HEAD/ADMIN
  - `PATCH/DELETE /api/international/[reqId]` — creator OR HEAD/ADMIN
  - `POST /api/cases/[id]/assignments` — owner OR HEAD/ADMIN
  - `PATCH /api/cases/[id]/assignments` — only the assignee themselves
- [x] Self-delete blocked: `DELETE /api/users/[userId]` refuses if `userId === session.user.id`.
- [x] Registration cannot create ADMIN: `POST /api/auth/register` returns 403 if `role: "ADMIN"` is requested.
- [x] HEAD_OF_UNIT registration capped at one: subsequent attempts return 400.

### Account lifecycle
- [x] Approval gate. New accounts cannot log in until approved.
- [x] First HEAD_OF_UNIT auto-approves to bootstrap the unit safely.
- [x] Deactivation is reversible (soft); deletion (HEAD only) nullifies FKs first to preserve case integrity.

### Input handling
- [x] File upload sanitises filename: `[^a-zA-Z0-9._-]` → `_`, prefixed with timestamp to avoid collisions.
- [x] JSON parsing is via `request.json()` (built-in); malformed bodies surface as 500 with a generic error rather than executing partial state changes.
- [x] Prisma parameterises all queries; SQL injection via the ORM path is not possible.

### Audit trail
- [x] Every meaningful case action writes a `CaseActivity` row (open, close, decline, reopen, entry add, officer invited / removed / accept / decline, case deleted).
- [x] `userName` denormalised so the timeline survives user deletion.
- [x] `caseActivity` rows have no UI to edit or delete — append-only.

### Database
- [x] `provider = "postgresql"` (commit `6c5bd07` explicitly guards against accidental SQLite revert).
- [x] Migrations idempotent where they were applied retroactively (`IF NOT EXISTS` + `DO $$ ... EXCEPTION WHEN duplicate_object`).
- [x] FK behavior explicit:
  - `User → Case.officerId`: `ON DELETE SET NULL`
  - `User → JournalEntry.authorId`: `ON DELETE SET NULL`
  - `User → CaseAssignment.userId`: `ON DELETE CASCADE`
  - `Case → CaseAssignment.caseId`: `ON DELETE CASCADE`
  - `User → Notification.userId`: `ON DELETE CASCADE`

### Deployment
- [x] `.env` gitignored. `.env.example` ships placeholders only.
- [x] `NEXTAUTH_SECRET` documented as `openssl rand -base64 32`.
- [x] PostgreSQL bound to loopback only (default install via `setup.sh`).
- [x] Next.js port `:3000` only reachable from nginx, not directly internet-facing (nginx config in `lelu-nginx.conf`).
- [x] `setup-domain.sh` provisions Let's Encrypt TLS.

---

## Still needed

### Authentication / authorization
- [ ] **Rate limiting**. There is none. A logged-in user can hammer any endpoint; an unauthenticated attacker can hammer `/api/auth/register` and `/api/users/check-head` indefinitely. Add nginx-level `limit_req_zone` for `/api/auth/` at minimum.
- [ ] **Brute-force protection** on login. NextAuth has no built-in account lockout. Consider a tarpit on N failed attempts, or move login behind nginx rate limiting.
- [ ] **2FA / MFA** for HEAD_OF_UNIT and ADMIN. Not implemented.
- [ ] **Session timeout / absolute lifetime**. Default JWT lifetime applies (currently 30 days). Consider shortening to ~8 h for an active-investigation tool.
- [ ] **Password policy**. Minimum 8 chars enforced on password change and admin reset; no complexity rules, no breach-list check.
- [ ] **CSRF on state-changing GETs / POSTs**. NextAuth's CSRF token is used for the credentials flow, but custom POST/PATCH/DELETE routes rely on same-origin + the session cookie. Same-origin is the implicit defence; an explicit CSRF token for each mutating route would be stronger.

### Input handling
- [ ] **File upload MIME / extension validation**. `POST /api/upload` accepts any file. Restrict to PDF / JPG / PNG by sniffing magic bytes, and cap size below the Next.js default.
- [ ] **File upload size cap**. Next.js default body limit is small (~4 MB) but isn't explicit anywhere. Set `export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }` for the upload route specifically.
- [ ] **Virus scan on uploads**. Production handles attachments from external sources (telco PDFs). ClamAV scan before persisting is appropriate.
- [ ] **HTML / XSS on user input**. React's JSX escaping handles most cases, but free-text fields (case description, journal entries) render via React text nodes — fine for now. If you ever introduce `dangerouslySetInnerHTML`, lock it down.

### Data protection
- [ ] **At-rest encryption** for the PostgreSQL data directory. Filesystem-level encryption (LUKS) is the standard answer; not configured by the setup scripts.
- [ ] **Backup strategy**. No automated PostgreSQL dumps. `pg_dump` on cron + offsite copy is the bare minimum.
- [ ] **Uploaded file isolation**. `public/uploads/` is publicly readable via Next.js static serving. If an attachment URL is guessed, it's accessible without auth. Either move uploads outside `public/` and gate access through an authenticated route, or use unguessable filenames + don't print them in client-side state (current behavior uses timestamps — guessable).

### Logging / monitoring
- [ ] **Structured server logs**. Currently `console.error` / route 500s. Add Pino or similar with PII-aware filtering.
- [ ] **Auth event audit**. Logins, logouts, failed logins are not recorded anywhere. The `lastActive` field captures successful logins only.
- [ ] **Failed-authz audit**. 403s are not logged.
- [ ] **Alerting**. Nothing pages a human on errors. Hook PM2 to a webhook or Sentry.
- [ ] **PII / sensitive field handling**. Case descriptions and entries can contain victim names, ID numbers, phone numbers. There's no field-level encryption and no redaction. Document who has DB access.

### Headers / nginx hardening
- [ ] **HSTS** in nginx when on HTTPS.
- [ ] **Content-Security-Policy**. None set. Inline styles complicate this — would need `'unsafe-inline'` or a refactor.
- [ ] **X-Content-Type-Options: nosniff**.
- [ ] **X-Frame-Options: DENY**.
- [ ] **Referrer-Policy: same-origin**.

### Process hygiene
- [ ] **No CI**. There's no `npm test`, no lint-on-PR. Migrations are applied manually on the prod box.
- [ ] **No staging env**. Migrations and code go straight from local to production via `update.sh`.
- [ ] **No automated dependency scanning**. `npm audit` is not enforced.

### Accessibility (not strictly security but worth flagging)
- [ ] Focus-visible styles missing on most buttons.
- [ ] Keyboard navigation not verified across modals.
- [ ] Some captions sit below WCAG 4.5:1 contrast.
- [ ] No ARIA roles on the notification bell / panel.

---

## Threat model summary

The implicit threat model is **insider misuse**, not external attack:

- Network is assumed to be internal / VPN-only.
- Users are vetted before being given an account.
- The HEAD_OF_UNIT is trusted absolutely.

For deployments where any of those assumptions don't hold (a public IP, untrusted users, multiple HEADs over time), the open items above become urgent rather than nice-to-have.
