require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
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
app.get("/doc", (req, res) => res.redirect(302, "/swagger"));
app.get("/docs", (req, res) => res.redirect(302, "/swagger"));
app.get("/api-docs", (req, res) => res.redirect(302, "/swagger"));
app.get("/api-docs/", (req, res) => res.redirect(302, "/swagger"));

const PORT = process.env.PORT || 3000;

app.use(
  "/swagger",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: "list",
    },
  })
);

app.get("/", (req, res) => {
  const baseUrl = `http://localhost:${PORT}`;
  res.json({
    message: "Welcome to JobFinder API.",
    swagger: `${baseUrl}/swagger`,
    endpoints: {
      auth: "/api/auth/register, /api/auth/login",
      users: "/api/users/profile",
      jobs: "/api/jobs",
      applications: "/api/applications",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

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
