/**
 * Global error handling middleware.
 * Catches errors and returns appropriate HTTP status codes and messages.
 */
module.exports = (err, req, res, next) => {
  // PostgreSQL unique violation
  if (err.code === "23505") {
    const detail = err.detail || "";
    const fieldMatch = detail.match(/\(([^)]+)\)=/);
    const field = fieldMatch ? fieldMatch[1] : "field";
    return res.status(400).json({
      message: `A record with this ${field} already exists.`,
    });
  }

  // PostgreSQL invalid UUID / input syntax
  if (err.code === "22P02") {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  // PostgreSQL foreign key / check violations
  if (err.code === "23503") {
    return res.status(400).json({ message: "Related record not found." });
  }
  if (err.code === "23514") {
    return res.status(400).json({ message: err.message || "Invalid value." });
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
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error."
        : err.message,
  });
};
