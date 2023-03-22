const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

module.exports = function connection() {
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error: "));
  db.once("connected", () => {
    console.log("Connected successfully");
  });
};
