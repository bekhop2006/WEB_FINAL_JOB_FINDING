const { query } = require("../db/pool");
const { mapApplication } = require("../db/mappers");

const APPLICATION_SELECT = `
  a.*,
  j.id AS job_id,
  j.title AS job_title,
  j.description AS job_description,
  j.company AS job_company,
  j.location AS job_location,
  j.salary AS job_salary,
  j.job_type AS job_type,
  j.category AS job_category,
  j.requirements AS job_requirements,
  j.employer_id AS job_employer_id,
  j.status AS job_status,
  j.created_at AS job_created_at,
  j.updated_at AS job_updated_at,
  u.id AS applicant_id,
  u.username AS applicant_username,
  u.full_name AS applicant_full_name,
  u.email AS applicant_email,
  u.resume AS applicant_resume,
  u.phone AS applicant_phone
`;

async function create(data) {
  const result = await query(
    `INSERT INTO applications (job_id, applicant_id, cover_letter)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [data.jobId, data.applicantId, data.coverLetter || ""]
  );
  return findById(result.rows[0].id);
}

async function findById(id) {
  const result = await query(
    `SELECT ${APPLICATION_SELECT}
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN users u ON u.id = a.applicant_id
     WHERE a.id = $1`,
    [id]
  );
  return mapApplication(result.rows[0]);
}

async function findRawById(id) {
  const result = await query("SELECT * FROM applications WHERE id = $1", [id]);
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    _id: row.id,
    id: row.id,
    job: row.job_id,
    jobId: row.job_id,
    applicant: row.applicant_id,
    applicantId: row.applicant_id,
    status: row.status,
  };
}

async function findOneByJobAndApplicant(jobId, applicantId) {
  const result = await query(
    "SELECT id FROM applications WHERE job_id = $1 AND applicant_id = $2",
    [jobId, applicantId]
  );
  return result.rows[0] ? { id: result.rows[0].id } : null;
}

async function findAll(filters = {}) {
  const where = [];
  const values = [];
  let i = 1;

  if (filters.applicantId) {
    where.push(`a.applicant_id = $${i++}`);
    values.push(filters.applicantId);
  }
  if (filters.jobIds) {
    if (filters.jobIds.length === 0) {
      return [];
    }
    where.push(`a.job_id = ANY($${i++}::uuid[])`);
    values.push(filters.jobIds);
  }
  if (filters.status) {
    where.push(`a.status = $${i++}`);
    values.push(filters.status);
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const result = await query(
    `SELECT ${APPLICATION_SELECT}
     FROM applications a
     JOIN jobs j ON j.id = a.job_id
     JOIN users u ON u.id = a.applicant_id
     ${whereSql}
     ORDER BY a.created_at DESC`,
    values
  );
  return result.rows.map((row) => mapApplication(row));
}

async function updateStatus(id, status) {
  await query("UPDATE applications SET status = $1 WHERE id = $2", [status, id]);
  return findById(id);
}

async function deleteById(id) {
  await query("DELETE FROM applications WHERE id = $1", [id]);
}

async function deleteByJobId(jobId) {
  await query("DELETE FROM applications WHERE job_id = $1", [jobId]);
}

module.exports = {
  create,
  findById,
  findRawById,
  findOneByJobAndApplicant,
  findAll,
  updateStatus,
  deleteById,
  deleteByJobId,
};
