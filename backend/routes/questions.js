const express = require('express');
const router = express.Router();

const {
  createQuestion,
  getAllQuestionsWithAnswers,
  upvoteQuestion // ✅ you must add this
} = require('../controllers/questionController');

const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, createQuestion);
router.get('/all', getAllQuestionsWithAnswers);
router.post('/:id/upvote', authMiddleware, upvoteQuestion); // ✅ safe now

module.exports = router;
