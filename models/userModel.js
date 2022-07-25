const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Users = mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String },
  email: { type: String },
  password: { type: String },
  phone: { type: Number, maxLength: 9 },
  role: { type: Schema.Types.ObjectId, ref: "Roles" },
  username: { type: String },
  street_Address: { type: String },
  country: { type: Schema.Types.ObjectId, ref: "Country" },
  city: { type: String },
  state: { type: Schema.Types.ObjectId, ref: "State" },
  image: { type: String },
  classId: { type: Schema.Types.ObjectId, ref: "Class" },
  studentCount: { type: Number },
  readBy: { type: Number, default: 0 },
  resetToken: String,
  expireToken: Date,
});

var user = mongoose.models.Users || mongoose.model("User", Users);
module.exports = user;
