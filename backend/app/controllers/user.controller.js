const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      "fullName",
      "phone",
      "resume",
      "companyName",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (req.body.password) {
      updates.password = bcrypt.hashSync(req.body.password, 8);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (req.user.role !== "admin" && req.userId.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
