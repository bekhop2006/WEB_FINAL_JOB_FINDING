const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const swaggerSpec = require("./app/config/swagger");
const db = require("./app/models");

const authRoutes = require("./app/routes/auth.routes");
const userRoutes = require("./app/routes/user.routes");
const jobRoutes = require("./app/routes/job.routes");
const applicationRoutes = require("./app/routes/application.routes");

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/swagger.json", (req, res) => res.json(swaggerSpec));

const PORT = process.env.PORT || 3000;

// Swagger UI - serve HTML that loads assets from CDN (avoids path/MIME issues)
const swaggerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JobFinder API</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: "/swagger.json",
        dom_id: "#swagger-ui",
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        docExpansion: "list"
      });
    };
  </script>
</body>
</html>
`;

app.get("/api-docs", (req, res) => res.type("html").send(swaggerHtml));
app.get("/api-docs/", (req, res) => res.type("html").send(swaggerHtml));

// Redirects for alternative URLs
app.get("/doc", (req, res) => res.redirect(302, "/api-docs"));
app.get("/docs", (req, res) => res.redirect(302, "/api-docs"));
app.get("/swagger", (req, res) => res.redirect(302, "/api-docs"));
app.get("/swagger/", (req, res) => res.redirect(302, "/api-docs"));

// Root — API info when no frontend build
app.get("/", (req, res, next) => {
  const frontendDist = path.join(__dirname, "../frontend/dist");
  if (require("fs").existsSync(frontendDist)) return next();
  const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  res.json({
    message: "Welcome to JobFinder API.",
    swagger: `${baseUrl}/api-docs`,
    endpoints: { auth: "/api/auth", jobs: "/api/jobs", applications: "/api/applications" },
  });
});

// Serve uploaded files (e.g. resumes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Frontend SPA (production) — after API routes
const frontendDist = path.join(__dirname, "../frontend/dist");
if (require("fs").existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("/*path", (req, res) => res.sendFile(path.join(frontendDist, "index.html")));
}

// 404 - pass to error handler
app.use((req, res, next) => {
  const err = new Error("Endpoint not found.");
  err.statusCode = 404;
  next(err);
});

// Global error handler (must be last)
const errorHandler = require("./app/middlewares/errorHandler");
app.use(errorHandler);

db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit(1);
  });
