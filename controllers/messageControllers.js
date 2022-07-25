const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const user = require("../models/userModel");
const { get_stu } = require("./studentController");
var mongoose = require("mongoose");

const read = require("body-parser/lib/read");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
exports.allMessages = async (req, res) => {
  var unseenMessageArray = [];
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name image username email")
      .populate("chat");
    console.log(messages.length, "jjjjjjjjjjjjjj");
    unseenMessageArray = messages.filter((i) => i.readBy == false);
    console.log(unseenMessageArray.length, "ggggggggggg");
    console.log(unseenMessageArray, "gggccsdcecgggggggg");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.DeleteMessage = async (req, res) => {
  let user = await Message.findById(req.params.id);
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "messageId was not found",
    });
  }
  try {
    await user.remove();
    res.status(201).json({
      success: true,
      message: "message deleted",
    });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};
exports.updateMessage = async (req, res) => {
  Message.findByIdAndUpdate(
    req.params.id,
    {
      content: req.body.content,
    },
    { new: true },
    (err, messageupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct student id ",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "Message Updated successfully",
          messageupdatedData: messageupdatedData,
        });
      }
    }
  );
};
exports.allGroupAndCouncellors = async (req, res) => {
  var g = [];

  const h = await User.find();
  g.push(h);

  var data = await Chat.find({
    $and: [
      { isGroupChat: true },
      { users: { $elemMatch: { $eq: req.params.id } } },
    ],
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      g.push(results);
    });
  res.json(g);
};

//@description     Create New Message
//@route           POST /api/Message/
//@access

exports.seenGroupMessage = async (req, res) => {
  const { groupId, userId } = req.body;
  let l = [];
  let m = [];
  let newarr = [];

  await Chat.findById(groupId).then((result) => {
    let data = result.readUsers.filter((i) => i._id == userId);
    console.log(data[0]);
    if (data[0]) {
    } else {
      Chat.findByIdAndUpdate(groupId, {
        $push: {
          readUsers: {
            _id: userId,
            seen: true,
          },
        },
      })
        .then((result) => {
          res.send(result);
          if (result) {
            Chat.findById(groupId).then((result) => {
              m.push(result.users);
              result.readUsers.map((t) => {
                l.push(t._id);
              });
              var is_same = m[0]?.length == l.length;
              if (is_same == true) {
                console.log("jjjjjjj");
                Chat.findByIdAndUpdate(
                  groupId,
                  {
                    readBy: 0,
                    readUsers: [
                      {
                        _id: null,
                        seen: false,
                      },
                    ],
                  },
                  { new: true },
                  (err, studentupdatedData) => {
                    if (err) {
                    } else {
                      // console.log(studentupdatedData,"heyyy")
                    }
                  }
                );
                Message.find().then((t) => {
                  let data = t.filter((j) => j.chat == groupId);
                  data.map((o) => {
                    newarr.push(o._id);
                  });
                  Message.updateMany(
                    { _id: { $in: newarr } },
                    {
                      readBy: true,
                    },
                    { new: true },
                    (err, studentupdated) => {
                      if (err) {
                      } else {
                        console.log(studentupdated, "heyyybay");
                      }
                    }
                  );
                });
              } else {
                console.log("lelo");
              }
            });
          }
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

exports.sendMessage = async (req, res) => {
  const { content, chatId, senderId } = req.body;

  const messages = await Message.find({ chatId: chatId });
  var l = messages.filter(
    (i) => i.readBy == false && i.sender == senderId && i.chat == chatId
  );
  console.log(l.length);

  Chat.findByIdAndUpdate(
    chatId,
    {
      readBy: l.length,
    },
    { new: true },
    (err, studentupdatedData) => {
      if (err) {
        console.log(err, "errrrrrrrrrrrrrrrrrrrrrrrrr");
      } else {
        console.log(studentupdatedData, "updateddddddddddddddddddddddddd");
      }
    }
  );

  let g = [];
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: senderId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name image");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name image email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);

    const messages = await Message.find({ chatId: chatId });
    const chat = await Chat.find({ _id: chatId, isGroupChat: false });
    var h = messages.filter(
      (i) => i.readBy == false && i.sender == senderId && i.chat == chatId
    );
    let m = chat[0]?.users.filter((i) => i == senderId)[0];

    User.findByIdAndUpdate(
      m?._id,
      {
        readBy: h.length,
      },
      { new: true },
      (err, studentupdatedData) => {
        if (err) {
          console.log(err, "errrrrrrrrrrrrrrrrrrrrrrrrr");
        } else {
          console.log(studentupdatedData, "updateddddddddddddddddddddddddd");
        }
      }
    );
  } catch (error) {
    res.status(400);
    console.log(error.message);
  }
};
