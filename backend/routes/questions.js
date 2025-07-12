const express = require('express');
const router = express.Router();

const {
  createQuestion,
  getAllQuestionsWithAnswers,
  upvoteQuestion
} = require('../controllers/questionController');

const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload'); // ✅ multer config

// ✅ Use upload.single for image upload
router.post('/', authMiddleware, upload.single('image'), createQuestion);
router.get('/all', getAllQuestionsWithAnswers);
router.post('/:id/upvote', authMiddleware, upvoteQuestion);

module.exports = router;
