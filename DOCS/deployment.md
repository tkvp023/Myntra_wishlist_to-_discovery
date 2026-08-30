# 🚀 Production Deployment Guide (Railway + Vercel)

This document provides exact, step-by-step instructions for deploying the **Backend API to Railway** and the **Frontend Web App to Vercel**.

---

## 1. Backend Deployment (Railway)

### Step 1: Create a Railway Project
1. Log in to [railway.app](https://railway.app).
2. Click **+ New Project** → **Deploy from GitHub repo**.
3. Select your repository (`Graduation_project_mvp`).
4. Set the **Root Directory** to `backend`.

### Step 2: Configure Environment Variables
In the Railway Service Settings under **Variables**, set:
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```
*(If using PostgreSQL instead of SQLite, add a PostgreSQL database service in Railway and link `DATABASE_URL=${{Postgres.DATABASE_URL}}`)*

### Step 3: Automatic Build & Seed
Railway automatically detects `backend/railway.json`:
```bash
npx prisma generate && npx prisma db push && node prisma/seed.js && node src/index.js
```
This automatically runs database migrations, seeds the 33 products & 172 verified reviews, binds to `0.0.0.0`, and launches the server.

### Step 4: Copy Backend URL
Under Railway Settings → **Domains**, generate a public domain (e.g., `https://myntra-backend-production.up.railway.app`).

---

## 2. Frontend Deployment (Vercel)

### Step 1: Import to Vercel
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** → **Project** → Select your GitHub repository.
3. In the project setup screen, configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 2: Set Environment Variables
In the Vercel **Environment Variables** section, add:
```env
VITE_API_URL=https://myntra-backend-production.up.railway.app
```
*(Replace with your actual Railway backend URL)*

### Step 3: Deploy & Verify
1. Click **Deploy**.
2. Vercel will build the frontend using `frontend/vercel.json` for SPA rewrites.
3. Once live, open your Vercel URL (e.g., `https://myntra-mvp.vercel.app`):
   - ✅ Interactive 7-Step Walkthrough Mode works on all screens
   - ✅ Real-time badge filtering and photo/video upload modal work
   - ✅ Cart, Wishlist, and Profile Order reviews connect directly to Railway API

---

## 3. Local Development

```bash
# Terminal 1: Backend (http://localhost:3001)
cd backend
npm install
npm test
npm run dev

# Terminal 2: Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```
