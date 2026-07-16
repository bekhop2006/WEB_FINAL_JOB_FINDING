/**
 * Offline checks for mapper + repository SQL shape (no live DB required).
 */
const assert = require("assert");
const { mapUser, mapJob, mapApplication } = require("../app/db/mappers");

const userRow = {
  id: "11111111-1111-1111-1111-111111111111",
  username: "alice",
  email: "alice@example.com",
  password: "hash",
  role: "job_seeker",
  full_name: "Alice A",
  phone: "+100000",
  resume: "/uploads/resumes/a.pdf",
  company_name: null,
  created_at: new Date(),
  updated_at: new Date(),
};

const user = mapUser(userRow);
assert.strictEqual(user._id, userRow.id);
assert.strictEqual(user.id, userRow.id);
assert.strictEqual(user.fullName, "Alice A");
assert.strictEqual(user.password, undefined);

const userWithPass = mapUser(userRow, { includePassword: true });
assert.strictEqual(userWithPass.password, "hash");

const jobRow = {
  id: "22222222-2222-2222-2222-222222222222",
  title: "Dev",
  description: "Build apps",
  company: "ACME",
  location: "Remote",
  salary: "100k",
  job_type: "full_time",
  category: "IT",
  requirements: ["Node"],
  employer_id: userRow.id,
  employer_username: "bob",
  employer_full_name: "Bob B",
  employer_company_name: "ACME",
  employer_email: "bob@acme.com",
  status: "active",
  created_at: new Date(),
  updated_at: new Date(),
};

const job = mapJob(jobRow, { includeEmployerEmail: true });
assert.strictEqual(job._id, jobRow.id);
assert.strictEqual(job.jobType, "full_time");
assert.strictEqual(job.employer._id, userRow.id);
assert.strictEqual(job.employer.email, "bob@acme.com");

const appRow = {
  id: "33333333-3333-3333-3333-333333333333",
  cover_letter: "Hi",
  status: "pending",
  created_at: new Date(),
  updated_at: new Date(),
  job_id: jobRow.id,
  job_title: "Dev",
  job_description: "Build apps",
  job_company: "ACME",
  job_location: "Remote",
  job_salary: "100k",
  job_type: "full_time",
  job_category: "IT",
  job_requirements: ["Node"],
  job_employer_id: userRow.id,
  job_status: "active",
  job_created_at: new Date(),
  job_updated_at: new Date(),
  applicant_id: userRow.id,
  applicant_username: "alice",
  applicant_full_name: "Alice A",
  applicant_email: "alice@example.com",
  applicant_resume: "/uploads/resumes/a.pdf",
  applicant_phone: "+100000",
};

const application = mapApplication(appRow);
assert.strictEqual(application._id, appRow.id);
assert.strictEqual(application.job._id, jobRow.id);
assert.strictEqual(application.applicant.username, "alice");
assert.strictEqual(application.coverLetter, "Hi");

console.log("Mapper checks passed.");
