# Frontend Structure

Every page, the shared layout, the patterns each uses, and where state lives. There is **no shared component library** — every UI element is inlined per page. This is documented as the existing convention, not as a recommendation.

## Routing

```
/                                  → app/page.js               (Splash)
/login                             → app/login/page.js
/register                          → app/register/page.js
/dashboard                         → app/dashboard/page.js     (Main dashboard)
/dashboard/cases                   → app/dashboard/cases/page.js
/dashboard/cases/[id]              → app/dashboard/cases/[id]/page.js
/dashboard/cdr                     → app/dashboard/cdr/page.js
/dashboard/fraud                   → app/dashboard/fraud/page.js  (Intel DB)
/dashboard/international           → app/dashboard/international/page.js
/dashboard/reports                 → app/dashboard/reports/page.js
/dashboard/admin                   → app/dashboard/admin/page.js
/dashboard/profile                 → app/dashboard/profile/page.js
```

All `/dashboard/*` pages are wrapped by `app/dashboard/layout.js`. All pages are Client Components (`"use client"`).

## Root layout (`app/layout.js`)

Minimal. Wraps everything in `<SessionProvider>` so `useSession()` works anywhere. Imports `globals.css`.

## Dashboard layout (`app/dashboard/layout.js`)

The most important shared piece. Renders:

- **Fixed sidebar** (240 px) with logo, nav items, user profile chip.
- **Top bar** (60 px, sticky) with page title, date, notification bell, profile avatar.
- **Page content** that fades in on route change.

Nav items (left-rail):
- Dashboard
- Case Management
- CDR
- Intel DB
- 24/7 Network
- Reports
- User Management (HEAD_OF_UNIT only — extra item below the standard set)

**Auth redirect**: `useEffect` watches `status === "unauthenticated"` and pushes `/login`.

**Notification machinery** lives entirely here:

| Source | When fetched | Who sees it |
|---|---|---|
| `GET /api/users?pending=true` | Once per session mount | APPROVAL_ROLES |
| `GET /api/cases` (filter stale) | Once per session mount | HEAD_OF_UNIT |
| `GET /api/cdr` (filter ≥ 14d Pending) | Once per session mount | HEAD_OF_UNIT |
| `GET /api/international` (filter ≥ 14d Pending) | Once per session mount | HEAD_OF_UNIT |
| `GET /api/notifications` (personal) | Mount + every 30 s | All users |

The bell badge sums all of those. Click → dropdown panel rendered inline; each section uses local sub-components (`NotifSection`, `NotifItem`, `InvitationNotifItem`) defined in the same file.

`viewerStore` is not touched here; that's per-case-page.

## Page-by-page

### `/dashboard/page.js` — Main dashboard

State (the largest in the app):
- `stats` — counts (cases, pending CDRs, intel items, intl requests).
- `recentCases`, `allCases`, `allCdrs`, `allIntl`, `allEntries`, `assignedCdrs`, `pendingUsers`, `teamStats`.
- Memoized derived: `staleCases`, `weeklyDigest`, `personalStats`, `categoryBreakdown`.

Fetches (all on mount, parallel):
- `/api/cases`, `/api/cdr`, `/api/international`, `/api/entries`, `/api/cdr?assigned=true`
- Conditional (admin roles): `/api/users?pending=true`, `/api/users?withStats=true`

UI sections (rendered conditionally on role):
- Welcome banner with `+ NEW CASE` CTA.
- Pending Approvals (APPROVAL_ROLES only, if any).
- Stat cards (everyone).
- CDRs Assigned to Me (everyone, if any).
- Crime Intelligence Overview heatmap (HEAD / ADMIN).
- Team Overview (HEAD / ADMIN).
- Cases Needing Attention (HEAD / ADMIN).
- Personal Stats (non-HEAD / non-ADMIN).
- Recent Cases + Quick Actions + Weekly Digest / Your Activity (everyone, split by role).

### `/dashboard/cases/page.js` — Case list

State: `cases`, search/filter inputs, modal toggles. Fetches `GET /api/cases`. Renders cards with status/category badges. Includes the "New Case" modal which POSTs to `/api/cases`.

### `/dashboard/cases/[id]/page.js` — Case detail

The largest single page in the app (~1100 lines). Owns:

