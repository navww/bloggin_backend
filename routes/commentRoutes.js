const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/blogs/:id/comments",
  authMiddleware,
  commentController.addComment
);

router.get(
  "/blogs/:id/comments",
  authMiddleware,
  commentController.getComments
);

router.put(
  "/comments/:commentId",
  authMiddleware,
  commentController.editComment
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;
