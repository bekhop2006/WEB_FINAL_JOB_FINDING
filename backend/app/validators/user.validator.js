const Joi = require("joi");

const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().max(100).allow(""),
  phone: Joi.string().trim().max(20).allow(""),
  resume: Joi.string().trim().allow(""),
  companyName: Joi.string().trim().max(100).allow(""),
  password: Joi.string().min(6).allow(""),
}).min(1);

const validateUpdateProfile = (req, res, next) => {
  const { error } = updateProfileSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: messages });
  }
  next();
};

module.exports = {
  validateUpdateProfile,
};
