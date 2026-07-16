# Final Project Draft: Job Finding Application

---

## 1. Project Proposal

### Project Title
**JobFinder API** — A Job Finding Platform

### Topic
This project is a **Job Finding API** built using Node.js, Express, and Supabase (PostgreSQL). It allows users (job seekers and employers) to register, log in, and manage job listings and applications securely using JWT authentication. The app supports role-based access control (job seeker, employer, admin) and enables employers to post jobs while job seekers can browse, search, and apply for positions.

### Why Did You Choose It?
- **Real-world relevance**: Job finding platforms are widely used and solve a practical problem.
- **Full-stack learning**: Covers authentication, CRUD operations, relationships between entities, and role-based access.
- **Scalable scope**: Can start simple and add features like search, filters, and notifications.
- **Industry standard**: Uses technologies (Node.js, Express, PostgreSQL/Supabase, JWT) commonly used in production applications.

### Main Features
- **User Registration & Login** — Secure authentication with JWT
- **Role-Based Access Control** — Different permissions for job seeker, employer, and admin
- **Job Listings** — Employers can create, update, and delete job postings
- **Job Search & Filtering** — Browse jobs by title, location, company, or category
- **Job Applications** — Job seekers can apply to jobs; employers can view applications
- **User Profiles** — Users can view and update their profile (resume, skills, company info)
- **Application Status Tracking** — Track application status (pending, reviewed, accepted, rejected)

### Team Members and Responsibilities
| Member | Responsibility |
|--------|----------------|
| [Name 1] | Backend API development, database design, authentication |
| [Name 2] | Routes, controllers, middleware, testing |
| [Name 3] | Frontend integration (if applicable), documentation |

*Update with actual team member names and roles.*

---

## 2. Database Design (Schemas)

### User Collection
| Field | Type | Description |
|-------|------|-------------|
| username | string | Unique, required |
| email | string | Unique, required |
| password | string | Hashed, min 6 chars |
| role | string | `job_seeker` / `employer` / `admin` |
| fullName | string | Optional |
| phone | string | Optional |
| resume | string | URL or path (for job seekers) |
| companyName | string | Optional (for employers) |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |

### Job Collection
| Field | Type | Description |
|-------|------|-------------|
| title | string | Job title |
| description | string | Job description |
| company | string | Company name |
| location | string | Job location |
| salary | string | Salary range (e.g., "$50k–$70k") |
| jobType | string | `full_time` / `part_time` / `contract` / `internship` |
| category | string | e.g., "Software", "Marketing" |
| requirements | [string] | Array of requirements |
| employer | ObjectId | Reference to User |
| status | string | `active` / `closed` |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |

### Application Collection
| Field | Type | Description |
|-------|------|-------------|
| job | ObjectId | Reference to Job |
| applicant | ObjectId | Reference to User |
| coverLetter | string | Optional cover letter |
| status | string | `pending` / `reviewed` / `accepted` / `rejected` |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |

### Role Collection (Optional — for RBAC)
| Field | Type | Description |
|-------|------|-------------|
| name | string | `job_seeker` / `employer` / `admin` |

---

## 3. API Endpoint List

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get current user profile (protected) |
| PUT | `/api/users/profile` | Update current user profile (protected) |
| GET | `/api/users/:id` | Get user by ID (admin or self) |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create job (employer/admin) |
| GET | `/api/jobs` | List all jobs (with optional filters) |
| GET | `/api/jobs/:id` | Get job by ID |
| PUT | `/api/jobs/:id` | Update job (owner/admin) |
| DELETE | `/api/jobs/:id` | Delete job (owner/admin) |
| GET | `/api/jobs/my` | Get jobs posted by current user (employer) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply to a job (job seeker) |
| GET | `/api/applications` | List applications (filtered by role) |
| GET | `/api/applications/:id` | Get application by ID |
| PUT | `/api/applications/:id/status` | Update application status (employer) |
| DELETE | `/api/applications/:id` | Withdraw application (applicant) |

---

## 4. Folder Structure

Based on [Express Generator](https://expressjs.com/en/starter/generator.html) and [Node.js Express MongoDB JWT Auth](https://www.corbado.com/blog/nodejs-express-mongodb-jwt-authentication-roles):

```
job-finder-api/
├── app/
│   ├── config/
│   │   ├── auth.config.js      # JWT secret, token options
│   │   └── db.config.js        # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── job.controller.js
│   │   └── application.controller.js
│   ├── middlewares/
│   │   ├── authJwt.js          # JWT verification, role checks
│   │   ├── verifySignUp.js     # Duplicate username/email check
│   │   └── index.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── job.model.js
│   │   ├── application.model.js
│   │   ├── role.model.js       # Optional
│   │   └── index.js
│   └── routes/
│       ├── auth.routes.js
│       ├── user.routes.js
│       ├── job.routes.js
│       └── application.routes.js
├── bin/
│   └── www                    # Server entry (optional)
├── public/                    # Static files (if needed)
├── package.json
├── server.js                  # Main app entry
├── .env                       # Environment variables
├── .gitignore
└── README.md
```

### Alternative: Express Generator Base

If using `npx express-generator --no-view`:

```
job-finder-api/
├── app.js
├── bin/
│   └── www
├── config/                    # Add: auth, db config
├── controllers/               # Add: auth, user, job, application
├── middlewares/               # Add: authJwt, verifySignUp
├── models/                    # Add: user, job, application, role
├── routes/
│   ├── index.js
│   ├── auth.js
│   ├── users.js
│   ├── jobs.js
│   └── applications.js
├── public/
├── package.json
└── README.md
```

---

## 5. Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| ODM | Mongoose |
| Auth | JWT (jsonwebtoken) |
| Password | bcryptjs |
| CORS | cors |

---

## 6. Quick Start Commands

```bash
# Create project
npx express-generator --no-view job-finder-api
cd job-finder-api

# Install dependencies
npm install pg bcryptjs jsonwebtoken cors dotenv

# Run (ensure DATABASE_URL points to Supabase and schema.sql is applied)
npm start
```

---

*Document Version: 1.0 | Last Updated: February 2025*
