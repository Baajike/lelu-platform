> **Keep this file secure. Do not share it or store it online.**
---

## Server

| Detail | Value |
|---|---|
| Local IP | `192.168.31.146` |
| URL | <http://192.168.31.146> |
| OS | Ubuntu 24.04.4 LTS |
| Hostname | leluserver |
| SSH User | `lelu` |
| SSH Port | `22` |

---

## NEXTAUTH_SECRET

```
icz0WhtQFWILocX+mz7/b1PDcwuINZZHe7q1UGyVCTU=
```

> Store this somewhere safe. If lost, all active sessions will be invalidated and you'll need to update the `.env` file and restart the app.

---

## Database

| Detail   | Value            |
| -------- | ---------------- |
| Type     | PostgreSQL       |
| Database | `lelu_db`        |
| User     | `lelu_user`      |
| Host     | `localhost:5432` |
| Password | admin@lelu       |

---

## Default Login Credentials

> **Change all passwords on first login.**

| Email                    | Role                 | Default Password |
| ------------------------ | -------------------- | ---------------- |
| `head@lelu.gov.gh`       | Head of Unit         | `lelu2026`       |
| `admin@lelu.gov.gh`      | Office Administrator | `lelu2026`       |
| `supervisor@lelu.gov.gh` | Supervisor           | `lelu2026`       |
| `asante@lelu.gov.gh`     | Officer              | `lelu2026`       |
| `boateng@lelu.gov.gh`    | Officer              | `lelu2026`       |
| `darko@lelu.gov.gh`      | Officer              | `lelu2026`       |

---

## Key File Locations

| File | Path |
|---|---|
| App directory | `/var/www/lelu/app` |
| Environment file | `/var/www/lelu/app/.env` |
| nginx config | `/etc/nginx/sites-available/lelu` |
| nginx access log | `/var/log/nginx/lelu-access.log` |
| nginx error log | `/var/log/nginx/lelu-error.log` |
| Database backups | `/var/backups/lelu/` |
| Backup log | `/var/log/lelu-backup.log` |
| Update log | `/var/log/lelu-update.log` |

---

## Useful Commands

```bash
# App
pm2 status                        # check app is running
pm2 logs lelu-platform            # view live logs
pm2 restart lelu-platform         # restart the app

# nginx
sudo nginx -t                     # test config
sudo systemctl reload nginx       # reload nginx

# Backups
ls /var/backups/lelu/             # list backups
sudo bash /usr/local/bin/backup-lelu-db.sh  # run manual backup

# Updates
sudo bash ~/lelu-platform/update.sh         # manual update from GitHub
```

---

## Backup Schedule

Daily at **2:00 AM** — stored in `/var/backups/lelu/` as `.sql.gz` files.
Backups older than **30 days** are deleted automatically.

---

## Notes

- Port `3000` is internal only — never expose it directly
- When a domain is assigned, update `NEXTAUTH_URL` in `/var/www/lelu/app/.env` and run Certbot
