const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config/.env",
});

const databaseConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Connected to mongoDB");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = databaseConnection;
