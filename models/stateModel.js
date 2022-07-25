const mongoose = require("mongoose");

const StateSchema = mongoose.Schema({
  name: {
    type: String,
  },
  cId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("State", StateSchema);
