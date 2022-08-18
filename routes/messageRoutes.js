const express = require("express");
const {
  allMessages,
  sendMessage,
  allGroupAndCouncellor,
  updateMessage,
  DeleteMessage,
  seenGroupMessage,
  allGroupAndCouncellors,
  softDeleteMessage,
} = require("../controllers/messageControllers");
const { upload } = require("../controllers/chatController");

const router = express.Router();

router.route("/getMessage/:chatId").get(allMessages);
router.route("/sendMessage").post(sendMessage);
// router.route("/allGCs/:id").get(allGroupAndCouncellor);
// router.route("/allGroupCs/:id").get(allGroupAndCouncellors);
router.route("/allGroup/:id").get(allGroupAndCouncellors);
router.route("/updateMessage/:id").put(upload.none(), updateMessage);
router.route("/deleteMessage/:id").delete(upload.none(), DeleteMessage);
router.route("/seenGroupMessage").put(upload.none(), seenGroupMessage);
router.route("/softDeleteMessage/:id").put(upload.none(), softDeleteMessage);


module.exports = router;
