const stateModel = require("../models/stateModel");
const cityModel = require("../models/cityModel");
const countryModel = require("../models/countryModel");
const db = require("../conn");


exports.saveCountry = (req, res) => {
  const country = new countryModel(req.body);

  country
    .save()
    .then(() => {
      res.send(country);
    })
    .catch((err) => {
      res.send(err.message);
    });
};
exports.saveState = (req, res) => {
  const country = new stateModel(req.body);

  country
    .save()
    .then(() => {
      res.send(country);
    })
    .catch((err) => {
      res.send(err.message);
    });
};
exports.saveCity = (req, res) => {
  const country = new cityModel(req.body);

  country
    .save()
    .then(() => {
      res.send(country);
    })
    .catch((err) => {
      res.send(err.message);
    });
};

exports.getStateBYCountryID = (req, res) => {
  const id = req.params.id;
  stateModel
    .find({ cId: id })
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.getCityBYStateID = (req, res) => {
  const id = req.params.id;
  cityModel
    .find({ sId: id })
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    })
    .catch((err) => {
      res.send(err);
    });
};
exports.getAllCountry = async (req, res) => {
  const countryCount = await countryModel.countDocuments();
  const country = await countryModel.find();
  try {
    await countryModel.find();
    res.status(200).json({ countryCount, country });
    console.log(res);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};
