const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");

router.post(
  "/register",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRoleExisted],
  authController.signup
);

router.post("/login", authController.signin);

module.exports = router;
