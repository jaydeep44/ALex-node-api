const attandance = require("../models/attaindence");
const Student = require("../models/studentModel");
const studentRecod = require("../models/studentRecordModel")
const User = require("../models/userModel");
var moment = require("moment");
var mongodb = require("mongodb");

const date = require("date-and-time");

exports.attaindence_save = async (req, res) => {
    console.log(req.body.date);

  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");
  console.log(value,"dateeeeeeee");
   await attandance
    .find({
      date:req.body.date ,
      studentId:req.body.studentId
    })
    .then((result) => {
      console.log(result, "resulttt");
      if (result.length) {
         res.status(400).send({ message: "attaindence already save" });
      } else {
        console.log("attaindence save")
        const studentSave = new attandance({
          studentId: req.body.studentId,
          counsellor_id: req.body.counsellor_id,
          date: req.body.date,
          attendence: req.body.attendence,
          out_of_class: req.body.out_of_class,
          outclassDateTime: req.body.outclassDateTime,
          inclassDateTime: req.body.inclassDateTime,
          classId: req.body.classId,
        });
        studentSave
          .save()
          .then((response) => {
            res.status(200).send(response);
            // console.log(response);
              

            if (response) {
               
              
        

              Student.findOneAndUpdate(
                { _id: req.body.studentId },
                {

                  // $push: { attaindence: response._id }
                  attaindence: response._id,
                },

                { new: true }
              )
                .then((result) => {
                  // console.log(result);
                })
                .catch((err) => {
                  // console.log(err);
                });



                studentRecod.findOneAndUpdate(
                  { student: req.body.studentId },
                  {
  
                    $push: { attaindence: response._id }
                    
                  },
  
                  { new: true }
                )
                  .then((data) => {
                    console.log(data);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              // const studentRecords = new StudentRecords({
              //   studentId: req.body.studentId,
              //   attendence: response._id,
              //   classId: req.body.classId,
              //   createdAt: response.createdAt,
              //   updatedAt: response.updatedAt,
              // });
              // studentRecords.save();
            }
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      }
    });
};

exports.attendenceReport = async (req, res) => {
  const attaind = await attandance.find().populate("studentId");
  console.log(attaind);
};

exports.getAttaindence = async (req, res) => {
  const attaindence = await attandance.find().populate("studentId");
  try {
    await attandance.find().populate("studentId");
    res.status(200).json({ attaindence });
    console.log(res);
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};

exports.startTime = (req, res) => {
  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");

  attandance
    .find({ $and: [{ studentId: req.params.id }, { date: value }] })
    .then((data) => {
      console.log(data);
      if (data.length) {
        attandance.findByIdAndUpdate(
          data[0]._id,
          {
            outclassDateTime: now,
          },
          { new: true },
          (err, updateTime) => {
            console.log(updateTime, "updateTime");
            if (err) {
              res.status(404).json({
                message: "please enter correct user id ",
                subErr: err.message,
              });
            } else {
              res.status(200).json({
                message: "Time Updated successfully",
                data: updateTime,
              });
            }
          }
        );
        // setTimeout(() => clearTime(data[0]._id), 180000);
      } else {
        res.status(400).send({ message: "student id not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.Update_Attaindence = (req, res) => {
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.send("object missing");
  }
  attandance.findByIdAndUpdate(
    req.params.id,
    {
      attendence: req.body.attendence,
    },
    { new: true },
    (err, attaindenceupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct attaindence id",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "attaindence Updated successfully",
          attaindenceupdatedData: attaindenceupdatedData,
        });
      }
    }
  );
};

exports.stopTime = (req, res) => {
  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");
  attandance
    .find({ $and: [{ studentId: req.params.id }, { date: value }] })
    .then((data) => {
      if (data.length) {
        attandance.findByIdAndUpdate(
          data[0]._id,

          {
            inclassDateTime: now,
            out_of_class: "no",
          },
          { new: true },

          (err, updateTime) => {
            if (err) {
              res.status(404).json({
                message: "please enter correct user id ",
                subErr: err.message,
              });
            } else {
              const studentRecords = new StudentRecords({
                studentId: req.params.id,
                attendence: updateTime._id,
              });
              studentRecords.save();

              res.status(200).json({
                message: "Time Updated successfully",
                data: updateTime,
              });
            }
          }
        );
        // setTimeout(() => clearStopTime(data[0]._id), 180000);
      } else {
        res.status(400).send({ message: "student id not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

function clearTime(id) {
  attandance.findByIdAndUpdate(
    id,

    {
      outclassDateTime: null,
    },
    { new: true },

    (err, updateprofile) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updatedID");
      }
    }
  );
}

function clearStopTime(id) {
  attandance.findByIdAndUpdate(
    id,

    {
      inclassDateTime: null,
    },
    { new: true },

    (err, updateprofile) => {
      if (err) {
        console.log(err);
      } else {
        console.log("updatedID");
      }
    }
  );
}
exports.Update_status = (req, res) => {
  var now = new Date();
  const value = date.format(now, "YYYY-MM-DD");

  console.log(value, "dateeeeeeeee");

  attandance
    // .find({ studentId: req.params.id })
    .find({ $and: [{ studentId: req.params.id }, { date: value }] })
    .then((dat) => {
      console.log(dat);

      if (dat.length) {
        attandance.findByIdAndUpdate(
          dat[0]._id,

          req.body,
          { new: true },

          (err, updateprofile) => {
            if (err) {
              res.status(404).json({
                message: "please enter correct user id ",
                subErr: err.message,
              });
            } else {
              console.log(updateprofile._id);
              Student.findOneAndUpdate(
                { _id: req.params.id },
                {
                  attaindence: updateprofile._id,
                }
              );
              // const studentRecords = new StudentRecords({
              //   studentId: req.params.id,
              //   attendence: updateprofile._id,
              // });
              // studentRecords.save();

              res.status(200).json({
                message: "status Updated successfully",
                updatestatus: updateprofile,
              });
            }
          }
        );
      } else {
        res.status(400).send({ message: "student id not found" });
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.dismiss = (req, res) => {
  var currentTime = req.body.time;
  var new_arr = [];
  for (var i = 0; i < req.body.id.length; i++) {
    new_arr.push(new mongodb.ObjectID(req.body.id[i]));
  }
  Student.updateMany(
    { _id: { $in: new_arr } },
    { dismiss: currentTime },
    { new: true },
    (err, studentupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct student id ",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "dismiss successfully",
          studentupdatedData: studentupdatedData,
        });
      }
    }
  );
};
exports.getCouncellorBYClass = async (req, res) => {
  User.find({ classId: req.params.id })
    .then((result) => {
      res.status(200).send({
        data: result,
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};



exports.getPreviousRecords = async (req, res) =>{

  var id = req.params.id;
  var c = moment().startOf("month").toDate();
  var d = moment().endOf("month").toDate();

  var a = moment().startOf("week").toDate();
  var b = moment().endOf("week").toDate();

  const startOfMonth = date.format(c, "YYYY-MM-DD");
  const endOfMonth = date.format(d, "YYYY-MM-DD");

  const startOfWeek = date.format(a, "YYYY-MM-DD");
  const endOfWeek = date.format(b, "YYYY-MM-DD");

  console.log(req.body.fromDate);
  if (req.body.fromDate && req.body.toDate) {
    const data = await attandance
      .find({
        $and: [
          { classId: id },
          { date: { $lte: req.body.toDate, $gte: req.body.fromDate } },
        ],
      })

      .populate({ path: "studentId", select: ["-attaindence"] })
      .populate({ path: "counsellor_id" })
      .populate({ path: "classId" })

      .then((response) => {
        res.status(200).send({
          data: response,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  }
}


exports.GetStoreData = async (req, res) => {
  const now = new Date();
  //   {
  //     "fromDate":"15/07/22",
  //     "toDate":"16/07/22"
  // }
  var id = req.params.id;
  var c = moment().startOf("month").toDate();
  var d = moment().endOf("month").toDate();

  var a = moment().startOf("week").toDate();
  var b = moment().endOf("week").toDate();

  const startOfMonth = date.format(c, "YYYY-MM-DD");
  const endOfMonth = date.format(d, "YYYY-MM-DD");

  const startOfWeek = date.format(a, "YYYY-MM-DD");
  const endOfWeek = date.format(b, "YYYY-MM-DD");

  console.log(startOfMonth, "idddddd", endOfMonth);
  if (req.body.fromDate && req.body.toDate) {
    const data = await attandance
      .find({
        $and: [
          { classId: id },
          { date: { $lt: req.body.toDate, $gte: req.body.fromDate } },
        ],
      })

      .populate({ path: "studentId", select: ["-attaindence"] })
      .populate({ path: "counsellor_id" })
      .populate({ path: "classId" })

      .then((response) => {
        res.status(200).send({
          data: response,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  }

  if (req.query.date === "week") {
    const data = await attandance
      .find({
        $and: [
          { classId: id },
          {
            date: {
              $gte: startOfWeek,
              $lt: endOfWeek,
            },
          },
        ],
      })
      // .populate({
      //   path: "attendence",
      //   select: { attendence: 1, date: 1 },
      // })
      .populate({ path: "studentId", select: ["-attaindence"] })
      .populate({ path: "counsellor_id" })
      .populate({ path: "classId" })

      .then((response) => {
        res.status(200).send({
          data: response,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } else if (req.query.date === "month") {
    const data = await attandance
      .find({
        $and: [
          { classId: id },
          {
            date: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        ],
      })
      // .populate({
      //   path: "attendence",
      //   select: { attendence: 1, date: 1 },
      // })
      .populate({ path: "studentId", select: ["-attaindence"] })
      .populate({ path: "counsellor_id" })
      .populate({ path: "classId" })

      .then((response) => {
        res.status(200).send({
          data: response,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  }
};
