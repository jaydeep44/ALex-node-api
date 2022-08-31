var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attandences = mongoose.Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "student" },
    counsellor_id: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: String, required: true },
    attendence: { type: String , default: null  },
    out_of_class: { type: String },
    outclassDateTime: { type: String },
    inclassDateTime: { type: String },
    classId: { type: Schema.Types.ObjectId, ref: "Class" },
  },
  { timestamps: true }
);

var Data = mongoose.model("attandence", attandences);
module.exports = Data;
