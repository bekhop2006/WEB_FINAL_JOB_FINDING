const Application = require("../repositories/application.repository");
const Job = require("../repositories/job.repository");
const User = require("../repositories/user.repository");
const emailService = require("../services/email.service");

exports.create = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required." });
    }

    const job = await Job.findRawById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const existing = await Application.findOneByJobAndApplicant(jobId, req.userId);
    if (existing) {
      return res.status(400).json({ message: "You have already applied to this job." });
    }

    const application = await Application.create({
      jobId,
      applicantId: req.userId,
      coverLetter: coverLetter || "",
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const filters = {};

    if (req.user.role === "job_seeker" || req.user.role === "premium_user") {
      filters.applicantId = req.userId;
    } else if (req.user.role === "employer") {
      filters.jobIds = await Job.findIdsByEmployer(req.userId);
    }

    if (req.query.status) {
      filters.status = req.query.status;
    }

    const applications = await Application.findAll(filters);
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const jobId = application.job?._id || application.job;
    const job = await Job.findRawById(jobId);
    const applicantId = application.applicant?._id || application.applicant;
    const isApplicant = String(applicantId) === String(req.userId);
    const isEmployer = job && String(job.employerId) === String(req.userId);

    if (!isApplicant && !isEmployer && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    res.json(application);
  } catch (err) {
    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "reviewed", "accepted", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const jobId = application.job?._id || application.job;
    const job = await Job.findRawById(jobId);
    const isEmployer = job && String(job.employerId) === String(req.userId);
    const isAdmin = req.user.role === "admin";
    const isModerator = req.user.role === "moderator";

    if (!isEmployer && !isAdmin && !isModerator) {
      return res.status(403).json({ message: "Not authorized to update this application." });
    }

    const populated = await Application.updateStatus(req.params.id, status);

    const applicantId = populated.applicant?._id || populated.applicant;
    const applicant = await User.findById(applicantId);
    if (applicant && applicant.email) {
      const jobTitle = populated.job?.title || job?.title || "Job";
      emailService
        .sendApplicationStatusEmail(
          applicant.email,
          applicant.fullName || applicant.username,
          jobTitle,
          status
        )
        .catch(() => {});
    }

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const application = await Application.findRawById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (
      String(application.applicantId) !== String(req.userId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to withdraw this application.",
      });
    }

    await Application.deleteById(req.params.id);
    res.json({ message: "Application withdrawn successfully." });
  } catch (err) {
    next(err);
  }
};
