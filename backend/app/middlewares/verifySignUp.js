const User = require("../repositories/user.repository");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const userByUsername = await User.findByUsername(req.body.username);
    if (userByUsername) {
      return res.status(400).json({ message: "Username is already in use!" });
    }

    const userByEmail = await User.findByEmail(req.body.email);
    if (userByEmail) {
      return res.status(400).json({ message: "Email is already in use!" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const checkRoleExisted = (req, res, next) => {
  const validRoles = ["job_seeker", "employer", "admin", "premium_user", "moderator"];
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
