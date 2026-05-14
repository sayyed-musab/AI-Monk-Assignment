# AIMonk Tags Tree

A full stack nested tags tree app built with React + FastAPI + Vercel Postgres.

## Project Structure

ai_monk_assignment/<br>
├── frontend/ # React + Vite + Tailwind <br>
└── backend/ # FastAPI + Vercel Postgres

## Local Development

### Backend

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

POSTGRES_URL=your_vercel_postgres_url <br>
FRONTEND_URL=http://localhost:5173

### Frontend (`frontend/.env.local`)

VITE_API_URL=http://localhost:8000

## Deployment

Both frontend and backend are deployed separately on Vercel.
