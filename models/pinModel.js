var mongoose = require("mongoose");

const pin = mongoose.Schema({
  pin: {
    type: String,
  },
  userId: { type: mongoose.Schema.Types.ObjectId },
});

var Pin = mongoose.model("pin", pin);
module.exports = Pin;
