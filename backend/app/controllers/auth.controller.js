const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: req.body.role || "job_seeker",
      fullName: req.body.fullName,
      phone: req.body.phone,
      companyName: req.body.companyName,
    });

    await user.save();

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
    res.status(500).json({ message: err.message });
  }
};

exports.signin = async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
};
