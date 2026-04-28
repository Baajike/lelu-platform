# LELU Platform — Technical Reference

This document is intended for IT staff and developers responsible for deploying, maintaining, and extending the LELU platform.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Technology Stack](#2-technology-stack)
3. [Environment Variables](#3-environment-variables)
4. [Database Setup](#4-database-setup)
5. [Deployment Steps](#5-deployment-steps)
6. [Updating the Application](#6-updating-the-application)
7. [Folder Structure](#7-folder-structure)
8. [API Routes Overview](#8-api-routes-overview)

---

## 1. Architecture Overview

```
Internet / LAN
      │
      ▼
┌─────────────┐
│    Nginx    │  Reverse proxy — terminates HTTP/HTTPS, forwards to port 3000
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Next.js    │  App server (Node.js) managed by PM2 on port 3000
│  App Router │  Server-side rendering + REST API routes under /api
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ PostgreSQL  │  Primary database (single instance, same server or separate)
└─────────────┘
```

**Key design points:**

- **Next.js App Router** — all pages and API routes live in `app/`. Pages are React Server Components by default; client-side interactivity is added via `"use client"` components.
- **Authentication** — NextAuth.js v4 using the Credentials provider (email + bcryptjs hashed password). Sessions are JWT-based (stored in an httpOnly cookie). The Prisma adapter links sessions to the database.
- **Database access** — Prisma ORM with a singleton client (`app/lib/db.js`) to prevent connection pool exhaustion in development.
- **File uploads** — CDR and international request attachments are stored on the server filesystem. The `POST /api/upload` endpoint handles inbound files.
- **In-memory state** — A lightweight in-memory store (`app/lib/viewerStore.js`) tracks who is currently viewing a case (5-minute TTL). This is ephemeral and resets on process restart.

---

## 2. Technology Stack

| Component | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| UI | React + React DOM | 19.x |
| Styling | Tailwind CSS | 4.x |
| Icons | Lucide React | 0.577.x |
| ORM | Prisma | 5.22.x |
| Database | PostgreSQL | 14+ |
| Authentication | NextAuth.js | 4.24.x |
| Auth DB adapter | @next-auth/prisma-adapter | 1.0.x |
| Password hashing | bcryptjs | 3.x |
| Process manager | PM2 | Latest LTS |
| Reverse proxy | Nginx | Latest stable |
| OS | Ubuntu 24.04 LTS | — |

---

## 3. Environment Variables

Copy `.env.example` to `.env` and fill in each value before starting the application.

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | 32+ character random string for JWT signing |
| `NEXTAUTH_URL` | Yes | Full public URL of the application (no trailing slash) |

### `DATABASE_URL`

```
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME"
```

Example (local):
```
DATABASE_URL="postgresql://lelu_user:StrongPassw0rd@localhost:5432/lelu_db"
```

### `NEXTAUTH_SECRET`

Generate a secure value:
```bash
openssl rand -base64 32
```

### `NEXTAUTH_URL`

```
NEXTAUTH_URL="http://192.168.1.10:3000"
# or with a domain:
NEXTAUTH_URL="https://lelu.yourunit.gov.gh"
```

> **Never commit `.env` to version control.** It is listed in `.gitignore`.

---

## 4. Database Setup

### Prerequisites

- PostgreSQL 14 or later installed and running.
- A dedicated database user with `CREATEDB` rights (for migrations).

### Creating the database and user

```sql
-- Run as the postgres superuser
CREATE USER lelu_user WITH PASSWORD 'StrongPassw0rd';
CREATE DATABASE lelu_db OWNER lelu_user;
GRANT ALL PRIVILEGES ON DATABASE lelu_db TO lelu_user;
```

### Running migrations

Prisma migrations are stored in `prisma/migrations/`. Run this command to apply all pending migrations:

```bash
npx prisma migrate deploy
```

This is idempotent — safe to run on every deployment.

### Seeding initial data

```bash
# Create the default Head of Unit account
node prisma/seed.js

# Optional: load demo/test data
node prisma/seed-demo.js
```

Default seeded credentials:

| Email | Role | Password |
|---|---|---|
| (set in seed.js) | HEAD_OF_UNIT | `lelu2026` |

**Change the seed password immediately in production.**

### Prisma schema location

```
prisma/schema.prisma
```

After modifying the schema, generate the updated Prisma client:

```bash
npx prisma generate
```

Create a new migration:

```bash
npx prisma migrate dev --name describe_your_change
```

---

## 5. Deployment Steps

The `setup.sh` script automates a full Ubuntu deployment. For a manual deployment, follow the steps below.

### Manual deployment on Ubuntu 24.04

**1. Install dependencies**

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Nginx
sudo apt-get install -y nginx

# PM2
sudo npm install -g pm2
```

**2. Clone the repository**

```bash
git clone https://github.com/Baajike/lelu-platform.git /opt/lelu-platform
cd /opt/lelu-platform
```

**3. Install Node dependencies**

```bash
npm install
```

**4. Configure environment**

```bash
cp .env.example .env
# Edit .env with the correct DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
nano .env
```

**5. Set up the database**

```bash
# Create DB user and database (see Section 4)
npx prisma migrate deploy
node prisma/seed.js
```

**6. Build the application**

```bash
npm run build
```

**7. Start with PM2**

```bash
pm2 start npm --name "lelu-platform" -- start
pm2 startup      # Enable auto-start on server boot
pm2 save         # Save the current PM2 process list
```

**8. Configure Nginx**

```bash
sudo cp lelu-nginx.conf /etc/nginx/sites-available/lelu-platform
sudo ln -s /etc/nginx/sites-available/lelu-platform /etc/nginx/sites-enabled/
sudo nginx -t    # Test config syntax
sudo systemctl reload nginx
```

**9. (Optional) SSL with Let's Encrypt**

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d lelu.yourunit.gov.gh
```

### Automated deployment

Run `setup.sh` as root on a fresh Ubuntu 24.04 server:

```bash
sudo bash setup.sh
```

The script will prompt for configuration values and complete the full installation.

---

## 6. Updating the Application

The `update.sh` script handles routine updates. To update manually:

```bash
cd /opt/lelu-platform

# Pull the latest code
git pull origin master

# Install any new dependencies
npm install

# Apply any new database migrations
npx prisma migrate deploy

# Regenerate Prisma client if the schema changed
npx prisma generate

# Rebuild the Next.js app
npm run build

# Restart the PM2 process (zero-downtime reload)
pm2 reload lelu-platform
```

Or using the provided script:

```bash
sudo bash update.sh
```

### Checking application status

```bash
pm2 status                     # Show process list and uptime
pm2 logs lelu-platform         # Stream live logs
pm2 logs lelu-platform --lines 100   # Show last 100 log lines
```

### Restarting after a crash

```bash
pm2 restart lelu-platform
```

---

## 7. Folder Structure

```
lelu-platform/
├── app/                        # Next.js App Router root
│   ├── api/                    # REST API route handlers
│   │   ├── auth/
│   │   │   ├── [...nextauth]/  # NextAuth sign-in/sign-out
│   │   │   └── register/       # POST: new user registration
│   │   ├── cases/              # Case CRUD + assignments + entries + viewers
│   │   │   └── [id]/
│   │   │       ├── assignments/
│   │   │       ├── entries/
│   │   │       └── viewers/
│   │   ├── cdr/                # CDR request CRUD
│   │   │   └── [cdrId]/
│   │   ├── entries/            # Journal entry CRUD (cross-case)
│   │   │   └── [entryId]/
│   │   ├── international/      # 24/7 Network request CRUD
│   │   │   └── [reqId]/
│   │   ├── notifications/      # GET + PATCH (mark read)
│   │   ├── reports/
│   │   │   ├── activity/       # Weekly activity reports
│   │   │   └── data/           # Team/case report data
│   │   ├── upload/             # File upload handler
│   │   └── users/              # User management
│   │       ├── me/             # Current user profile + password change
│   │       └── [userId]/
│   │           └── approve/    # Approve/reject/deactivate/reset
│   ├── dashboard/              # Authenticated pages
│   │   ├── layout.js           # Sidebar + topbar shell
│   │   ├── page.js             # Dashboard home (stats)
│   │   ├── admin/              # User management UI (HEAD_OF_UNIT only)
│   │   ├── cases/
│   │   │   ├── page.js         # Case list
│   │   │   └── [id]/page.js    # Case detail
│   │   ├── cdr/page.js         # CDR requests
│   │   ├── fraud/page.js       # Intel DB
│   │   ├── international/page.js # 24/7 Network
│   │   └── reports/page.js     # Reports
│   ├── login/page.js
│   ├── register/page.js
│   ├── lib/
│   │   ├── db.js               # Prisma client singleton
│   │   └── viewerStore.js      # In-memory case viewer tracking (TTL: 5 min)
│   ├── layout.js               # Root HTML layout
│   └── page.js                 # Root redirect (→ /dashboard or /login)
├── prisma/
│   ├── schema.prisma           # Database schema (12 models)
│   ├── seed.js                 # Default user seeding
│   ├── seed-demo.js            # Demo data seeding
│   └── migrations/             # Migration history (do not edit manually)
├── public/                     # Static assets (images, CSS overrides)
├── .env.example                # Environment variable template
├── .gitignore
├── lelu-nginx.conf             # Nginx reverse proxy configuration
├── next.config.mjs             # Next.js configuration
├── package.json
├── setup.sh                    # Full automated Ubuntu deployment
├── setup-domain.sh             # Domain/DNS/SSL setup
├── tailwind.config.js
└── update.sh                   # In-place application update
```

---

## 8. API Routes Overview

All API routes are under `/api/`. They require a valid NextAuth session unless otherwise noted. Role enforcement is done inside each route handler.

### Authentication

| Method | Route | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | No | NextAuth credential sign-in / sign-out |
| `POST` | `/api/auth/register` | No | Register new user (sets `approved: false`) |

### Users

| Method | Route | Roles | Description |
|---|---|---|---|
| `GET` | `/api/users` | APPROVAL_ROLES | List users (filters: `pending`, `deactivated`, `withStats`) |
| `GET` | `/api/users/me` | Any | Get current user's profile |
| `PATCH` | `/api/users/me` | Any | Change own password (`action: "change_password"`) |
| `PATCH` | `/api/users/:userId/approve` | HEAD_ROLES / APPROVAL_ROLES | Approve, reject, deactivate, reactivate, reset_password, toggle CDR access |
| `DELETE` | `/api/users/:userId` | HEAD_ROLES | Permanently delete user |

### Cases

| Method | Route | Roles | Description |
|---|---|---|---|
| `GET` | `/api/cases` | Any | List cases (officers see own + assigned; admins see all) |
| `POST` | `/api/cases` | Any | Create new case |
| `GET` | `/api/cases/:id` | Case member / Admin | Get full case detail + correlated cases |
| `PATCH` | `/api/cases/:id` | Case owner / Admin | Update status, closure reason |
| `GET` | `/api/cases/:id/assignments` | Case member / Admin | List case assignments |
| `POST` | `/api/cases/:id/assignments` | Case owner / Admin | Invite officer to case |
| `PATCH` | `/api/cases/:id/assignments` | Invited officer | Accept or decline invitation |
| `DELETE` | `/api/cases/:id/assignments` | Case owner / Admin | Remove officer from case |
| `GET` | `/api/cases/:id/viewers` | Case member / Admin | Get live viewers list |
| `DELETE` | `/api/cases/:id/viewers` | Case member | Remove self from viewer list |
| `POST` | `/api/cases/:id/entries` | Case member / Admin | Add journal entry |

### Journal Entries

| Method | Route | Roles | Description |
|---|---|---|---|
| `GET` | `/api/entries` | Any | List entries on user's cases |
| `PATCH` | `/api/entries/:entryId` | Entry author / Admin | Update entry content |
| `DELETE` | `/api/entries/:entryId` | Entry author / Admin | Delete entry |

### CDR Requests

| Method | Route | Roles | Description |
|---|---|---|---|
| `GET` | `/api/cdr` | CDR-access users / Admin | List CDR requests (officers see own; admins see all) |
| `POST` | `/api/cdr` | CDR-access users | Create CDR request |
| `PATCH` | `/api/cdr/:cdrId` | Request owner / Admin | Update status, received date, attachment |
| `DELETE` | `/api/cdr/:cdrId` | Request owner / Admin | Delete CDR request |

### International Requests (24/7 Network)

| Method | Route | Roles | Description |
|---|---|---|---|
| `GET` | `/api/international` | Any | List requests (officers see own; admins see all) |
| `POST` | `/api/international` | Any | Create international request |
| `PATCH` | `/api/international/:reqId` | Request owner / Admin | Update status, response date, attachment |
| `DELETE` | `/api/international/:reqId` | Request owner / Admin | Delete request |

### Notifications

| Method | Route | Roles | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Any | Get unread notifications for the current user |
| `PATCH` | `/api/notifications` | Any | Mark notifications as read (by ID or all) |

### Reports

| Method | Route | Roles | Description |
|---|---|---|---|
| `GET` | `/api/reports/activity` | Any | List activity reports |
| `POST` | `/api/reports/activity` | Any | Submit weekly activity report |
| `GET` | `/api/reports/data` | ADMIN_ROLES | Generate team or case report data |

### File Upload

| Method | Route | Roles | Description |
|---|---|---|---|
| `POST` | `/api/upload` | Any | Upload attachment (returns file path and name) |

---

### Role constants used in route guards

```javascript
// Can view all cases across all officers
ADMIN_ROLES = ["HEAD_OF_UNIT", "SUPERVISOR", "ADMIN"]

// Can manage users: deactivate, reset password, toggle CDR, delete
HEAD_ROLES  = ["HEAD_OF_UNIT", "ADMIN"]

// Can approve / reject pending registrations
APPROVAL_ROLES = ["HEAD_OF_UNIT", "OFFICE_ADMINISTRATOR", "ADMIN"]
```
