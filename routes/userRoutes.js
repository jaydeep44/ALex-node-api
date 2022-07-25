const express = require("express");
const path = require("path");

const {
  login,
  sendMailToResetPassword,
  resetPassword,
} = require("../controllers/loginControllers");
const {
  CreateUser,
  upload,
  Get_User,
  Update_user,
  DeleteUser,
  search_Councellor,
  CreateManager,
  GetUserById,
  user1,
} = require("../controllers/userControllers");
const authJwt = require("../middleware/authjwt");

const router = express.Router();
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

router.route("/createUser").post(upload.single("image"), CreateUser);
router.route("/login").post(upload.none(), login);
router.route("/sendMail").post(sendMailToResetPassword);
router.route("/resetPassword").post(resetPassword);
router.route("/getUser").get(authJwt.verifyToken, Get_User);
router
  .route("/updateUser/:id")
  .put(authJwt.verifyToken, upload.single("image"), Update_user);
router.route("/deleteUser/:id").delete(authJwt.verifyToken, DeleteUser);
router.route("/searchUser/:key").get(authJwt.verifyToken, search_Councellor);
router.route("/user/:id").get(authJwt.verifyToken, GetUserById);
// router.route("/test").post(upload.none(), user1);

module.exports = router;
