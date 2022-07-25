const express = require("express");
const {
  attaindence_save,
  startTime,
  Update_status,
  stopTime,
  GetStoreData,
  dismiss,
  getAttaindence,
  attendenceReport,
  Update_Attaindence,
  getCouncellorBYClass,
  getPreviousRecords,
} = require("../controllers/attaindence");
const authJwt = require("../middleware/authjwt");

const { upload } = require("../controllers/studentController");

const router = express.Router();

router
  .route("/saveAttaindence")
  .put(authJwt.verifyToken, upload.none(), attaindence_save);
router.route("/updateStatus/:id").put(authJwt.verifyToken, Update_status);
router.route("/startTime/:id").put(authJwt.verifyToken, startTime);
router.route("/stopTime/:id").put(authJwt.verifyToken, stopTime);
router.route("/getStudentRecords/:classid").get(authJwt.verifyToken, GetStoreData);
router.route("/dismiss").post(authJwt.verifyToken, dismiss);
router.route("/attaindence").get(authJwt.verifyToken, getAttaindence);
router.route("/attaindenceReport").get(authJwt.verifyToken, attendenceReport);
router.route("/getPreviousRecords/:id").post(authJwt.verifyToken, getPreviousRecords);

router
  .route("/updateAttaindence/:id")
  .put(authJwt.verifyToken, Update_Attaindence);
router
  .route("/getCouncellorbyClass/:id")
  .get(authJwt.verifyToken, getCouncellorBYClass);

module.exports = router;
