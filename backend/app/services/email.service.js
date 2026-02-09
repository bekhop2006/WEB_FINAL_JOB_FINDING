const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

/**
 * Create transporter. Uses SMTP config from env or SendGrid/Mailgun compatible settings.
 * For SendGrid: use smtp.sendgrid.net with API key as password.
 * For Mailgun: use smtp.mailgun.org with your Mailgun SMTP credentials.
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  // SendGrid: use port 587 with STARTTLS, user must be literally "apikey"
  const options = {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
  if (port === 587) {
    options.secure = false;
    options.requireTLS = true;
  }

  return nodemailer.createTransport(options);
};

/**
 * Send welcome email after registration.
 */
const sendWelcomeEmail = async (email, username) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("Email service not configured. Skipping welcome email.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@jobfinder.com";

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: "Welcome to JobFinder!",
      html: `
        <h2>Welcome, ${username}!</h2>
        <p>Your account has been successfully created.</p>
        <p>You can now log in and start browsing jobs or post your own if you're an employer.</p>
        <p>Best regards,<br>JobFinder Team</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
    if (process.env.NODE_ENV !== "production") {
      console.error("SMTP error details:", err);
    }
  }
};

/**
 * Send notification when application status changes.
 */
const sendApplicationStatusEmail = async (applicantEmail, applicantName, jobTitle, status) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("Email service not configured. Skipping application status email.");
    return;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@jobfinder.com";
  const statusMessages = {
    accepted: "Congratulations! Your application has been accepted.",
    rejected: "Unfortunately, your application was not selected for this position.",
    reviewed: "Your application has been reviewed.",
    pending: "Your application is pending review.",
  };
  const msg = statusMessages[status] || `Your application status: ${status}`;

  try {
    await transporter.sendMail({
      from,
      to: applicantEmail,
      subject: `Application Update: ${jobTitle}`,
      html: `
        <h2>Hello, ${applicantName || "Applicant"}!</h2>
        <p>Regarding your application for <strong>${jobTitle}</strong>:</p>
        <p>${msg}</p>
        <p>Best regards,<br>JobFinder Team</p>
      `,
    });
  } catch (err) {
    console.error("Failed to send application status email:", err.message);
    if (process.env.NODE_ENV !== "production") {
      console.error("SMTP error details:", err);
    }
  }
};

module.exports = {
  sendWelcomeEmail,
  sendApplicationStatusEmail,
};
