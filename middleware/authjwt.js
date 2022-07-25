const jwt = require("jsonwebtoken");
const secrte = process.env.LOGINKEY;
exports.verifyToken = (req, res, next) => {
  // try {
  //   const token = req.headers.authorization.split(" ")[1];
  //   const verify = jwt.verify(token, secrte);
  //   console.log(verify);
  //   next();
  // } catch {
  //   res.status(404).json({
  //     msg: "Token is required",
  //   });
  // }
  try {
    var token;
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const token = bearerHeader.split(" ")[1];
      const decode = jwt.decode(token);
      const expire = decode.exp * 1000;
      if (expire < new Date().getTime()) {
        res.status(400).send({
          message: "token expired !",
        });
      } else {
        next();
      }
    } else {
      // Forbidden
      res.status(403).send({
        message: "token is required !",
      });
    }
  } catch (error) {
    res.status(400).send({
      message: "invalid Token",
      subError: error,
    });
  }
};
