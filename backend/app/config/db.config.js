module.exports = {
  // Kept for backwards compatibility; prefer DATABASE_URL (Supabase).
  HOST: process.env.DB_HOST || "localhost",
  PORT: process.env.DB_PORT || 5432,
  DB: process.env.DB_NAME || "postgres",
};
