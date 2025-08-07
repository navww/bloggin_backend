const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get(
  "/currentUserDetails",
  authMiddleware,
  userController.currentUserDetails
);

module.exports = router;
