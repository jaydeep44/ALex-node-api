const Pin = require("../models/pinModel");
const bcrypt = require("bcrypt");

exports.CreatePin = async (req, res) => {
 
  const body = req.body;
  const newUser = new Pin(body);
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newUser.pin, salt);

    newUser.pin = hash;
    await newUser
    .save()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send({ message: err.message });
    });
  
};

exports.UpdatePin = async (req, res) => {
  const { oldPin, newPin, confirmPin } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(newPin, salt);
  const userId = await Pin.find({ userId: req.params.id });
  // console.log(userId[0].pin, "userId");
  const isMatch = await bcrypt.compare(oldPin, userId[0].pin);
  console.log(isMatch, "isMatch");
  if (!isMatch) {
    return res.status(400).json({
      message: "OLdpin is incorrect",
    });
  }else if(oldPin===newPin){
    return res.status(400).json({
      message: "oldPin and new Pin both are not same",
    });
  } else if (newPin !== confirmPin) {
    return res.status(400).json({
      message: "ConfirmPin is incorrect",
    });
  } else {
    Pin.findByIdAndUpdate(
      userId[0]._id,
      {
        pin: hash,
      },
      { new: true },
      (err, userupdatedData) => {
        if (err) {
          res.status(404).json({
            message: "please enter correct userId ",
            subErr: err.message,
          });
        } else {
          res.status(200).json({
            message: "pin Updated successfully",
            userupdatedData: userupdatedData,
          });
        }
      }
    );
  }
};

exports.varifyPin = async (req, res) => {
  await Pin.find()
    .then((result) => {
      console.log(result[0].pin);
      bcrypt.compare(req.body.pin, result[0].pin, (err, result) => {
        if (!result) {
          return res.status(400).json({
            message: "pin is incorrect",
          });
        }
        if (result) {
          res.status(200).json({
            message: "pin varification confirm",
          });
        }
      });
    })
    .catch((err) => {
      res.status(404).json({
        subErr: err.message,
      });
    });
};
