const express = require("express");
const {
  Roles,
  studentClassCreate,
  Get_Class,
  Emergency_no,
  GetEmergency_no,
  Update_class,
  search_Class,
} = require("../controllers/roleControllers");
const router = express.Router();

router.route("/createRole").post(Roles);
router.route("/createClass").post(studentClassCreate);
router.route("/getClass").get(Get_Class);
router.route("/saveNo").post(Emergency_no);
router.route("/getEno").get(GetEmergency_no);
router.route("/updateClass/:id").put(Update_class);
router.route("/searchClass/:key").get(search_Class);



module.exports = router;
