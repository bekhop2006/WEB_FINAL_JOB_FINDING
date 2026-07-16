const Job = require("../repositories/job.repository");
const Application = require("../repositories/application.repository");

exports.create = async (req, res, next) => {
  try {
    const job = await Job.create({
      ...req.body,
      employerId: req.userId,
    });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
};

exports.findAll = async (req, res, next) => {
  try {
    const { title, location, company, category, jobType, status } = req.query;
    const jobs = await Job.findAll({
      title,
      location,
      company,
      category,
      jobType,
      status,
    });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id, { includeEmployerEmail: true });
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
    const job = await Job.findRawById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    if (String(job.employerId) !== String(req.userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this job." });
    }

    const updates = { ...req.body };
    delete updates.employer;
    delete updates.employerId;

    const updated = await Job.updateById(req.params.id, updates);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const job = await Job.findRawById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const isOwner = String(job.employerId) === String(req.userId);
    const isAdmin = req.user.role === "admin";
    const isModerator = req.user.role === "moderator";

    if (!isOwner && !isAdmin && !isModerator) {
      return res.status(403).json({ message: "Not authorized to delete this job." });
    }

    await Application.deleteByJobId(req.params.id);
    await Job.deleteById(req.params.id);

    res.json({ message: "Job deleted successfully." });
  } catch (err) {
    next(err);
  }
};

exports.findMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({ employerId: req.userId });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
};
