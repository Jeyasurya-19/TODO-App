# Todo App — Deployment Guide

This project has:
- Frontend: HTML/CSS/JavaScript
- Backend: Flask REST API
- Database: MySQL-compatible TiDB Cloud

## Production architecture

Browser → Vercel Static Frontend → Render Flask API → TiDB Cloud

## Backend on Render

Root Directory: `backend`
Runtime: Python 3
Build Command: `pip install -r requirements.txt`
Start Command: `gunicorn app:app`

Environment variables:
- `DB_HOST` = TiDB host
- `DB_PORT` = `4000` (or the port shown by TiDB Connect)
- `DB_USER` = TiDB username
- `DB_PASSWORD` = TiDB password
- `DB_NAME` = `todoapp`
- `DB_SSL` = `true`
- `FRONTEND_URL` = your Vercel frontend URL

Run `backend/schema.sql` once in TiDB Cloud SQL Editor.

## Frontend on Vercel

Root Directory: `frontend`
Framework Preset: Other
Build Command: leave empty
Output Directory: `.`
Deploy the static files.

After the Render backend is live, edit `frontend/config.js`:

`window.APP_CONFIG.API_URL = "https://YOUR-BACKEND.onrender.com";`

Commit and push the change. Vercel will redeploy.

## Important

Do not put TiDB credentials in frontend files. Keep all database credentials in Render environment variables.
