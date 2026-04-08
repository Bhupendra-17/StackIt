const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getAllQuestionsWithAnswers,
  getQuestionById,
  upvoteQuestion,
} = require("../controllers/questionController");

const authMiddleware = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

router.post("/", authMiddleware, createQuestion);
router.get("/all", optionalAuth, getAllQuestionsWithAnswers);
router.get("/:id", optionalAuth, getQuestionById);
router.post("/:id/upvote", authMiddleware, upvoteQuestion);

module.exports = router;

