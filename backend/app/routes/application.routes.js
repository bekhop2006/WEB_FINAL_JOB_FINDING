const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/application.controller");
const { authJwt } = require("../middlewares");

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isJobSeeker],
  applicationController.create
);

router.get("/", authJwt.verifyToken, applicationController.findAll);
router.get("/:id", authJwt.verifyToken, applicationController.findOne);

router.put(
  "/:id/status",
  [authJwt.verifyToken, authJwt.isEmployer],
  applicationController.updateStatus
);

router.delete("/:id", authJwt.verifyToken, applicationController.delete);

module.exports = router;
