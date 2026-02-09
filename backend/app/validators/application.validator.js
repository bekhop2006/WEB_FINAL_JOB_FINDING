const Joi = require("joi");

const createApplicationSchema = Joi.object({
  jobId: Joi.string().required().messages({
    "any.required": "Job ID is required",
  }),
  coverLetter: Joi.string().trim().max(2000).allow(""),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "reviewed", "accepted", "rejected")
    .required()
    .messages({
      "any.required": "Status is required",
      "any.only": "Status must be one of: pending, reviewed, accepted, rejected",
    }),
});

const validateCreateApplication = (req, res, next) => {
  const { error } = createApplicationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: messages });
  }
  next();
};

const validateUpdateStatus = (req, res, next) => {
  const { error } = updateStatusSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: messages });
  }
  next();
};

module.exports = {
  validateCreateApplication,
  validateUpdateStatus,
};
