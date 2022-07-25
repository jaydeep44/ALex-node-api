const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config();

exports.login = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body.username || !body.password) {
      res.status(400).send({
        message: "user name and password are required!",
      });
    } else {

      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(400).send({
          message: "user not Found !",
        });
      } else {
        const role = await Role.findOne({ _id: user.role });
        if (!role) {
          res.status(400).json({
            message: "role not found !",
            subError: role,
          });
        } else {
          bcrypt.compare(body.password, user.password, function (err, result) {
            if (result) {
              const token = jwt.sign(
                {
                  email: user.email,
                  _id: user._id,
                },
                process.env.LOGINKEY,
                {
                  expiresIn: "1h",
                }
              );
  
              res.status(200).json({
                _id: user._id,
                name: user.name,
                lastname: user.lastname,
                role: role.name,
                username: user.username,
                token: token,
              });
            } else {
              res.status(400).json({
                message: "password is incorrect",
              });
            }
          });
        }
      }
    }

  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }

  // User.find({ email: req.body.email })
  //   .exec()
  //   .then((user) => {
  //     if (user.length < 1) {
  //       return res.status(400).json({
  //         message: "email not found",
  //       });
  //     } else if (req.body.username) {

  //       User.find({ username: req.body.username }).then((user) => {
  //         if (user.length < 1) {
  //           return res.status(400).json({
  //             message: "user name not found",
  //           });
  //         } else {
  //           Role.find({ _id: user[0].role }).then((role) => {
  //             bcrypt.compare(
  //               req.body.password,
  //               user[0].password,
  //               (err, result) => {
  //                 if (!result) {
  //                   return res.status(400).json({
  //                     message: "password is incorrect",
  //                   });
  //                 }
  //                 if (result) {
  //                   const token = jwt.sign(
  //                     {
  //                       email: user[0].email,
  //                       _id: user[0]._id,
  //                     },
  //                     process.env.LOGINKEY,
  //                     {
  //                       expiresIn: "1h",
  //                     }
  //                   );

  //                   res.status(200).json({
  //                     _id: user[0]._id,
  //                     name: user[0].name,
  //                     lastname: user[0].lastname,
  //                     role: role[0].name,
  //                     username: user[0].username,
  //                     token: token,
  //                   });
  //                 }
  //               }
  //             );
  //           });
  //         }
  //       });
  //     } else {
  //       Role.find({ _id: user[0].role }).then((role) => {
  //         console.log(role);
  //         bcrypt.compare(req.body.password, user[0].password, (err, result) => {
  //           if (!result) {
  //             return res.status(400).json({
  //               message: "password is incorrect",
  //             });
  //           }
  //           if (result) {
  //             const token = jwt.sign(
  //               {
  //                 email: user[0].email,
  //                 _id: user[0]._id,
  //               },
  //               process.env.LOGINKEY,
  //               {
  //                 expiresIn: "1h",
  //               }
  //             );

  //             res.status(200).json({
  //               _id: user[0]._id,
  //               name: user[0].name,
  //               lastname: user[0].lastname,
  //               role: role[0].name,
  //               email: user[0].email,
  //               token: token,
  //             });
  //           }
  //         });
  //       });
  //     }
  //   })

  //   .catch((err) => {
  //     res.status(400).json({
  //       message: err,
  //     });
  //   });
};

exports.sendMailToResetPassword = (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: { user: process.env.USER, pass: process.env.PASSWORD },
  });

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User dont exists with that email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        transporter.sendMail({
          to: user.email,
          from: "example2655@gmail.com",
          subject: "password reset",
          html: `
<p>You requested for password reset</p>
                    <h5>click in this <a href="http://aelix.mangoitsol.com/resetpassword">link</a> to reset password</h5>
                    `,
        });
        res.json({ message: "check your email", token });
      });
    });
  });
};

exports.resetPassword = (req, res) => {
  console.log(req.body);
  const { token, oldPassword, newPassword, confirmPassword } = req.body;
  const salt = bcrypt.genSaltSync(10);

  const hash = bcrypt.hashSync(newPassword, salt);
  const obj = {
    password: hash,
    resetToken: "",
  };
  const objs = {
    password: hash,
  };
  if (token) {
    User.findOne({ resetToken: token })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            message: "Token is not match or expired",
          });
        }
        if (user && newPassword === confirmPassword) {
          user = _.extend(user, obj);
          user.save();

          return res.status(200).json({
            message: "Password Updated successfully",
          });
        } else {
          return res.status(400).json({
            message: "confirm password is not match",
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Token is not match or expired",
        });
      });
  } else if (!token && newPassword === confirmPassword) {
    if (req.body.id) {
      User.find({ _id: req.body.id }).then((user) => {
        if (!user) {
          return res.status(400).json({
            message: "id doesn't exist",
          });
        }

        if (user) {
          bcrypt.compare(oldPassword, user[0].password, (err, result) => {
            console.log(result, "result");
            if (!result) {
              return res.status(400).json({
                message: "OLdpassword is incorrect",
              });
            }
            if (result) {
              user = _.extend(user[0], objs);
              user.save();

              return res.status(200).json({
                message: "Password Updated successfully",
              });
            }
          });
        }
      });
    } else {
      return res.status(400).json({
        message: "confirm password is not match",
      });
    }
  } else {
    return res.status(400).json({
      message: "confirm password is not match",
    });
  }
};
