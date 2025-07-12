const express = require('express');
const router = express.Router();
const { postAnswer } = require('../controllers/answerController');
const authMiddleware = require('../middleware/auth'); // 
const { upvoteAnswer, commentOnAnswer } = require('../controllers/answerController');

router.post('/', authMiddleware, postAnswer);
router.post('/:id/upvote', authMiddleware, upvoteAnswer);
router.post('/:id/comment', authMiddleware, commentOnAnswer);

module.exports = router;
