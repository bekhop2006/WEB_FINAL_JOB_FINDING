const db = require("../models");
const Application = db.Application;
const Job = db.Job;
const User = db.User;
const emailService = require("../services/email.service");

exports.create = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const existing = await Application.findOne({
      job: jobId,
      applicant: req.userId,
    });
    if (existing) {
      return res.status(400).json({ message: "You have already applied to this job." });
    }

    const application = new Application({
      job: jobId,
      applicant: req.userId,
      coverLetter: coverLetter || "",
    });

    await application.save();
    const populated = await Application.findById(application._id)
      .populate("job")
      .populate("applicant", "username fullName email");

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === "job_seeker" || req.user.role === "premium_user") {
      filter.applicant = req.userId;
    } else if (req.user.role === "employer") {
      const myJobs = await Job.find({ employer: req.userId }).select("_id");
      filter.job = { $in: myJobs.map((j) => j._id) };
    }
    // admin: no filter, sees all

    const { status } = req.query;
    if (status) filter.status = status;

    const applications = await Application.find(filter)
      .populate("job", "title company location status")
      .populate("applicant", "username fullName email resume")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "username fullName email resume phone");

    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const job = await Job.findById(application.job._id);
    const isApplicant = application.applicant._id.toString() === req.userId;
    const isEmployer = job.employer.toString() === req.userId;

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

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    const job = await Job.findById(application.job._id);
    const isEmployer = job.employer.toString() === req.userId;
    const isAdmin = req.user.role === "admin";
    const isModerator = req.user.role === "moderator";

    if (!isEmployer && !isAdmin && !isModerator) {
      return res.status(403).json({ message: "Not authorized to update this application." });
    }

    application.status = status;
    await application.save();

    // Send email notification to applicant (async, non-blocking)
    const applicant = await User.findById(application.applicant).select("email fullName username");
    if (applicant && applicant.email) {
      const jobTitle = application.job?.title || job?.title || "Job";
      emailService
        .sendApplicationStatusEmail(applicant.email, applicant.fullName || applicant.username, jobTitle, status)
        .catch(() => {});
    }

    const populated = await Application.findById(application._id)
      .populate("job")
      .populate("applicant", "username fullName email");

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.applicant.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to withdraw this application." });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application withdrawn successfully." });
  } catch (err) {
    next(err);
  }
};
