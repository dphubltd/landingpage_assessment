# Landing Page Assessment

Full-stack landing page asset collection form with admin dashboard.

## Quick Start

```bash
# Install all dependencies (root, backend, frontend)
npm install

# Start both backend and frontend concurrently
npm run dev
```

The root `package.json` handles the monorepo — `postinstall` auto-installs backend deps, and `npm run dev` (if configured) or running each separately.

---

## Start Backend Only

```bash
cd backend
cp .env.example .env    # fill in credentials
npm install
npm start               # or: npm run dev (with --watch)
```

Backend runs on `http://localhost:8000`.

## Start Frontend Only

```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev:frontend               # or: npm run build && npm start
```

Frontend runs on `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `ADMIN_PASSWORD` | Dashboard login password |
| `TURSO_DATABASE_URL` | Turso (libSQL) database URL |
| `TURSO_AUTH_TOKEN` | Turso auth token |
| `WASABI_*` | Wasabi S3 credentials |
| `SMTP_*` | Email (Gmail SMTP) credentials |
| `RECEIVER_EMAIL` | Where submission emails go |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `http://localhost:8000`) |

---

## Deployment

| Platform | Service | Build Command | Start Command |
|----------|---------|---------------|---------------|
| **Render** | Backend | `npm install && npm run build` | `npm start` |
| **Vercel** | Frontend | `npm run build` (auto) | `npm start` (auto) |

Set all environment variables in the respective dashboards.