- The case payload + correlation result + viewers polling.
- Journal entries (display + add + delete modals).
- CDR requests for this case (display + log modal with duplicate check).
- Case team (display + invite modal + accept/decline UX delegated to the bell).
- Close / Decline / Delete modals (Delete is HEAD/ADMIN only).
- Activity log timeline at the bottom.
- Related Cases panel (from `relatedCases[]` in the case payload).

Polls `/api/cases/[id]/viewers` every 30 s; `DELETE`s on unmount.

### `/dashboard/cdr/page.js` — CDR requests

Lists CDRs. Filters by status, telco, requester, period. Assignment UI (HEAD/ADMIN can assign to officers with `cdrAccess`). Receive-response flow (upload + PATCH). Submission modal with duplicate check.

### `/dashboard/fraud/page.js` — Intel DB

Single search box. Calls `/api/search?q=` on submit. Renders four result columns (CDRs, Cases, Entries, International). Each result is a clickable row routing to the relevant detail page.

### `/dashboard/international/page.js` — 24/7 Network

Symmetric to CDR: list + new-request modal + receive-response flow.

### `/dashboard/reports/page.js` — Reports

Two modes:
- **Submit weekly report** (officer): form posts to `/api/reports/activity`.
- **Team report** (HEAD/ADMIN/SUPERVISOR): date-range picker fetches `/api/reports/data?team=true&from=...&to=...` and renders summary tables.

### `/dashboard/admin/page.js` — User management (HEAD_OF_UNIT only)

Three tabs:
- Pending Approvals — approve / reject (PATCH /api/users/[userId]/approve).
- Active Users — toggle `cdrAccess`, reset password modal, deactivate.
- Deactivated Users — reactivate, hard-delete.

### `/dashboard/profile/page.js` — Profile

Form to update name; second form to change password (current + new). Sign-out CTA.

### `/login/page.js`, `/register/page.js`

Both standalone (no dashboard chrome). Use the splash colour scheme. Register fetches `/api/users/check-head` to decide whether to expose HEAD_OF_UNIT in the role dropdown.

## State management

There is no global state library. Patterns:

- **Server data**: each page fetches its own data in `useEffect(() => { fetch(...) }, [])` and stores it in `useState`. No SWR, no React Query, no normalisation.
- **Session**: `useSession()` from `next-auth/react` in any client component. Provided by `SessionProvider` in `app/layout.js`.
- **Notifications**: owned by `app/dashboard/layout.js`. Not exposed to children — pages re-fetch independently if they need similar data.
- **In-page modal state**: just `useState` booleans. Most pages have 3–8 of these.
- **Form state**: `useState` objects, no react-hook-form.
- **Polling**: `setInterval` inside `useEffect`, cleared in the return cleanup.

## Shared utilities

Nothing is exported from a shared `components/` directory — that directory doesn't exist. Repeating helpers (e.g., `roleLabel`, `roleColor`, `daysSince`) are redefined in each page that needs them. The candidates for a `components/` lift, if you ever do that:

- Top-banner / status pill / stat card.
- Modal frame (overlay + container + close button).
- Confirmation modal.
- The "duplicate identifier warning" block (used by case detail entry form + CDR modal).
- The CDR / international request row (similar structure in both pages).
- `roleLabel` and `roleColor` (duplicated at least twice).

## Styling

- **Inline styles, no Tailwind classes** despite Tailwind being installed.
- Font: `'Segoe UI', sans-serif`.
- Colors and patterns documented in `DESIGN.md`.
- Animations: defined per page with inline `<style>` blocks (`@keyframes lelu-spin`, `fadeInPage`, `slideInLeft`, `dropIn`). The dashboard layout has the broadest set.
- No CSS modules, no styled-components.

## Icons

`lucide-react`. Imported per page from `"lucide-react"`. Sizes typically 13–18 px in the UI, with 28–40 px hero icons for empty states.

Common icons used:
- `FolderOpen` (cases), `Phone` (CDR), `ShieldAlert` (Intel DB), `Globe` (24/7), `FileBarChart2` (reports), `LayoutDashboard`, `Users`, `Bell`, `AlertTriangle`, `AlertCircle`, `Clock`, `CheckCircle`, `XCircle`, `ChevronRight`, `Mail`, `Check`, `X`, `Trash2`, `Plus`, `UserPlus`, `Crown`, `BookOpen`, `GitBranch`, `BarChart2`, `TrendingUp`, `ArrowLeft`.
