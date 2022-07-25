const express = require("express");
const {
  Postcountry,
  Poststate,
  Postcity,
  getCityBYStateID,
  getStateBYCountryID,
  getAllCountry,
  saveCountry,
  saveState,
  saveCity,
} = require("../controllers/CCS_controllers");

const router = express.Router();

 router.route("/saveCountry").post(saveCountry);
router.route("/saveState").post(saveState);
router.route("/saveCity").post(saveCity);
router.route("/state/:id").get(getStateBYCountryID);
router.route("/city/:id").get(getCityBYStateID);
router.route("/getAllCountry").get(getAllCountry);

module.exports = router;
