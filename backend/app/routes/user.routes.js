const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");

router.get("/profile", authJwt.verifyToken, userController.getProfile);
router.put("/profile", authJwt.verifyToken, userController.updateProfile);
router.get("/:id", authJwt.verifyToken, userController.getUserById);

module.exports = router;
