const { query } = require("../db/pool");
const { mapJob } = require("../db/mappers");

const EMPLOYER_SELECT = `
  j.*,
  u.username AS employer_username,
  u.full_name AS employer_full_name,
  u.company_name AS employer_company_name,
  u.email AS employer_email
`;

async function create(data) {
  const result = await query(
    `INSERT INTO jobs (
      title, description, company, location, salary, job_type,
      category, requirements, employer_id, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING id`,
    [
      data.title,
      data.description,
      data.company,
      data.location,
      data.salary || null,
      data.jobType || "full_time",
      data.category || null,
      Array.isArray(data.requirements) ? data.requirements : [],
      data.employerId,
      data.status || "active",
    ]
  );
  return findById(result.rows[0].id);
}

async function findById(id, { includeEmployerEmail = false } = {}) {
  const result = await query(
    `SELECT ${EMPLOYER_SELECT}
     FROM jobs j
     JOIN users u ON u.id = j.employer_id
     WHERE j.id = $1`,
    [id]
  );
  return mapJob(result.rows[0], { includeEmployerEmail });
}

async function findRawById(id) {
  const result = await query("SELECT * FROM jobs WHERE id = $1", [id]);
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    _id: row.id,
    id: row.id,
    employer: row.employer_id,
    employerId: row.employer_id,
    title: row.title,
    status: row.status,
  };
}

async function findAll(filters = {}) {
  const where = [];
  const values = [];
  let i = 1;

  if (filters.title) {
    where.push(`j.title ILIKE $${i++}`);
    values.push(`%${filters.title}%`);
  }
  if (filters.location) {
    where.push(`j.location ILIKE $${i++}`);
    values.push(`%${filters.location}%`);
  }
  if (filters.company) {
    where.push(`j.company ILIKE $${i++}`);
    values.push(`%${filters.company}%`);
  }
  if (filters.category) {
    where.push(`j.category ILIKE $${i++}`);
    values.push(`%${filters.category}%`);
  }
  if (filters.jobType) {
    where.push(`j.job_type = $${i++}`);
    values.push(filters.jobType);
  }
  if (filters.status) {
    where.push(`j.status = $${i++}`);
    values.push(filters.status);
  }
  if (filters.employerId) {
    where.push(`j.employer_id = $${i++}`);
    values.push(filters.employerId);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const result = await query(
    `SELECT ${EMPLOYER_SELECT}
     FROM jobs j
     JOIN users u ON u.id = j.employer_id
     ${whereSql}
     ORDER BY j.created_at DESC`,
    values
  );
  return result.rows.map((row) => mapJob(row));
}

async function updateById(id, updates) {
  const allowed = {
    title: "title",
    description: "description",
    company: "company",
    location: "location",
    salary: "salary",
    jobType: "job_type",
    category: "category",
    requirements: "requirements",
    status: "status",
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
  await query(
    `UPDATE jobs SET ${fields.join(", ")} WHERE id = $${i}`,
    values
  );
  return findById(id);
}

async function deleteById(id) {
  await query("DELETE FROM jobs WHERE id = $1", [id]);
}

async function findIdsByEmployer(employerId) {
  const result = await query(
    "SELECT id FROM jobs WHERE employer_id = $1",
    [employerId]
  );
  return result.rows.map((r) => r.id);
}

module.exports = {
  create,
  findById,
  findRawById,
  findAll,
  updateById,
  deleteById,
  findIdsByEmployer,
};
