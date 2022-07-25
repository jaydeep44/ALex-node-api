const mongoose = require("mongoose");

const CountrySchema = mongoose.Schema({
  name: {
    type: String,
  },
});

module.exports = mongoose.model("Country", CountrySchema);
