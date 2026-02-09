const db = require("../models");
const Job = db.Job;
const Application = db.Application;

exports.create = async (req, res, next) => {
  try {
    const job = new Job({
      ...req.body,
      employer: req.userId,
    });
    await job.save();
    const populated = await Job.findById(job._id).populate("employer", "username fullName companyName");
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { title, location, company, category, jobType, status } = req.query;
    const filter = {};

    if (title) filter.title = new RegExp(title, "i");
    if (location) filter.location = new RegExp(location, "i");
    if (company) filter.company = new RegExp(company, "i");
    if (category) filter.category = new RegExp(category, "i");
    if (jobType) filter.jobType = jobType;
    if (status) filter.status = status;

    const jobs = await Job.find(filter)
      .populate("employer", "username fullName companyName")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employer",
      "username fullName companyName email"
    );
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }
    res.json(job);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (job.employer.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this job." });
    }

    const updates = { ...req.body };
    delete updates.employer;

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).populate("employer", "username fullName companyName");

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const isOwner = job.employer.toString() === req.userId;
    const isAdmin = req.user.role === "admin";
    const isModerator = req.user.role === "moderator";

    if (!isOwner && !isAdmin && !isModerator) {
      return res.status(403).json({ message: "Not authorized to delete this job." });
    }

    await Application.deleteMany({ job: req.params.id });
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted successfully." });
  } catch (err) {
    next(err);
  }
};

exports.findMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.userId })
      .populate("employer", "username fullName companyName")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
