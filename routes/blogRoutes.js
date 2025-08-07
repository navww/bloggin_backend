const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create-blogs", authMiddleware, blogController.createBlog);
router.get("/my-blogs", authMiddleware, blogController.getMyBlogs);
router.post("/follow/:id", authMiddleware, blogController.followUser);
router.post("/unfollow/:id", authMiddleware, blogController.unfollowUser);
router.get("/getMyFeed", authMiddleware, blogController.getMyFeed);
router.get("/getAllBlogs", authMiddleware, blogController.getAllBlogsWithUser);

module.exports = router;
