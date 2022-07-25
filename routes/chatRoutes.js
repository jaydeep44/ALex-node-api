const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  DeleteGroup,
} = require("../controllers/chatController");
const { upload } = require("../controllers/chatController");

const router = express.Router();

router.route("/accessChat").post(upload.none(), accessChat);
router.route("/chat").post(upload.none(), fetchChats);
router.route("/groupChat").post(upload.single("image"), createGroupChat);
router.route("/renameGroup").put(upload.none(), renameGroup);
router.route("/removeGroupUser").put(upload.none(), removeFromGroup);
router.route("/addUserInGroup").put(upload.single("image"), addToGroup);
router.route("/deletegroup/:id").delete(upload.none(), DeleteGroup);

module.exports = router;
