const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var students = mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String, required: true },
  DOB: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String },
  assignClass: { type: Schema.Types.ObjectId, ref: "Class", default: null },
  medical: { type: String },
  emergency: [
    {
      Ename: { type: String },
      number: { type: Number },
    },
  ],
  dismiss: { type: String , default:null },
  attaindence: {type: Schema.Types.ObjectId, ref: "attandence", default:null},
});

var user = mongoose.models.students || mongoose.model("student", students);
module.exports = user;
