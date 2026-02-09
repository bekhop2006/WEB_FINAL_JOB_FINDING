const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const { authJwt } = require("../middlewares");
const { validateCreateJob, validateUpdateJob } = require("../validators/job.validator");

router.post(
  "/",
  [authJwt.verifyToken, authJwt.isEmployer, validateCreateJob],
  jobController.create
);

router.get("/", jobController.findAll);
router.get("/my", authJwt.verifyToken, authJwt.isEmployer, jobController.findMyJobs);
router.get("/:id", jobController.findOne);

router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isEmployer, validateUpdateJob],
  jobController.update
);

// Employer can delete own jobs; Admin/Moderator can delete any job
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isEmployerOrModerator],
  jobController.delete
);

module.exports = router;
