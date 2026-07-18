const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "JobFinder API",
      version: "1.0.0",
      description: "Job Finding API with JWT Authentication. Use **Authorize** to add Bearer token after login.",
    },
    servers: [
      {
        url:
          process.env.PUBLIC_URL ||
          process.env.RENDER_EXTERNAL_URL ||
          `http://localhost:${process.env.PORT || 3000}`,
        description: "API server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token from /api/auth/login",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            role: { type: "string", enum: ["job_seeker", "employer", "admin"] },
            fullName: { type: "string" },
            phone: { type: "string" },
            resume: { type: "string" },
            companyName: { type: "string" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string", minLength: 6 },
            role: { type: "string", enum: ["job_seeker", "employer", "admin"] },
            fullName: { type: "string" },
            phone: { type: "string" },
            companyName: { type: "string" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            role: { type: "string" },
            fullName: { type: "string" },
            accessToken: { type: "string", description: "Use in Authorization header" },
          },
        },
        Job: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            company: { type: "string" },
            location: { type: "string" },
            salary: { type: "string" },
            jobType: { type: "string", enum: ["full_time", "part_time", "contract", "internship"] },
            category: { type: "string" },
            requirements: { type: "array", items: { type: "string" } },
            status: { type: "string", enum: ["active", "closed"] },
          },
        },
        ApplicationRequest: {
          type: "object",
          required: ["jobId"],
          properties: {
            jobId: { type: "string" },
            coverLetter: { type: "string" },
          },
        },
        ApplicationStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: { type: "string", enum: ["pending", "reviewed", "accepted", "rejected"] },
          },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Registration and login" },
      { name: "Users", description: "User profile" },
      { name: "Jobs", description: "Job listings" },
      { name: "Applications", description: "Job applications" },
    ],
    paths: {
      "/api/auth/register": {
        post: {
          tags: ["Auth"],
          summary: "Register new user",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterRequest" },
              },
            },
          },
          responses: {
            201: { description: "User registered successfully" },
            400: { description: "Username or email already in use" },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login - returns JWT token",
          description: "Copy accessToken and use in Authorize button above",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LoginResponse" },
                },
              },
            },
            401: { description: "Invalid password" },
            404: { description: "User not found" },
          },
        },
      },
      "/api/users/profile": {
        get: {
          tags: ["Users"],
          summary: "Get current user profile",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "User profile" }, 401: { description: "Unauthorized" } },
        },
        put: {
          tags: ["Users"],
          summary: "Update current user profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    fullName: { type: "string" },
                    phone: { type: "string" },
                    resume: { type: "string" },
                    companyName: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 200: { description: "Profile updated" }, 401: { description: "Unauthorized" } },
        },
      },
      "/api/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "User" }, 403: { description: "Access denied" } },
        },
      },
      "/api/jobs": {
        get: {
          tags: ["Jobs"],
          summary: "List all jobs (with filters)",
          parameters: [
            { name: "title", in: "query", schema: { type: "string" } },
            { name: "location", in: "query", schema: { type: "string" } },
            { name: "company", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "jobType", in: "query", schema: { type: "string", enum: ["full_time", "part_time", "contract", "internship"] } },
            { name: "status", in: "query", schema: { type: "string", enum: ["active", "closed"] } },
          ],
          responses: { 200: { description: "List of jobs" } },
        },
        post: {
          tags: ["Jobs"],
          summary: "Create job (employer only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["title", "description", "company", "location"],
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    company: { type: "string" },
                    location: { type: "string" },
                    salary: { type: "string" },
                    jobType: { type: "string", enum: ["full_time", "part_time", "contract", "internship"] },
                    category: { type: "string" },
                    requirements: { type: "array", items: { type: "string" } },
                    status: { type: "string", enum: ["active", "closed"] },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Job created" }, 403: { description: "Employer role required" } },
        },
      },
      "/api/jobs/my": {
        get: {
          tags: ["Jobs"],
          summary: "Get my posted jobs",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "List of my jobs" }, 403: { description: "Employer role required" } },
        },
      },
      "/api/jobs/{id}": {
        get: {
          tags: ["Jobs"],
          summary: "Get job by ID",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Job details" }, 404: { description: "Job not found" } },
        },
        put: {
          tags: ["Jobs"],
          summary: "Update job",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Job" },
              },
            },
          },
          responses: { 200: { description: "Job updated" }, 403: { description: "Not authorized" } },
        },
        delete: {
          tags: ["Jobs"],
          summary: "Delete job",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Job deleted" }, 403: { description: "Not authorized" } },
        },
      },
      "/api/applications": {
        get: {
          tags: ["Applications"],
          summary: "List applications",
          description: "Job seekers: own applications. Employers: applications to their jobs. Admin: all.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "status", in: "query", schema: { type: "string", enum: ["pending", "reviewed", "accepted", "rejected"] } },
          ],
          responses: { 200: { description: "List of applications" } },
        },
        post: {
          tags: ["Applications"],
          summary: "Apply to job (job seeker only)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApplicationRequest" },
              },
            },
          },
          responses: { 201: { description: "Application submitted" }, 403: { description: "Job seeker role required" } },
        },
      },
      "/api/applications/{id}": {
        get: {
          tags: ["Applications"],
          summary: "Get application by ID",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Application details" } },
        },
        delete: {
          tags: ["Applications"],
          summary: "Withdraw application",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          responses: { 200: { description: "Application withdrawn" } },
        },
      },
      "/api/applications/{id}/status": {
        put: {
          tags: ["Applications"],
          summary: "Update application status (employer only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApplicationStatusRequest" },
              },
            },
          },
          responses: { 200: { description: "Status updated" }, 403: { description: "Employer role required" } },
        },
      },
    },
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
