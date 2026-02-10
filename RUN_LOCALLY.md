# Run Frontend and Backend Locally

## Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (for backend). Either:
  - Install [PostgreSQL](https://www.postgresql.org/download/windows/) locally (default port 5432), or
  - Use Docker: from project root run `docker-compose up -d postgres` (DB will be on **port 5434**).

## 1. Backend (port 4000)

```powershell
cd backend
npm install --ignore-scripts   # (skip sqlite3 native build on Windows if needed)
# If using Docker Postgres (port 5434):
$env:DB_HOST="localhost"; $env:DB_PORT="5434"
npm run seed                   # Seed DB (run once)
npm run dev                    # Start API → http://localhost:4000
```

If PostgreSQL is installed locally on 5432, omit the `$env:DB_*` lines.

## 2. Frontend (port 3000)

```powershell
cd frontend
npm install
npm start                      # → http://localhost:3000 (or next free port)
```

Frontend proxies API requests to `http://localhost:4000` (see `proxy` in `frontend/package.json`).

## Quick reference

| Service   | URL                    | Port |
|----------|------------------------|------|
| Frontend | http://localhost:3000  | 3000 |
| Backend  | http://localhost:4000  | 4000 |
| Postgres | localhost              | 5432 (local) or 5434 (Docker) |

## Run everything with Docker

From project root:

```powershell
docker-compose up --build
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:4000  
- PostgreSQL runs inside the stack.
