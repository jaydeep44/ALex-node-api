const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const multer = require("multer");
const user = require("../models/userModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
exports.upload = multer({ storage: storage });
exports.accessChat = async (req, res) => {
  const { userId, recieverId } = req.body;
  if (!userId || !recieverId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: recieverId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    console.log(isChat[0]._id, "fullChat");
    Message.find({ chat: isChat[0] }).then((result) => {
      console.log(result.length, "result");
      let data = result.filter(
        (i) => i.readBy == false && i.sender == recieverId
      );

      for (i = 0; i < data.length; i++) {
        console.log(data[i]._id);
        Message.updateMany(
          { _id: { $in: data[i]._id } },
          { readBy: true },
          { new: true },
          (err, studentupdatedData) => {
            if (err) {
              // console.log(err);
            } else {
              // console.log(studentupdatedData);
            }
          }
        );
      }

      User.findByIdAndUpdate(
        recieverId,
        {
          readBy: 0,
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
    });

    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [recieverId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

exports.fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.body.userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

exports.createGroupChat = async (req, res) => {
  console.log(req.body);

  // if (!req.body.users || !req.body.name || !req.body.adminId) {
  //   return res.status(400).send({ message: "Please Fill all the feilds" });
  // }
  var image;
  if (req.file) {
    image = req.file.path;
  }

  var users = req.body.users;

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);
  console.log(req.body.chatName,"chatnamee")

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      users: req.body.users,
      image: image,
      isGroupChat: true,
      groupAdmin: req.body.adminId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send({ message: err.message });
  }
};

exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
};
exports.addToGroup = async (req, res) => {
  var image;
  if (req.file) {
    image = req.file.path;
  }
  let user = [];
  let user1 = [];
  const { chatId, userId, chatName } = req.body;
  if (userId) {
    user1 = userId;
  }

  for (i = 0; i < user1.length; i++) {
    await Chat.find({ _id: chatId, users: { $in: [userId[i]] } }).then(
      (result) => {
        if (result.length > 0) {
          console.log(result);
          user.push(result);
          // res.status(400).send({ message: "user already add in group" });
        }
      }
    );
  }

  if (user.length) {
    res.status(400).send({ message: "user already add in group" });
  } else {
    Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: user1 },
        chatName: chatName,
        image: image,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .then((data) => {
        console.log(data);
        res.status(200).send(data);
      });
  }

  /// check if the requester is admin
};

exports.DeleteGroup = async (req, res) => {
  let user = await Chat.findById(req.params.id);
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "groupId was not found",
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
