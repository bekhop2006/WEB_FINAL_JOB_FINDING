const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");

const db = {};
db.mongoose = mongoose;
db.url =
  process.env.MONGODB_URI ||
  `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`;
db.User = require("./user.model");
db.Job = require("./job.model");
db.Application = require("./application.model");
db.Role = require("./role.model");

module.exports = db;
