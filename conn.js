const mongooes = require("mongoose");
const URL =
  "mongodb+srv://dbUser:dbPassword@cluster0.onkep.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const DatabaseConn = async () => {
  await mongooes.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("db connect");
};0

module.exports = DatabaseConn;
