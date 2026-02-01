const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const { authJwt } = require("../middlewares");

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isEmployer],
  jobController.create
);

router.get("/", jobController.findAll);
router.get("/my", authJwt.verifyToken, authJwt.isEmployer, jobController.findMyJobs);
router.get("/:id", jobController.findOne);

router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isEmployer],
  jobController.update
);

router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isEmployer],
  jobController.delete
);

module.exports = router;
