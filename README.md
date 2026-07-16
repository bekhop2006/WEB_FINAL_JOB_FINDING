# JobFinder

Job Finding Platform — Backend API and Frontend.

## Project Overview

JobFinder is a full-stack web application for job seekers and employers. Job seekers can browse jobs, apply to positions, and track application status. Employers can post jobs, manage applications, and update statuses. Supports role-based access control (RBAC) and email notifications.

### Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Register and login with JWT, bcrypt password hashing |
| **RBAC** | Roles: job_seeker, employer, admin, premium_user, moderator. Different access levels per role |
| **Job Listings** | Create, read, update, delete jobs. Filter by title, location, company, category |
| **Applications** | Job seekers/premium users apply; employers/moderators manage status |
| **User Profiles** | View and update profile (fullName, phone, resume, etc.) |
| **Email** | Welcome email on registration; status change notifications (SendGrid/Mailgun/Postmark) |
| **Validation** | Joi validation for all input (email, password, title, etc.) |
| **Error Handling** | Global error middleware with 400, 401, 404, 500 responses |

### Screenshots

> Add screenshots of your app features here before submission.
> Suggested: Login, Register, Job list, Job detail, Create job, My applications, Profile.

## Project Structure

```
WEB_FINAL_JOB_FINDING/
├── backend/     # Node.js, Express, Supabase (PostgreSQL) API
├── frontend/    # React application (Vite)
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd WEB_FINAL_JOB_FINDING
   ```

2. **Install dependencies:**
   ```bash
   npm install
   npm run install:all   # installs backend + frontend deps
   ```

3. **Create a free Supabase project** and run the SQL schema:
   - Open Supabase → **SQL Editor**
   - Paste and run [`backend/app/db/schema.sql`](backend/app/db/schema.sql)
   - Copy **Database → Connection string (URI)**

4. **Configure environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env: DATABASE_URL, JWT_SECRET, SMTP_* (optional for email)
   ```

5. **Запуск проекта:**
   ```bash
   npm start     # одна команда — backend + frontend
   ```
   Или: `npm run dev` (то же самое).

- Frontend: http://localhost:8080
- API: http://localhost:3000
- Swagger UI: http://localhost:3000/swagger/

## API Documentation

Full interactive docs: **http://localhost:3000/swagger/** (or `/api-docs`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/auth/register | POST | Register new user |
| /api/auth/login | POST | Login, returns JWT |
| /api/users/profile | GET, PUT | Get/update current user profile |
| /api/jobs | GET, POST | List jobs (filters), create job |
| /api/jobs/my | GET | My posted jobs (employer) |
| /api/jobs/:id | GET, PUT, DELETE | Job by ID |
| /api/applications | GET, POST | List/create applications |
| /api/applications/:id | GET, DELETE | Get/withdraw application |
| /api/applications/:id/status | PUT | Update status (employer/moderator) |

## Deployment (Render) — backend API

1. **New** → **Web Service**, подключите репозиторий.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `node server.js`
5. **Environment:** `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (можно `*` или URL)
6. Deploy

Frontend запускается отдельно (`cd frontend && npm run dev` или Static Site с `VITE_API_URL`).

### Railway

1. New Project → Deploy from GitHub
2. Set root to `backend/`
3. Add variables: `DATABASE_URL`, `JWT_SECRET`, etc.
4. Railway auto-detects Node.js

### Deployed URL

**Live app:** [https://web-final-job-finding.onrender.com/](https://web-final-job-finding.onrender.com/)

## Separate Run

**Backend only:**
```bash
cd backend && npm install && npm start
```

**Frontend only:**
```bash
cd frontend && npm install && npm run dev
```