# LELU Platform

Law Enforcement Liaison Unit (LELU) — internal case management system for the Ghana Police Service. Officers log cases, submit CDR requests, track international requests, and generate activity reports. Role-based access controls restrict what each user can see and do.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database ORM | Prisma |
| Database | SQLite (development) / PostgreSQL (production-ready) |
| Auth | NextAuth.js (JWT sessions) |
| UI | React, Lucide icons |
| Password hashing | bcryptjs |

---

## Setup Instructions (IT Team)

### Prerequisites

- Node.js 18 or higher
- Git

### 1. Clone and install

```bash
git clone <repository-url>
cd lelu-platform
npm install
```

### 2. Environment setup

```bash
cp .env.example .env
```

Open `.env` and fill in the values (see [Environment Variables](#environment-variables) below).

### 3. Database setup

```bash
npx prisma migrate deploy
node prisma/seed.js
```

This creates the database schema and seeds the initial user accounts.

### 4. Build and run

```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000` (or the port configured in `NEXTAUTH_URL`).

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Path to the SQLite database file | `file:./prisma/lelu.db` |
| `NEXTAUTH_SECRET` | Secret key used to sign JWT tokens — must be long, random, and kept private | `change-this-to-a-long-random-string` |
| `NEXTAUTH_URL` | Full URL of the application (no trailing slash) | `http://localhost:3000` |

> **Important:** Change `NEXTAUTH_SECRET` to a strong random value before deploying. You can generate one with: `openssl rand -base64 32`

---

## Default Login Credentials

All accounts use password: **`lelu2026`**

| Email | Role |
|---|---|
| `head@lelu.gov.gh` | Head of Unit |
| `admin@lelu.gov.gh` | Office Administrator |
| `supervisor@lelu.gov.gh` | Supervisor |
| `asante@lelu.gov.gh` | Officer |
| `boateng@lelu.gov.gh` | Officer |
| `darko@lelu.gov.gh` | Officer |

> Change all passwords after first login in production.

---

## Switching from SQLite to PostgreSQL

When ready to move to a production database:

1. Provision a PostgreSQL instance (e.g., Supabase, Railway, or a self-hosted server).

2. In `prisma/schema.prisma`, change the datasource block:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. Update `DATABASE_URL` in `.env` to your PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@host:5432/lelu"
```

4. Run migrations against the new database:

```bash
npx prisma migrate deploy
node prisma/seed.js
```

No application code changes are required — Prisma handles the rest.

---

## Folder Structure

```
lelu-platform/
├── app/
│   ├── api/                  # API route handlers
│   │   ├── auth/             # NextAuth authentication
│   │   ├── cases/            # Case CRUD + assignments
│   │   ├── cdr/              # CDR request management
│   │   ├── notifications/    # In-app notifications
│   │   ├── reports/          # Activity report generation
│   │   └── users/            # User management
│   ├── dashboard/            # Protected dashboard pages
│   │   ├── cases/            # Case list + case detail
│   │   ├── cdr/              # CDR requests
│   │   ├── fraud/            # Intel DB search
│   │   ├── international/    # International requests
│   │   ├── reports/          # Reports
│   │   └── admin/            # User administration
│   ├── generated/prisma/     # Auto-generated Prisma client (do not edit)
│   ├── lib/                  # Shared utilities (db client, helpers)
│   └── login/                # Login page
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.js               # Initial user seed
│   └── lelu.db               # SQLite database file
├── .env                      # Local environment variables (not committed)
├── .env.example              # Template for environment variables
└── README.md
```
