# PricePulse AI

MERN e‑commerce starter with an optional Python AI microservice for price optimization, recommendations, and sentiment analysis. Fast local dev via Vite + Express, production friendly on Vercel (client) and Render (API + AI).

## Table of Contents

- Overview
- Features
- Architecture
- Quick Start
- Environment Variables
- Running Locally
- Deployment
- OAuth (Google & GitHub)
- Project Structure
- Contributing & Roadmap

## Overview

PricePulse AI provides a modern scaffold to build a commerce app with:

- A Node/Express API with JWT auth and product/cart/order flows.
- A React+Vite client wired to the API via a dev proxy.
- A Python Flask AI service with endpoints for recommendations, pricing, and sentiment.

## Features

- Auth (register/login) with JWT and Passport strategies.
- Product CRUD with price recompute hooks and review endpoints.
- Cart, wishlist, checkout, order creation flow.
- AI service: recommendations, similar products, price prediction, sentiment.
- Clean UI with Redux Toolkit and responsive components.

## Architecture

- Client: [client](client) (React + Vite) → proxies `/api` to backend during dev.
- API: [server](server) (Express + MongoDB) → serves business logic on port 4000.
- AI: [ai-service](ai-service) (Flask) → optional microservice on port 5000.
- Infra: [render.yaml](render.yaml) → Render deployment configuration.

## Quick Start

```bash
# API (port 4000)
cd server
npm install
cp .env.example .env
npm run dev

# Client (port 5173)
cd ../client
npm install
npm run dev

# AI service (port 5000)
cd ../ai-service
python -m venv .venv && . .venv/Scripts/activate
pip install -r requirements.txt
python app.py
```

The client dev server proxies `/api` to `http://localhost:4000` (see [client/vite.config.js](client/vite.config.js)). Health checks: API [GET /api/health](server/app.js), AI [GET /health](ai-service/app.py).

## Environment Variables

Configure secrets via `.env` files. Templates should be committed; actual values should not.

- API ([server](server))

  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — JWT signing secret
  - `CLIENT_ORIGIN` — allowed origin(s), comma‑separated for local + Vercel
  - `AI_SERVICE_URL` — e.g. `http://localhost:5000` or deployed AI URL
  - `RAZORPAY_KEY_ID` — Razorpay API key (get from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys))
  - `RAZORPAY_KEY_SECRET` — Razorpay secret key
  - `PORT` — defaults to 4000
  - Optional OAuth/email keys as needed

- Client ([client](client))

  - `VITE_API_URL` — set on Vercel to your API base (e.g. `https://your-api/api`)

- AI Service ([ai-service](ai-service))
  - `AI_SERVICE_PORT` — defaults to 5000 for local
  - `BACKEND_URL` — optional, backend base URL if needed
  - `MODEL_PATH` — defaults to `trained_models`
  - `ENABLE_AUTO_TRAINING` — `true|false`
  - `LOG_LEVEL` — `INFO|DEBUG`

## Running Locally

1. Start MongoDB (local or Atlas). Set `MONGO_URI` accordingly.
2. Launch API: [server/app.js](server/app.js) via `npm run dev`.
3. Launch client: [client](client) via `npm run dev`.
4. (Optional) Launch AI: [ai-service/app.py](ai-service/app.py) via `python app.py`.

Common dev scripts:

- API: `npm run dev` (nodemon), `npm start` (production)
- Client: `npm run dev`, `npm run build`, `npm run preview`
- AI service: `gunicorn --bind 0.0.0.0:$PORT app:app` for production (Render)

## Deployment

### Quick Deploy

**See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete step-by-step deployment guide.**

The project is configured for deployment on:

- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **AI Service**: Render (Python + Flask)
- **Database**: MongoDB Atlas

### Prerequisites

Before deployment, you'll need:

