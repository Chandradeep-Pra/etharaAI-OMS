# Docker Setup

## Files Provided

- `backend/Dockerfile`: Python 3.12 slim backend image running FastAPI with Uvicorn.
- `frontend/Dockerfile`: multi-stage Node build and Nginx static runtime image.
- `backend/.dockerignore`: excludes local Python, env, cache, and development artifacts.
- `frontend/.dockerignore`: excludes `node_modules`, `dist`, env files, and local artifacts.
- `.env.example`: root Compose environment template.
- `backend/.env.example`: backend-only environment template.
- `frontend/.env.example`: frontend-only environment template.
- `docker-compose.yml`: runs frontend, backend, and PostgreSQL.

## Configure Environment

Copy the root example file:

```bash
cp .env.example .env
```

Set a real password in `.env`:

```bash
POSTGRES_DB=inventory_db
POSTGRES_USER=inventory_user
POSTGRES_PASSWORD=replace_with_a_strong_password
BACKEND_PORT=8000
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:8000
LOW_STOCK_THRESHOLD=10
```

Credentials are read from `.env` by Docker Compose and are not hardcoded in `docker-compose.yml`.

## Run

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- OpenAPI docs: `http://localhost:8000/docs`

## Data Persistence

PostgreSQL uses a named volume:

```yaml
volumes:
  postgres_data:
```

This keeps database data across container restarts.

## Reset Local Docker Data

This removes the database volume and all stored local data:

```bash
docker compose down -v
```

