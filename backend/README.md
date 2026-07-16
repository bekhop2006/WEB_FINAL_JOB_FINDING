# JobFinder API (Backend)

A Job Finding API built with Node.js, Express, Supabase (PostgreSQL), JWT authentication, and RBAC.

## Features

- **Authentication**: Register and login with JWT, bcrypt password hashing
- **RBAC**: job_seeker, employer, admin, premium_user, moderator
- **Job Listings**: Create, read, update, delete jobs (employer; moderator can delete any)
- **Job Search**: Filter by title, location, company, category, jobType
- **Applications**: Job seekers/premium users apply; employers/moderators manage status
- **User Profiles**: View and update profile
- **Validation**: Joi for email, password, title, etc.
- **Email**: Nodemailer (SendGrid/Mailgun/Postmark) — welcome email, application status

## Prerequisites

- Node.js 18+
- Free [Supabase](https://supabase.com) project (PostgreSQL)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, SMTP_* (optional)
```

### Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run [`app/db/schema.sql`](app/db/schema.sql)
3. Copy the connection URI from **Project Settings → Database**
4. Put it in `.env` as `DATABASE_URL`

## Run

```bash
npm start
```

Server runs at `http://localhost:3000`

## Swagger UI

**http://localhost:3000/swagger/** or **http://localhost:3000/api-docs/**

1. Login via POST /api/auth/login to get JWT
2. Click **Authorize**, paste `accessToken`
3. Test protected endpoints

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No | Default 3000 |
| DATABASE_URL | Yes | Supabase PostgreSQL connection URI |
| DATABASE_SSL | No | Set `false` only for local Postgres without SSL |
| JWT_SECRET | Yes | Secret for JWT signing |
| JWT_EXPIRES_IN | No | Default 24h |
| CORS_ORIGIN | No | Default * |
| SMTP_HOST | No | For email (SendGrid: smtp.sendgrid.net) |
| SMTP_USER | No | SMTP username |
| SMTP_PASS | No | SMTP password |

## Tech Stack

- Node.js, Express
- Supabase PostgreSQL (`pg`)
- JWT (jsonwebtoken), bcryptjs
- Joi (validation)
- Nodemailer (email)
- swagger-jsdoc, cors, dotenv
