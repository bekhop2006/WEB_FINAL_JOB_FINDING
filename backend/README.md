# JobFinder API (Backend)

A Job Finding API built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- **Authentication**: Register and login with JWT
- **Role-Based Access**: job_seeker, employer, admin
- **Job Listings**: Create, read, update, delete jobs
- **Job Search**: Filter by title, location, company, category, jobType
- **Applications**: Job seekers apply; employers manage applications
- **User Profiles**: View and update profile

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings (optional)
```

## Run

```bash
cd backend
npm start
```

Server runs at `http://localhost:3000`

## Swagger UI

Interactive API documentation: **http://localhost:3000/swagger/**

1. Open Swagger UI in browser
2. Use **Auth** → **POST /api/auth/login** to get JWT token
3. Click **Authorize** (top right), paste the `accessToken`, click Authorize
4. All protected endpoints will now include the token automatically

**Если Swagger не открывается:**
- Остановите все процессы Node: `pkill -f "node server"` или закройте терминал
- Запустите заново: `cd backend && npm start`
- Откройте: http://localhost:3000/swagger/

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- cors, dotenv
- swagger-ui-express
