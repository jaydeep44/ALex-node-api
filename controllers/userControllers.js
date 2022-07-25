const User = require("../models/userModel");
const Roles = require("../models/roleModel");
const Class = require("../models/classModel");
const Student = require("../models/studentModel");
const multer = require("multer");

const bcrypt = require("bcrypt");
const user = require("../models/studentModel");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
exports.upload = multer({ storage: storage });

// exports.user1 = async (req, res) => {
//   await Roles.find({ role: req.body.role })
//     .then((data) => {
//       data.map((item) => {
//         if (item.name === req.body.role) {
//           console.log("manager");
//           var salt = bcrypt.genSaltSync(10);
//           var hash = bcrypt.hashSync(req.body.password, salt);

//           const manager = new User({
//             name: req.body.name,
//             email: req.body.email,
//             username: req.body.username,
//             password: hash,
//             phone: req.body.phone,
//             role: data._id,
//             street_Address: req.body.street_Address,
//             country: req.body.country,
//             city: req.body.city,
//             state: req.body.state,
//           });

//           // manager
//           //   .save()
//           //   .then((result) => {
//           //     res
//           //       .status(200)
//           //       .send({ message: "user added successFully ..", data: result });
//           //   })
//           //   .catch((err) => {
//           //     res.status(400).send({
//           //       message: "please Insert Unique Data",
//           //       SubError: err.message,
//           //     });
//           //   });
//         } else if (item.name === req.body.role) {
//           console.log("councello");

//           const user = new User({
//             name: req.body.name,
//             password: req.body.password,
//             username: req.body.username,
//             phone: req.body.phone,
//             classId: req.body.classId,
//             lastname: req.body.lastname,
//           });
//           var salt = bcrypt.genSaltSync(10);
//           var hash = bcrypt.hashSync(user.password, salt);
//           user.password = hash;
//           // user
//           //   .save()
//           //   .then((result) => {
//           //     res
//           //       .status(200)
//           //       .send({ message: "user added successFully ..", data: result });
//           //   })
//           //   .catch((err) => {
//           //     res.status(400).send({
//           //       message: "please Insert Unique Data",
//           //       SubError: err.message,
//           //     });
//           //   });
//         }
//       });
//     })
//     .catch((err) => {
//       res.status(400).send({
//         message: "please Insert Unique Data",
//         SubError: err.message,
//       });
//     });
// };

exports.CreateUser = async (req, res) => {
  let imagePath;
  if (req.file) {
    imagePath = req.file.path;
  }
  var info = {};
  for (key in req.body) {
    info[key] = req.body[key];
  }
  info["image"] = imagePath;

  // const id = [];
  // if (req.body.classId) {
  //   await Class.findOne({ className: req.body.classId }).then((data) => {
  //     id.push(data._id);
  //   });
  // }
  await Roles.findOne({ name: req.body.role }).then((data) => {
    info["role"] = data._id;
    // if (id.length) {
    //   info["classId"] = id;
    // }
    User.find({
      username: req.body.username,
    }).then((data) => {
      if (data.length > 0 && req.body.username) {
        res.status(400).send({
          message: "please Insert Unique Username ",
        });
      } else if (req.body.email) {
        User.find({ email: req.body.email }).then((data) => {
          if (data.length > 0) {
            res.status(400).send({
              message: "please Insert Unique Email ",
            });
          } else if (req.body.password) {
            const newUser = new User(info);

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newUser.password, salt);

            newUser.password = hash;
            newUser
              .save()
              .then((result) => {
                res
                  .status(200)
                  .send({ message: "Create successfully", data: result });
              })
              .catch((err) => {
                res.status(400).send({
                  message: "please Insert Unique Data",
                  SubError: err.message,
                });
              });
          } else {
            const newUser = new User(info);
            newUser
              .save()
              .then((result) => {
                res
                  .status(200)
                  .send({ message: "Create successfully", data: result });
              })
              .catch((err) => {
                res.status(400).send({
                  message: "please Insert Unique Data",
                  SubError: err.message,
                });
              });
          }
        });
      } else if (req.body.password) {
        const newUser = new User(info);

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newUser.password, salt);

        newUser.password = hash;
        newUser
          .save()
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((err) => {
            res.status(400).send({
              message: "something wents wrong",
              SubError: err.message,
            });
          });
      } else {
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(newUser.password, salt);
        const newUser = new User(info);
        // newUser.password = hash;
        newUser
          .save()
          .then((result) => {
            res
              .status(200)
              .send({ message: "Create successfully", data: result });
          })
          .catch((err) => {
            res.status(400).send({
              message: "please Insert Unique Data",
              SubError: err.message,
            });
          });
      }
    });
  });
};

exports.Get_User = async (req, res) => {
  const data = await User.find()
    .select("-password")
    .populate("role")
    .populate("classId");

  for (users1 in data) {
    let users = await Student.find({ assignClass: data[users1].classId });

    // console.log(users.length);
    data[users1].studentCount = users.length;
  }
  res.status(200).send(data);
};

exports.GetUserById = async (req, res) => {
  const data = await User.find({ _id: req.params.id })
    .then((response) => {
      res.status(200).send({
        message: "no create successfully",
        data: response,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.search_Councellor = async (req, res) => {
  let councellor = await User.find({
    $or: [
      {
        // name: { $regex: req.params.key },
         username: { $regex: req.params.key },

      },
    ],
  })
    .populate("role")
    .populate("classId");
  if (councellor.length <= 0) {
    res.status(400).send({
      message: "no records found",
    });
  } else {
    res.send({ data: councellor });
  }
};

exports.Update_user = (req, res) => {
  var image;
  if (req.file) {
    image = req.file.path;
  }

  // if (req.body.classId) {
  //   Class.findOne({ className: req.body.classId }).then((data) => {
  //     ids.push(data._id);
  //     console.log(data._id, "dataaaaaa");
  //   });
  // }
  const salt = bcrypt.genSaltSync(10);

  bcrypt.hash(req.body.password, salt, (err, hash) => {
    const user = User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        image: image,
        username: req.body.username,
        street_Address: req.body.street_Address,
        country: req.body.country,
        city: req.body.city,
        state: req.body.state,
        classId:req.body.classId,
        image: image,
        password: hash,
      },

      { new: true },
      (err, userupdatedData) => {
        if (err) {
          res.status(404).json({
            message: "please enter correct user id ",
            subErr: err.message,
          });
        } else {
          res.status(200).json({
            message: "user Updated successfully",
            userupdatedData: userupdatedData,
          });
        }
      }
    );
  });
};

exports.DeleteUser = async (req, res) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    return res.status(500).json({
      success: false,
      message: "user was not found",
    });
  }
  try {
    await user.remove();
    res.status(201).json({
      success: true,
      message: "user deleted",
    });
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};
