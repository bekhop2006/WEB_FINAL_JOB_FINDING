const { query } = require("../db/pool");
const { mapUser } = require("../db/mappers");

async function findById(id, { includePassword = false } = {}) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return mapUser(result.rows[0], { includePassword });
}

async function findByUsername(username, { includePassword = false } = {}) {
  const result = await query("SELECT * FROM users WHERE username = $1", [username]);
  return mapUser(result.rows[0], { includePassword });
}

async function findByEmail(email) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return mapUser(result.rows[0]);
}

async function create(data) {
  const result = await query(
    `INSERT INTO users (
      username, email, password, role, full_name, phone, resume, company_name
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      data.username,
      data.email,
      data.password,
      data.role || "job_seeker",
      data.fullName,
      data.phone,
      data.resume || null,
      data.companyName || null,
    ]
  );
  return mapUser(result.rows[0]);
}

async function updateById(id, updates) {
  const allowed = {
    fullName: "full_name",
    phone: "phone",
    resume: "resume",
    companyName: "company_name",
    password: "password",
  };

  const fields = [];
  const values = [];
  let i = 1;

  for (const [key, column] of Object.entries(allowed)) {
    if (updates[key] !== undefined) {
      fields.push(`${column} = $${i++}`);
      values.push(updates[key]);
    }
  }

  if (fields.length === 0) {
    return findById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values
  );
  return mapUser(result.rows[0]);
}

module.exports = {
  findById,
  findByUsername,
  findByEmail,
  create,
  updateById,
};
