const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../../uploads/resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = (file.originalname || "").match(/\.pdf$/i) ? ".pdf" : ".pdf";
    cb(null, unique + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const isPdf =
    file.mimetype === "application/pdf" ||
    (file.originalname && file.originalname.toLowerCase().endsWith(".pdf"));
  if (isPdf) {
    cb(null, true);
  } else {
    const err = new Error("Only PDF files are allowed.");
    err.statusCode = 400;
    cb(err, false);
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("resume");

module.exports = { uploadResume };
