require("dotenv").config();
const cors = require("cors");

const bodyParser = require("body-parser");
const app = require("./routes/index");

const DatabaseConn = require("./conn");
const port = process.env.PORT || 4001;
const baseURL = process.env.BASEURL;

DatabaseConn();
const server = app.listen(port, () => {
  console.log(`its running ${port}`);
});

var io = require("socket.io")(server, {
  //pingTimeout: 60000,
  cors: {
    origin: ["http://localhost:3000", "http://aelix.mangoitsol.com"],
  },
  credentials: true,
});
//io.set("origins", "*:*");

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("sendNotification", (detail) => {
    console.log(detail, "detaill");
    io.emit("noty", detail);
  });

  socket.on("sendNotificationDismiss", (data) => {
    console.log(data,"studentname")
    io.emit("dismissNotication");
  });
  socket.on("sendYellowNotification", () => {
    io.emit("yellownoty");
  });
  socket.on("sendBlackNotification", () => {
    io.emit("blacknoty");
  });
  //Send Messages by using Socket
  socket.on("setup", (userData) => {
    socket.join(userData);
    console.log(userData, "^^^^^^^^^^^");
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));

  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("message", (newMessageRecieved) => {
    console.log(newMessageRecieved, "newMessage");
    var chat = newMessageRecieved.chat;
    var users = JSON.stringify(chat.users);
    // console.log(users,"+++++++++++")
    // console.log(newMessageRecieved,"newMessageRecieved")
    if (!users) return console.log("chat.users not defined");

    chat.users.map((user) => {
      console.log(user._id, "====", newMessageRecieved.sender._id);
      if (user._id == newMessageRecieved.sender._id) {
        console.log("hhhhhhhhhhhhh");
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData);
  });
});
