const express = require("express");
const { CreatePin, varifyPin, UpdatePin } = require("../controllers/pinControllers");
const { upload } = require("../controllers/studentController");
const authJwt = require("../middleware/authjwt");

const router = express.Router();

router.route("/createPin").post(upload.none(), CreatePin);
router.route("/varifyPin").post(authJwt.verifyToken, upload.none(), varifyPin);
router.route("/updatePin/:id").put(authJwt.verifyToken, upload.none(), UpdatePin);


module.exports = router;
