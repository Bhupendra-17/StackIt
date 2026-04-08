const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const {
  postAnswer,
  upvoteAnswer,
  commentOnAnswer,
} = require("../controllers/answerController");

router.post("/", authMiddleware, postAnswer);
router.post("/:id/upvote", authMiddleware, upvoteAnswer);
router.post("/:id/comment", authMiddleware, commentOnAnswer);

module.exports = router;

