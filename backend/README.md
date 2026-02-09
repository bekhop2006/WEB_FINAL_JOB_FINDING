# JobFinder API (Backend)

A Job Finding API built with Node.js, Express, MongoDB, JWT authentication, and RBAC.

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
- MongoDB (local or Atlas)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, SMTP_* (optional)
```

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
| MONGODB_URI | Yes* | MongoDB connection (*or DB_HOST+DB_PORT+DB_NAME) |
| JWT_SECRET | Yes | Secret for JWT signing |
| JWT_EXPIRES_IN | No | Default 24h |
| CORS_ORIGIN | No | Default * |
| SMTP_HOST | No | For email (SendGrid: smtp.sendgrid.net) |
| SMTP_USER | No | SMTP username |
| SMTP_PASS | No | SMTP password |

## Tech Stack

- Node.js, Express
- MongoDB, Mongoose
- JWT (jsonwebtoken), bcryptjs
- Joi (validation)
- Nodemailer (email)
- swagger-jsdoc, cors, dotenv
