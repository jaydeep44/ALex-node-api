const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();

const role = require("./roleRoute");
const ccs = require("./ccsRoutes");
const user = require("./userRoutes");
const student = require("./studentRoutes");
const attaindence = require("./attaindence");
const pin = require("./pinRoutes");
const accessChat = require("./chatRoutes");
const message = require("./messageRoutes");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(cors());
app.use(morgan("combined"));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use("/api", role),
  app.use("/api", ccs),
  app.use("/api", user),
  app.use("/api", student),
  app.use("/api", attaindence),
  app.use("/api", pin),
  app.use("/api", accessChat),
  app.use("/api", message),
  (module.exports = app);
