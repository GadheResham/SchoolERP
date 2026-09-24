# Deployment Documentation

This folder contains deployment guides for all environments.

## Contents

| File | Description |
|---|---|
| `vercel.md` | Deploy frontend to Vercel |
| `render.md` | Deploy backend to Render |
| `docker.md` | Containerise with Docker |
| `mongodb-atlas.md` | Set up MongoDB Atlas cluster |

## Quick Reference

### Frontend → Vercel
1. Push `frontend/` to GitHub.
2. Import repository in Vercel dashboard.
3. Set root directory to `frontend`.
4. Set `VITE_API_URL` environment variable to your backend URL.
5. Deploy.

### Backend → Render
1. Push `backend/` to GitHub.
2. Create a new Web Service in Render.
3. Set root directory to `backend`.
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add all environment variables from `backend/.env.example`.
7. Deploy.

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas).
2. Create a database user with read/write access.
3. Whitelist your backend server IP (or `0.0.0.0/0` for dynamic IPs).
4. Copy the connection string into `MONGODB_URI`.

## Environment Checklist

Before deploying to production, verify:
- [ ] `NODE_ENV=production` is set on the backend.
- [ ] `JWT_SECRET` is at least 32 characters.
- [ ] `MONGODB_URI` points to the production Atlas cluster.
- [ ] `CLIENT_URL` on the backend matches the production frontend URL.
- [ ] `VITE_API_URL` on the frontend matches the production backend URL.
- [ ] `.env` files are never committed to the repository.
