const express = require("express");
const { dismiss } = require("../controllers/attaindence");
const {
  student_save,
  Update_Student,
  DeleteStudent,
  Get_Student,
  Get_student_by_id,
  update_Many,
  search_Student,
  get_stu,
  FilterStudent,
  uploadcsv,
  
} = require("../controllers/studentController");
const authJwt = require("../middleware/authjwt");

const { upload } = require("../controllers/userControllers");

const router = express.Router();

router
  .route("/createStudent")
  .post(authJwt.verifyToken, upload.single("image"), student_save);
router
  .route("/updateStudent/:id")
  .put(authJwt.verifyToken, upload.single("image"), Update_Student);
router
  .route("/deleteStudent")
  .delete(authJwt.verifyToken, upload.none(), DeleteStudent);
router.route("/student").get(authJwt.verifyToken, Get_Student);
router.route("/student/:id").get(authJwt.verifyToken, Get_student_by_id);

router
  .route("/updateManyRecords")
  .put(authJwt.verifyToken, upload.none(), update_Many);
router.route("/search/:key").get(authJwt.verifyToken, search_Student);
router.route("/getStu/:id").get(authJwt.verifyToken, upload.none(), get_stu);
router.route("/filterClass/:key").get(FilterStudent);
router.route("/uploadcsv").post(authJwt.verifyToken, uploadcsv);

module.exports = router;
