/**
 * Global error handling middleware.
 * Catches errors and returns appropriate HTTP status codes and messages.
 */
module.exports = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
    return res.status(400).json({ message: messages });
  }

  // Mongoose duplicate key (e.g. unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(400).json({
      message: `A record with this ${field} already exists.`,
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired." });
  }

  // Custom app errors with statusCode (e.g. 404)
  if (err.statusCode && err.statusCode >= 400 && err.statusCode < 600) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Default: 500 Internal Server Error
  console.error("Error:", err);
  res.status(500).json({
    message: process.env.NODE_ENV === "production" ? "Internal server error." : err.message,
  });
};
