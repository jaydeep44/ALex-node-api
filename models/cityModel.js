const mongoose = require("mongoose");

const CitySchema = mongoose.Schema({
  name: {
    type: String,
  },
  sId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("City", CitySchema);
