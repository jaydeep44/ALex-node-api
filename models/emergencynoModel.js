var mongoose = require("mongoose");

const data = mongoose.Schema({
  Ename: { type: String, required: true },
  number: {
    type: Number,
    required: true,
    validate: {
      validator: function (val) {
        return val.toString().length === 10;
      },
      message: (val) => `${val.value} has to be 10 digits`,
    },
  },
});

var classData = mongoose.model("emergency", data);
module.exports = classData;
