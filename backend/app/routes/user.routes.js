const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");
const { validateUpdateProfile } = require("../validators/user.validator");

router.get("/profile", authJwt.verifyToken, userController.getProfile);
router.put("/profile", authJwt.verifyToken, validateUpdateProfile, userController.updateProfile);
router.get("/:id", authJwt.verifyToken, userController.getUserById);

module.exports = router;
