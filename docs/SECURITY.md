# LELU Platform — Security Guide

This document covers the security model, authentication design, access controls, and incident response procedures for the LELU platform.

---

## Table of Contents

1. [Role-Based Access Control (RBAC)](#1-role-based-access-control-rbac)
2. [How Authentication Works](#2-how-authentication-works)
3. [Password Policies and Reset Procedures](#3-password-policies-and-reset-procedures)
4. [What to Do if an Account is Compromised](#4-what-to-do-if-an-account-is-compromised)
5. [Secure Deployment Checklist](#5-secure-deployment-checklist)
6. [Data Sensitivity Notes](#6-data-sensitivity-notes)

---

## 1. Role-Based Access Control (RBAC)

The LELU platform enforces access at the API layer on every request. There is no purely frontend-enforced restriction — all permission checks happen server-side.

### Roles

| Role | Description |
|---|---|
| `OFFICER` | Default role for all new officers. Sees only their own cases and cases they have been invited to. |
| `SUPERVISOR` | Can approve/reject pending registrations. Can view team-level reports. Sees own + assigned cases. |
| `OFFICE_ADMINISTRATOR` | Can approve/reject registrations. Cannot deactivate users or reset passwords. |
| `HEAD_OF_UNIT` | Full visibility across all cases, users, CDR, and international requests. Can manage all user accounts. Receives all system-level alerts. |
| `ADMIN` | Superuser role. Identical permissions to HEAD_OF_UNIT. Intended for system administrators. |

### What each role can and cannot do

| Action | OFFICER | SUPERVISOR | OFFICE_ADMIN | HEAD_OF_UNIT | ADMIN |
|---|---|---|---|---|---|
| Create / manage own cases | Yes | Yes | Yes | Yes | Yes |
| View all cases (unit-wide) | No | Yes | No | Yes | Yes |
| Invite officers to own cases | Yes | Yes | Yes | Yes | Yes |
| Invite officers to any case | No | No | No | Yes | Yes |
| Submit CDR requests | CDR access required | CDR access required | CDR access required | Yes | Yes |
| View all CDR requests | No | No | No | Yes | Yes |
| Submit international requests | Yes | Yes | Yes | Yes | Yes |
| View all international requests | No | No | No | Yes | Yes |
| Approve / reject registrations | No | Yes | Yes | Yes | Yes |
| Deactivate / reactivate users | No | No | No | Yes | Yes |
| Reset user passwords | No | No | No | Yes | Yes |
| Toggle CDR access for users | No | No | No | Yes | Yes |
| Delete user accounts | No | No | No | Yes | Yes |
| Generate team reports | No | Yes | No | Yes | Yes |
| Receive stale case alerts | No | No | No | Yes | Yes |
| Receive overdue CDR alerts | No | No | No | Yes | Yes |

### CDR Access Flag

CDR data (Call Detail Records) is treated as particularly sensitive. Even within roles that nominally permit CDR submission, the `cdrAccess` flag on each user account must be explicitly enabled by a Head of Unit before that officer can access CDR functionality. This is an additional per-user gate on top of the role hierarchy.

### How RBAC is implemented

- Every API route handler calls `getServerSession(authOptions)` at the start.
- If no valid session exists, the handler returns `401 Unauthorized`.
- Role checks are performed against `session.user.role`.
- Row-level scoping is applied via Prisma `where` clauses — for example, officers' queries include `WHERE officerId = session.user.id OR caseAssignments.userId = session.user.id`.

---

## 2. How Authentication Works

### Registration flow

1. User submits name, email, and password to `POST /api/auth/register`.
2. The password is hashed using **bcryptjs** with a work factor of **10 rounds** before being stored.
3. The user record is created with `approved: false` — the account is inactive.
4. An administrator must explicitly approve the account before the user can log in.

### Login flow

1. User submits email and password to the NextAuth Credentials provider.
2. The server retrieves the user record by email.
3. If the user is not found, not approved (`approved: false`), or is deactivated (`deactivated: true`), the login is rejected.
4. The submitted password is verified against the stored hash using `bcryptjs.compare()`.
5. On success, a **JWT token** is created and stored in an **httpOnly, Secure cookie** (`next-auth.session-token`).
6. The JWT includes `user.id` and `user.role`. These values are injected into every subsequent server-side session via NextAuth callbacks.
7. The `lastActive` timestamp on the user record is updated.

### Session management

- Sessions are JWT-based (not database sessions). The JWT is signed with `NEXTAUTH_SECRET`.
- The default NextAuth session expiry applies (30 days if not overridden).
- Sessions are stored client-side in an httpOnly cookie, making them inaccessible to JavaScript running on the page (XSS protection).
- To force-invalidate all sessions (e.g., after a key rotation), rotate `NEXTAUTH_SECRET` in `.env` and restart the application. All existing tokens will become invalid.

### Logout

Calling NextAuth's `signOut()` clears the session cookie. The JWT is not explicitly revoked server-side (stateless JWT model), but because it is stored only in the httpOnly cookie, clearing the cookie immediately ends the session for that browser.

---

## 3. Password Policies and Reset Procedures

### Password hashing

All passwords are hashed with **bcryptjs** at a work factor of 10 rounds. Plaintext passwords are never stored or logged at any point.

### Recommended password requirements

The application does not currently enforce a complexity policy at the API level. Administrators should instruct users to choose passwords that:
- Are at least **12 characters** long.
- Include a mix of uppercase letters, lowercase letters, numbers, and symbols.
- Are unique to this platform (not reused from other systems).

### Self-service password change

Users can change their own password at any time:
1. Click the account menu (top right of the dashboard).
2. Select **Change Password**.
3. Enter current password, then new password (twice to confirm).
4. Click **Save**.

The change takes effect immediately.

### Admin-initiated password reset (for locked-out users)

1. The Head of Unit goes to **Admin → Active Users**.
2. Finds the officer and clicks **Reset Password**.
3. The system generates a new temporary password, which is displayed on-screen once.
4. The Head of Unit communicates the temporary password to the officer via a **secure, out-of-band channel** (in person or encrypted message — not plain email or SMS).
5. The officer logs in with the temporary password and must change it immediately.

> **Security requirement:** Temporary passwords must never be transmitted over unencrypted channels (plain email, SMS, WhatsApp). Use in-person handover or an end-to-end encrypted channel.

### NEXTAUTH_SECRET rotation

If `NEXTAUTH_SECRET` is compromised:
1. Generate a new secret: `openssl rand -base64 32`
2. Update `.env` with the new value.
3. Restart the application: `pm2 reload lelu-platform`
4. All existing user sessions are immediately invalidated. Users must log in again.

---

## 4. What to Do if an Account is Compromised

Follow these steps immediately if you suspect an officer's account has been taken over.

### Step 1 — Deactivate the account

1. Log in as Head of Unit or Admin.
2. Go to **Admin → Active Users**.
3. Find the compromised account and click **Deactivate**.

This prevents the attacker from continuing to use the account. Deactivation is immediate.

### Step 2 — Audit recent activity

Review what the compromised account did while it may have been under attacker control:
- Open the **Cases** list filtered to that officer and review all recent case activity logs.
- Check the **CDR** and **24/7 Network** lists for any requests submitted by that officer.
- Review the **Reports** section for any activity reports.

Case activity logs record every action (who did what and when), providing a full audit trail.

### Step 3 — Determine the scope

- Were any sensitive records (CDR data, case details, international requests) accessed or exported?
- Were any cases modified, closed, or entries deleted?
- Were any other accounts invited to sensitive cases?

Document your findings.

### Step 4 — Reset the password and reactivate (if appropriate)

Once the root cause of the compromise is understood (weak password, shared credentials, phishing, etc.):
1. Go to **Admin → Deactivated Users**.
2. Issue a **Reset Password** for the officer.
3. Deliver the temporary password securely (in person).
4. Click **Reactivate** to restore the account.
5. Instruct the officer to change the password immediately and log out of all other sessions.

### Step 5 — Rotate NEXTAUTH_SECRET if a server compromise is suspected

If there is any indication that the server itself was compromised (not just a single account), rotate the `NEXTAUTH_SECRET` to invalidate all existing sessions across all users:

```bash
# On the server
cd /opt/lelu-platform
# Edit .env and update NEXTAUTH_SECRET with a new value
nano .env
pm2 reload lelu-platform
```

All users will be logged out and must re-authenticate.

### Step 6 — Notify the appropriate authority

Report the incident through your unit's standard data breach or security incident reporting process. If personal data (subscriber CDR records, case subject details) may have been accessed, consider whether your data protection obligations require external notification.

---

## 5. Secure Deployment Checklist

Use this checklist when deploying or auditing the platform.

### Environment

- [ ] `.env` file is not committed to the repository (verify `.gitignore` includes `.env`).
- [ ] `NEXTAUTH_SECRET` is at least 32 characters, randomly generated, and kept confidential.
- [ ] `DATABASE_URL` uses a dedicated database user with minimal required privileges (not the PostgreSQL superuser).
- [ ] `NEXTAUTH_URL` matches the actual URL users access (prevents redirect attacks).

### Database

- [ ] PostgreSQL is not exposed to the internet (bind to `localhost` or internal network only).
- [ ] The database password is strong and not reused elsewhere.
- [ ] Regular backups are configured and tested.

### Network

- [ ] The Next.js application port (3000) is not directly exposed to the internet — Nginx handles all public traffic.
- [ ] HTTPS is enabled via Nginx + Let's Encrypt (or equivalent certificate authority).
- [ ] HTTP requests are redirected to HTTPS in the Nginx configuration.
- [ ] Firewall allows only ports 80 (HTTP redirect), 443 (HTTPS), and 22 (SSH from trusted IPs only).

### Application

- [ ] Default seeded passwords (`lelu2026`) have been changed on all seed accounts before going live.
- [ ] PM2 is configured to restart automatically on server reboot (`pm2 startup && pm2 save`).
- [ ] Application logs are monitored: `pm2 logs lelu-platform`.

### User accounts

- [ ] No shared accounts — each officer has a unique account.
- [ ] CDR access is granted only to officers with a legitimate operational need.
- [ ] Departing officers' accounts are deactivated on the day they leave the unit.
- [ ] Accounts are reviewed periodically to remove stale/unused accounts.

---

## 6. Data Sensitivity Notes

The LELU platform handles law enforcement case data. The following data categories require particular care:

| Data Type | Sensitivity | Notes |
|---|---|---|
| Case records | High | May contain personal data about suspects and victims. Access is restricted to assigned officers. |
| CDR (Call Detail Records) | Very High | Subscriber data obtained under legal authority. Gated behind the `cdrAccess` flag. Store attachments securely; limit access. |
| International requests | High | May involve foreign intelligence. Tied to 24/7 Network obligations. |
| Journal entries | High | May include operational details, informant references, or sensitive personal data. |
| User passwords | N/A | Never stored in plaintext. Bcryptjs hashed. |
| Session tokens | Medium | HttpOnly cookies. Not accessible to JavaScript. Invalidated on logout. |

### File attachments

CDR response attachments and international request documents are stored on the application server filesystem. Ensure:
- The upload directory is not web-accessible (not inside `public/`).
- File permissions restrict access to the application process only.
- Backups of the upload directory are included in your backup strategy.

### Audit trail

The `CaseActivity` model provides a tamper-evident audit log of all actions on cases (who did what and when). This log is append-only via the application and should not be modified directly in the database. Preserve it as part of your data retention policy.
