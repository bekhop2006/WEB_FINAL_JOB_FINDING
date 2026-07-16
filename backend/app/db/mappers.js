/**
 * Map DB rows to API shapes compatible with the existing frontend
 * (keeps both id and _id fields).
 */

function mapUser(row, { includePassword = false } = {}) {
  if (!row) return null;

  const user = {
    _id: row.id,
    id: row.id,
    username: row.username,
    email: row.email,
    role: row.role,
    fullName: row.full_name,
    phone: row.phone,
    resume: row.resume || "",
    companyName: row.company_name || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  if (includePassword) {
    user.password = row.password;
  }

  return user;
}

function mapEmployerSnippet(row, { includeEmail = false } = {}) {
  if (!row || !row.employer_id) return null;

  const employer = {
    _id: row.employer_id,
    id: row.employer_id,
    username: row.employer_username,
    fullName: row.employer_full_name,
    companyName: row.employer_company_name || "",
  };

  if (includeEmail) {
    employer.email = row.employer_email;
  }

  return employer;
}

function mapJob(row, { includeEmployerEmail = false } = {}) {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    title: row.title,
    description: row.description,
    company: row.company,
    location: row.location,
    salary: row.salary || "",
    jobType: row.job_type,
    category: row.category || "",
    requirements: row.requirements || [],
    employer: mapEmployerSnippet(row, { includeEmail: includeEmployerEmail }) || row.employer_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapApplicantSnippet(row) {
  if (!row || !row.applicant_id) return null;

  return {
    _id: row.applicant_id,
    id: row.applicant_id,
    username: row.applicant_username,
    fullName: row.applicant_full_name,
    email: row.applicant_email,
    resume: row.applicant_resume || "",
    phone: row.applicant_phone,
  };
}

function mapJobSnippet(row) {
  if (!row || !row.job_id) return null;

  // Full job fields present (joined)
  if (row.job_title !== undefined && row.job_description !== undefined) {
    return {
      _id: row.job_id,
      id: row.job_id,
      title: row.job_title,
      description: row.job_description,
      company: row.job_company,
      location: row.job_location,
      salary: row.job_salary || "",
      jobType: row.job_type,
      category: row.job_category || "",
      requirements: row.job_requirements || [],
      employer: row.job_employer_id,
      status: row.job_status,
      createdAt: row.job_created_at,
      updatedAt: row.job_updated_at,
    };
  }

  // Partial snippet
  return {
    _id: row.job_id,
    id: row.job_id,
    title: row.job_title,
    company: row.job_company,
    location: row.job_location,
    status: row.job_status,
  };
}

function mapApplication(row) {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    job: mapJobSnippet(row) || row.job_id,
    applicant: mapApplicantSnippet(row) || row.applicant_id,
    coverLetter: row.cover_letter || "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

module.exports = {
  mapUser,
  mapJob,
  mapApplication,
};
