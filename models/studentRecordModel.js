const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var studentRecords = mongoose.Schema({
  student: { type: String, required: true , ref: "student" },
  attaindence: [{type: Schema.Types.ObjectId, ref: "attandence", default:null}],
 
});

var studentRecod = mongoose.models.studentRecords || mongoose.model("studentRecord", studentRecords);
module.exports = studentRecod;
