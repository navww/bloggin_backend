const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.registerUser = async (req, res) => {
  console.log("register", req.body);

  try {
    const { username, email, password, phone_no } = req.body || {};
    if (!username || !email || !password || !phone_no) {
      return res
        .status(400)
        .json({ error: "All fields including phone_no are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone_no,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send({
        message: "Registration Successful",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
  } catch (err) {
    console.log("Register Error: ", err.message);
    res.status(500).send({ message: err.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .send({ token: token, message: "Login Successful", user: user });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Something Happened Try again Later" });
  }
};

exports.currentUserDetails = async (req, res) => {
  console.log("req.user", req.user);
  try {
    return res
      .status(200)
      .send({ data: req.user, message: "User Details Fetched Successfully" });
  } catch (error) {
    console.log("error");
  }
};
