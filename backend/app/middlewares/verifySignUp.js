const db = require("../models");
const User = db.User;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findOne({ username: req.body.username });
    if (userByUsername) {
      return res.status(400).json({ message: "Username is already in use!" });
    }

    const userByEmail = await User.findOne({ email: req.body.email });
    if (userByEmail) {
      return res.status(400).json({ message: "Email is already in use!" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkRoleExisted = (req, res, next) => {
  const validRoles = ["job_seeker", "employer", "admin"];
  if (req.body.role && !validRoles.includes(req.body.role)) {
    return res.status(400).json({
      message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
    });
  }
  next();
};

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkRoleExisted,
};
