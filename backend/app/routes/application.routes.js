const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { authJwt } = require("../middlewares");
const { validateCreateApplication, validateUpdateStatus } = require("../validators/application.validator");

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isJobSeeker, validateCreateApplication],
  applicationController.create
);

router.get("/", authJwt.verifyToken, applicationController.findAll);
router.get("/:id", authJwt.verifyToken, applicationController.findOne);

router.put(
  "/:id/status",
  [authJwt.verifyToken, authJwt.isEmployerOrModerator, validateUpdateStatus],
  applicationController.updateStatus
);

router.delete("/:id", authJwt.verifyToken, applicationController.delete);

module.exports = router;
