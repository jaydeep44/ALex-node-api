var mongoose = require("mongoose");

const role = mongoose.Schema({
  name: { type: String },
});

var Role = mongoose.model("Roles", role);
module.exports = Role;
