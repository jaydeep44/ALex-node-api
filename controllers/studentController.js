const Student = require("../models/studentModel");
const attandance = require("../models/attaindence");
const User = require("../models/userModel");
const studentRecod = require("../models/studentRecordModel")
const StudentClass = require("../models/classModel");
const ClassData = require("../models/classModel");
const multer = require("multer");
var mongodb = require("mongodb");
const date = require("date-and-time");
const { forEach, first } = require("lodash");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
exports.upload = multer({ storage: storage });




exports.student_save = async (req, res) => {
  let imagePath;
  if (req.file) {
    imagePath = req.file.path;
  }

  let assignClass;
  if (req.body.assignClass) {
    assignClass = req.body.assignClass;
  }
  const studentSave = new Student({
    name: req.body.name,
    lastName: req.body.lastName,
    fatherName: req.body.fatherName,
    DOB: req.body.DOB,
    image: imagePath,
    address: req.body.address,
    assignClass: assignClass,
    medical: req.body.medical,
    emergency: JSON.parse(req.body.emergency),
  });
  await studentSave
    .save()
    .then((response) => {
      res.status(200).send(response);

      const studentrecord = new studentRecod({
        student: response._id,
      });
      studentrecord
        .save().then((result)=>{
         console.log(result,"result")
        }).catch((err)=>{
          console.log(err,"result")

        })
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};




exports.Update_Student = (req, res) => {
  var image;
  if (req.file) {
    image = req.file.path;
  }

  Student.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      lastName: req.body.lastName,
      fatherName: req.body.fatherName,
      DOB: req.body.DOB,
      image: image,
      address: req.body.address,
      assignClass: req.body.assignClass,
      medical: req.body.medical,
      emergency: JSON.parse(req.body.emergency),
    },
    { new: true },
    (err, studentupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct student id ",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "Student Updated successfully",
          studentupdatedData: studentupdatedData,
        });
      }
    }
  );
};
exports.getAllStudentRecords = async (req, res) => {
  // const countryCount = await countryModel.countDocuments();
  // const country = await studentRecod.find().populate('student').populate('attaindence');
  try {
    await studentRecod.find().populate('student',"-attaindence").populate({path:'attaindence',   match: { date: { $lte: req.query.toDate, $gte: req.query.fromDate } }}).then((result)=>{
      res.status(200).json({
        studentRecords: result,
      });
    }).catch((err)=>{
      res.json({ error: err.message || err.toString() });

    })
   
  } catch (err) {
    res.json({ error: err.message || err.toString() });
  }
};



exports.uploadcsv = async (req, res, next) => {


    try {
  
      //convert csvfile to jsonArray
      var data = req.body.array;
      
      for (my in data) {
        const em = [
          {
            Ename: data[my].emergency_name_1,
            number: data[my].emergency_num_1,
          },
          {
            Ename: data[my].emergency_name_2,
            number: data[my].emergency_num_2,
          },
          {
            Ename: data[my].emergency_name_3,
            number: data[my].emergency_num_3,
          },
          {
            Ename: data[my].emergency_name_4,
            number: data[my].emergency_num_4,
          },
          {
            Ename: data[my].emergency_name_5,
            number: data[my].emergency_num_5,
          },
          {
            Ename: data[my].emergency_name_6,
            number: data[my].emergency_num_6,
          },
          {
            Ename: data[my].emergency_name_7,
            number: data[my].emergency_num_7,
          },
        ];
  
        const bulk = em.filter((i) => i.Ename !== undefined);
        data[my].emergency = bulk;
      }
      for (k in data) {
        
      //  ClassData.find({className:data[k].assignClass}).then((result)=>{
      //   console.log(result,"result")
      //   if(result.length >0){
      //     const j= result.filter(i=>i.assignClass !== data[k].assignClass)
      //     const d = j[0]
      //     console.log(j[0].className,"resssssssssssssssssssssssssss")
      //     const z= data.filter(h=>  h.assignClass!=  d.className)
      //         for(i=0; i<z.length; i++){
      //           const studentSave = new StudentClass({
      //             className:z[i].assignClass
      //           });
      //           studentSave
      //             .save()
      //             .then((response) => {
      //             console.log(response,"response")
      //             })
  
      //         }
  
    //    }
         
  
                
  
      //  })
  
  
        let f = await ClassData.find({ className: data[k].assignClass });
  
        console.log(f,"fffffffffffff")
        const j = f.filter((i) => i.className === data[k].assignClass);
        j.map((h) => {
          data[k].assignClass = h._id;
        });
      }
      await Student.insertMany(data)
        .then((response) => {
          res.status(200).json({
            bulk: response,
          });
        })
        .catch((err) => {
          res.status(404).json({
            message: "OOPS Something wents wrong ",
            err,
          });
        });
    } catch {
      res.status(404).json({
        message: "OOPS Something wents wrong ",
      });
    }
  };
  
    
    

exports.FilterStudent = async (req, res) => {
  Student.find({ assignClass: req.params.key })
    .populate("assignClass")
    .then((result) => {
      res.status(400).json({
        Message: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        Message: err,
      });
    });
};

