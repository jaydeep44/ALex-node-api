const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    image: { type: String },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    readBy: { type: Number, default: 0 },
    readUsers: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId },
        seen: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
