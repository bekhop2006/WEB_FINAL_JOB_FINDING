const db = require("../models");
const Application = db.Application;
const Job = db.Job;

exports.create = async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "job_seeker") {
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
    res.status(500).json({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
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
    if (job.employer.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this application." });
    }

    application.status = status;
    await application.save();

    const populated = await Application.findById(application._id)
      .populate("job")
      .populate("applicant", "username fullName email");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
};
