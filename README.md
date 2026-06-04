# Ethara AI OMS

Inventory and order management system with product, customer, order, and dashboard workflows. The app includes a FastAPI backend, PostgreSQL persistence, and a modern React frontend with optimistic UI updates.

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)

## Setup

Backend environment:

```bash
cd backend
cp .env.example .env
```

Frontend environment:

```bash
cd frontend
cp .env.example .env
```

For local frontend-to-backend calls, set:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Run Locally

One-command local startup on Windows:

```powershell
.\start-dev.ps1
```

This opens backend and frontend in separate PowerShell terminals.

Backend:

```bash
cd backend
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```txt
Frontend: http://localhost:5173
Backend docs: http://localhost:8000/docs
```

## Run With Docker

```bash
cp .env.example .env
docker compose up --build
```

Open:

```txt
Frontend: http://localhost:5173
Backend: http://localhost:8000
```

## Reach Out

For questions, contact: [chandradeepp611@gmail.com](mailto:chandradeepp611@gmail.com)