1. MongoDB Atlas account and cluster setup
2. Render account (for backend and AI services)
3. Vercel account (for frontend)
4. Strong JWT secrets (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
5. Email account with app password
6. Optional: Razorpay, Google/GitHub OAuth credentials

### Deployment Files

The project includes deployment configuration files:

- [vercel.json](client/vercel.json) — Vercel configuration with SPA routing
- [render.yaml](render.yaml) — Render Blueprint for automated multi-service deployment
- [.env.example files](server/.env.example) — Environment variable templates

### Quick Start (Using Render Blueprint)

1. **Push to GitHub**: Ensure your code is in a GitHub repository

2. **Deploy via Render Blueprint**:

- Go to [Render Dashboard](https://dashboard.render.com)
- Click **New +** → **Blueprint**
- Connect your repository
- Render will detect `render.yaml` and create both services automatically
- Configure environment variables marked with `sync: false`

3. **Deploy Frontend to Vercel**:

- Import your repository to Vercel
- Set Root Directory: `client`
- Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
- Deploy

4. **Update Environment Variables**:

- In Render, update backend's `CLIENT_ORIGIN` with your Vercel URL
- Restart services if needed

### Manual Deployment

If you prefer manual deployment:

**Backend (Render)**:

```bash
# Service Configuration
Root Directory: server
Build Command: npm install
Start Command: npm start

# Environment Variables
PORT=4000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_here
CLIENT_ORIGIN=https://your-app.vercel.app
AI_SERVICE_URL=https://your-ai.onrender.com
# ... see DEPLOYMENT.md for complete list
```

**AI Service (Render)**:

```bash
# Service Configuration
Root Directory: ai-service
Build Command: pip install -r requirements.txt
Start Command: gunicorn --bind 0.0.0.0:$PORT app:app

# Environment Variables
BACKEND_URL=https://your-backend.onrender.com
MODEL_PATH=trained_models
FLASK_ENV=production
```

**Frontend (Vercel)**:

```bash
# Project Settings
Framework: Vite
Root Directory: client
Build Command: npm run build
Output Directory: dist

# Environment Variable
VITE_API_URL=https://your-backend.onrender.com/api
```

### Health Checks

After deployment, verify your services:

- Backend: `https://your-backend.onrender.com/api/health`
- AI Service: `https://your-ai.onrender.com/health`
- Frontend: `https://your-app.vercel.app`

### Post-Deployment

1. **Seed Database** (optional):

```bash
npm run seed              # Add sample products
npm run seed:admin        # Create admin user
npm run seed:superadmin   # Create super admin
```

2. **Configure OAuth Callbacks**:

- Update Google/GitHub redirect URIs to production URLs

3. **Test Payment Flow**:

- Verify Razorpay integration in test mode first

For detailed instructions, troubleshooting, and production checklist, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## OAuth (Google & GitHub)

Set provider credentials in the API `.env`:

```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
SERVER_BASE_URL=http://localhost:4000
CLIENT_ORIGIN=http://localhost:5173
```

Callbacks must point to your API:

- `http://localhost:4000/api/auth/google/callback`
- `http://localhost:4000/api/auth/github/callback`

## Project Structure

- Client app: [client/src](client/src), entry [client/src/main.jsx](client/src/main.jsx)
- API entry: [server/app.js](server/app.js), routes in [server/routes](server/routes)
- Models: [server/models](server/models)
- Services: [server/services](server/services), AI integration in [server/services/aiService.js](server/services/aiService.js)
- Python AI: [ai-service/models](ai-service/models), utilities [ai-service/utils](ai-service/utils)

## Contributing & Roadmap

- Contributing: open issues/PRs with clear descriptions; keep changes focused.
- Roadmap ideas:
  - Integrate real price feeds and stronger ML models.
  - **Payments**: Razorpay integration implemented for Credit Card, UPI, and Net Banking. Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in the API `.env` to enable. COD orders process directly; online payments redirect to Razorpay checkout and verify signatures before creating orders.
