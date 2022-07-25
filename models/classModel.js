var mongoose = require("mongoose");

const data = mongoose.Schema({
  className: { type: String },
});

var classData = mongoose.model("Class", data);
module.exports = classData;
