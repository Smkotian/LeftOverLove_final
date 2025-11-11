# LeftOverLove (MERN)

A platform where Donors post surplus food and NGOs accept and track donations.

## Tech
- Frontend: React + Vite, React Router, Axios
- Backend: Node, Express, JWT, bcryptjs
- Database: MongoDB (Mongoose)

## Quick start

1. Create `backend/.env` from `backend/.env.example` and set `MONGO_URI` and `JWT_SECRET`.
2. Install deps for both apps:

```powershell
npm run install:all
```

3. Start both servers in dev:

```powershell
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## API Summary
- POST /api/auth/register – { name, email, password, role: donor|ngo, contact }
- POST /api/auth/login – { email, password }
- POST /api/donations/new – donor only
- GET /api/donations – pending donations, NGO view
- GET /api/donations/my – donor's donations
- PUT /api/donations/:id – accept/update
- PUT /api/donations/:id/status – update status
- GET /api/donations/status/:userId – status list for a user

## UI routes
- /login, /signup
- /donor-dashboard (donor)
- /ngo-feed (ngo)
- /tracking (both)

## Team division
See `TaskTracker.md` for who does what.
