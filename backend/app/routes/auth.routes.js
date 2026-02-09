const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");
const { uploadResume } = require("../middlewares/upload");
const { validateRegister, validateLogin } = require("../validators/auth.validator");

// Multer runs only for multipart so req.body is populated; otherwise express.json() already did
const maybeUploadResume = (req, res, next) => {
  if (req.is("multipart/form-data")) {
    uploadResume(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  } else {
    next();
  }
};

router.post(
  "/register",
  [maybeUploadResume, validateRegister, verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRoleExisted],
  authController.signup
);

router.post("/login", validateLogin, authController.signin);

module.exports = router;
