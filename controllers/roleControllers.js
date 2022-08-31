const Role = require("../models/roleModel");
const StudentClass = require("../models/classModel");
const Emergency = require("../models/emergencynoModel");

exports.Roles = async (req, res) => {
  var body = req.body;
  console.log(body);
  if (Object.keys(body).length === 0 && body.constructor === Object) {
    res.status(400).send({ message: "data not proper formated..." });
  }
  // console.log("body = ", body)
  const roleDetails = new Role(body);
  await roleDetails
    .save()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.Emergency_no = async (req, res) => {
  var body = req.body;

  // console.log("body = ", body)
  const emergency = new Emergency(body);
  await emergency
    .save()
    .then((response) => {
      res.status(200).send({ data: response });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};
exports.GetEmergency_no = async (req, res) => {
  const data = await Emergency.find()
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

exports.studentClassCreate = async (req, res) => {
  const str1 = req.body.className;

  if (str1.startsWith("class")) {
    await StudentClass.find({ className: req.body.className }).then((data) => {
      if (data.length > 0) {
        res.status(400).send({ message: "class already exists" });
      } else {
        const studentSave = new StudentClass({
          className: req.body.className,
        });
        studentSave
          .save()
          .then((response) => {
            res.status(200).send({
              message: "class create successfully",
              data: response,
            });
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      }
    });
  } else {
    res.status(400).send({ message: "class name start with class" });
  }
};
exports.Get_Class = async (req, res) => {
  const data = await StudentClass.find()
    .then((response) => {
      res.status(200).send({ data: response });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};


exports.Update_class = (req, res) => {
  
  
const a = StudentClass.find({className:req.body.className}).then((result)=>{
  if(result.length>0){
    res.status(400).json({
      message: "class already exists",
    });
  }else{

        const user = StudentClass.findByIdAndUpdate(
          req.params.id,
          {
            className: req.body.className,
          
          },
    
          { new: true },
          (err, userupdatedData) => {
            if (err) {
              res.status(404).json({
                message: "please enter correct class id ",
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
  } 
}) 
};



exports.search_Class = async (req, res) => {
  let student = await StudentClass.find({
    $or: [
      {
        className: { $regex: req.params.key || "", $options:'i' },
      },
    ],
  })
  if (student.length <= 0) {
    res.status(400).send({
      message: "no records found",
    });
  } else {
    res.send({ data: student });
  }
};