exports.DeleteStudent = async (req, res) => {
  const id = req.body.id;
  const deletedCourses = await Student.deleteMany({ _id: { $in: req.body.id } })
    .then((data) => {
      if (data.deletedCount === 0) {
        res.status(400).json({
          Message: "Id was not found",
        });
      } else {

        res.send(data);
        attandance.deleteMany({studentId:req.body.id}).then((result)=>{
console.log(result)
      })
      }
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.Get_Student = async (req, res) => {


  console.log("hellooooo")
  const now = new Date();
  const value = date.format(now, "YYYY-MM-DD");
  const totalpresent = [];
  const totalabsent = [];
  if(now.toLocaleTimeString() >= "09:30:10"){
    console.log("right")

  }
  console.log(now.toLocaleTimeString(),"nowww")
  const outOfClass = [];

  const student = await Student.find()
    .populate("assignClass")
    .populate("attaindence", null, { date: { $in: [value] } });
    
    for (i = 0; i < student.length; i++) {
    if (!student[i].attaindence) {
      var attaind = {
        studentId: student[i]._id,
        date: value,
        attendence: null,
       classId: student[i].assignClass?._id,
      };
      const attainds = await attandance.create(attaind);
      // console.log("attainds",attainds)

      await Student.findByIdAndUpdate(
        student[i]._id,
        { attaindence: attainds._id },
        { new: true }
      )
        .then((h) => {
          console.log("initialdddddddddddddddddddddd", h);
        })
        .catch((err) => {
          console.log("initialdddddddddd", err);
        });


      
    }
  }



  await attandance.find({ date: value }).then((data) => {
    if (data) {
      let dataa = data.filter((e) => e.attendence === "1");
      let dataa2 = data.filter((e) => e.attendence === "0");

      let outofClass1 = data.filter((e) => e.out_of_class === "in Rest Room");
      let outofClass2 = data.filter(
        (e) => e.out_of_class === "in Front Office"
      );
      let outofClass3 = data.filter((e) => e.out_of_class === "in Camp");
      const outOfClasss =
        outofClass1.length + outofClass2.length + outofClass3.length;
      outOfClass.push(outOfClasss);
      totalpresent.push(dataa.length);
      totalabsent.push(dataa2.length);
    }
  });
  let totalcount = await Student.countDocuments();

  Student.find()
    .populate("attaindence", null, { date: { $in: value } })

    .populate("assignClass")

    .then((data) => {
      res.status(200).send({
        data: data,
        totalcount: totalcount,
        totalpresent: totalpresent[0],
        totalabsent: totalabsent[0],
        totalout: outOfClass[0],
      });
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.get_stu = async (req, res) => {
  const now = new Date();
  const absent = 0;
  const present = 0;

  const id = [];
  const value = date.format(now, "YYYY-MM-DD");
  // const totalabsent = [];
  const outOfClass = [];

  const data = await User.findById(req.params.id);
  const student = await Student.find({ assignClass: data.classId })
    .populate("assignClass")
    .populate("attaindence", null, { date: { $in: [value] } });

  for (i = 0; i < student.length; i++) {
    if (!student[i].attaindence) {
      var attaind = {
        studentId: student[i]._id,
        counsellor_id: req.params.id,
        date: value,
        attendence: null,
        classId: data.classId,
      };
      const attainds = await attandance.create(attaind);
      console.log("attainds", attainds);

      await Student.findByIdAndUpdate(
        student[i]._id,
        { attaindence: attainds._id },
        { new: true }
      )
        .then((h) => {
          console.log("initialdddddddddddddddddddddd", h);
        })
        .catch((err) => {
          console.log("initialdddddddddd", err);
        });
    }
  }

  await Student.find({ assignClass: data.classId })
    .populate("assignClass")
    .populate("attaindence", null, { date: { $in: [value] } })
    .then((a) => {
      let dismiss = a.filter((e)=>e.dismiss !== null)
      console.log(dismiss.length,"dismiss")
      let absent = a.filter((e) => e.attaindence.attendence === "0");
      let present = a.filter((e) => e.attaindence.attendence === "1");
      let outofClass1 = a.filter(
        (e) => e.attaindence.out_of_class === "in Rest Room"
      );
      let outofClass2 = a.filter(
        (e) => e.attaindence.out_of_class === "in Front Office"
      );
      let outofClass3 = a.filter(
        (e) => e.attaindence.out_of_class === "in Camp"
      );
      console.log(outofClass2, "outofclass");
      const outOfClasss =
        outofClass1.length + outofClass2.length + outofClass3.length;

      res.status(200).send({
        data: a,
        totalcount: a.length,
        totalpresent: present.length,
        totalabsent: absent.length,
        totalout: outOfClasss,
        dismissCount:dismiss.length
      });
    })
    .catch((err) => {
      console.log(err, "aaaacsacsdcscaa");
    });
};

exports.Get_student_by_id = async (req, res) => {
  const id = req.params.id;
  Student.find({ _id: id })

    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
};

exports.update_Many = async (req, res, next) => {
  var new_arr = [];
  for (var i = 0; i < req.body.id.length; i++) {
    new_arr.push(new mongodb.ObjectID(req.body.id[i]));
  }
  Student.updateMany(
    { _id: { $in: new_arr } },
    { assignClass: req.body.assignClass },
    { new: true },
    (err, studentupdatedData) => {
      if (err) {
        res.status(404).json({
          message: "please enter correct student id ",
          subErr: err.message,
        });
      } else {
        res.status(200).json({
          updated_user: "Student Updated successfully",
          studentupdatedData: studentupdatedData,
        });
        next();
      }
    }
  );
};

exports.search_Student = async (req, res) => {
  let student = await Student.find({
    $or: [
      {
        name: { $regex: req.params.key },
      },
    ],
  }).populate("assignClass");
  if (student.length <= 0) {
    res.status(400).send({
      message: "no records found",
    });
  } else {
    res.send({ data: student });
  }
};
