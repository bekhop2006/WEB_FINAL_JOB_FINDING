const config = require("../config/auth.config");
const User = require("../repositories/user.repository");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailService = require("../services/email.service");

exports.signup = async (req, res, next) => {
  try {
    let resumePath = "";
    if (req.file && req.file.filename) {
      resumePath = "/uploads/resumes/" + req.file.filename;
    }

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role || "job_seeker",
      fullName: req.body.fullName,
      phone: req.body.phone,
      companyName: req.body.companyName || "",
      resume: resumePath || null,
    });

    emailService.sendWelcomeEmail(user.email, user.username).catch(() => {});

    res.status(201).json({
      message: "User was registered successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const user = await User.findByUsername(req.body.username, {
      includePassword: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.expiresIn,
    });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      accessToken: token,
    });
  } catch (err) {
    next(err);
  }
};
