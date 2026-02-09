const Joi = require("joi");

const createJobSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().trim().min(1).required().messages({
    "string.empty": "Description is required",
  }),
  company: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Company is required",
  }),
  location: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Location is required",
  }),
  salary: Joi.string().trim().max(50).allow(""),
  jobType: Joi.string()
    .valid("full_time", "part_time", "contract", "internship")
    .default("full_time"),
  category: Joi.string().trim().max(50).allow(""),
  requirements: Joi.array().items(Joi.string()).allow(null),
  status: Joi.string().valid("active", "closed").default("active"),
});

const updateJobSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  description: Joi.string().trim().min(1),
  company: Joi.string().trim().min(1).max(100),
  location: Joi.string().trim().min(1).max(100),
  salary: Joi.string().trim().max(50).allow(""),
  jobType: Joi.string().valid("full_time", "part_time", "contract", "internship"),
  category: Joi.string().trim().max(50).allow(""),
  requirements: Joi.array().items(Joi.string()).allow(null),
  status: Joi.string().valid("active", "closed"),
}).min(1);

const validateCreateJob = (req, res, next) => {
  const { error } = createJobSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: messages });
  }
  next();
};

const validateUpdateJob = (req, res, next) => {
  const { error } = updateJobSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: messages });
  }
  next();
};

module.exports = {
  validateCreateJob,
  validateUpdateJob,
};
