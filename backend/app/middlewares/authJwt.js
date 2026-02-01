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

const isJobSeeker = (req, res, next) => {
  if (req.user.role !== "job_seeker" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Require Job Seeker or Admin role!" });
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Require Admin role!" });
  }
  next();
};

module.exports = {
  verifyToken,
  isEmployer,
  isJobSeeker,
  isAdmin,
};
