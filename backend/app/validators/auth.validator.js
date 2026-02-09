const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.alphanum": "Username must contain only letters and numbers",
      "string.min": "Username must be at least 3 characters",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "Password must be at least 6 characters",
    }),
  role: Joi.string()
    .valid("job_seeker", "employer", "admin", "premium_user", "moderator")
    .required(),
  fullName: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Full name is required",
  }),
  phone: Joi.string().trim().min(1).max(20).required().messages({
    "string.empty": "Phone is required",
  }),
  companyName: Joi.string().trim().max(100).allow(""),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: messages });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join("; ");
    return res.status(400).json({ message: messages });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
