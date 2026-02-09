const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const emailService = require("../services/email.service");

exports.signup = async (req, res, next) => {
  try {
    let resumePath = "";
    if (req.file && req.file.filename) {
      resumePath = "/uploads/resumes/" + req.file.filename;
    }

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role || "job_seeker",
      fullName: req.body.fullName,
      phone: req.body.phone,
      companyName: req.body.companyName || "",
      resume: resumePath || undefined,
    });

    await user.save();

    // Send welcome email (async, non-blocking; fails silently if SMTP not configured)
    emailService.sendWelcomeEmail(user.email, user.username).catch(() => {});

    res.status(201).json({
      message: "User was registered successfully!",
      user: {
        id: user._id,
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
    const user = await User.findOne({ username: req.body.username });

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

    const token = jwt.sign(
      { id: user.id },
      config.secret,
      { expiresIn: config.expiresIn }
    );

    res.status(200).json({
      id: user._id,
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
