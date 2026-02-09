const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;

const verifyToken = async (req, res, next) => {
  let token =
    req.headers["x-access-token"] ||
    (req.headers["authorization"] && req.headers["authorization"].replace(/^Bearer\s+/i, "").trim());

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

const isEmployer = (req, res, next) => {
  if (req.user.role !== "employer" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Require Employer or Admin role!" });
  }
  next();
};

/**
 * Employer can manage own jobs; Moderator can delete any job (moderation).
 */
const isEmployerOrModerator = (req, res, next) => {
  const allowed = ["employer", "admin", "moderator"];
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ message: "Require Employer, Moderator, or Admin role!" });
  }
  next();
};

const isJobSeeker = (req, res, next) => {
  if (!["job_seeker", "premium_user", "admin"].includes(req.user.role)) {
    return res.status(403).json({ message: "Require Job Seeker, Premium User, or Admin role!" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Require Admin role!" });
  }
  next();
};

/**
 * Moderator: can delete jobs (moderation), manage application status.
 * premium_user: treated like job_seeker for applications.
 */
const isModerator = (req, res, next) => {
  if (req.user.role !== "moderator" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Require Moderator or Admin role!" });
  }
  next();
};

module.exports = {
  verifyToken,
  isEmployer,
  isEmployerOrModerator,
  isJobSeeker,
  isAdmin,
  isModerator,
};
