require("dotenv").config();

const express = require("express");
const cors = require("cors");
const databaseConnection = require("./config/databaseConnection.js");
const cookieParser = require("cookie-parser");

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.REACT_APP_FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api's
app.get("/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Test route is working"
    })
})
app.use("/api", require("./routes/blogRoutes.js"));
app.use("/api", require("./routes/userRoutes.js"));

databaseConnection();

module.exports = app;
