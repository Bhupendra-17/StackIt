const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');

exports.postAnswer = async (req, res) => {
  const { content, questionId } = req.body;
  const io = req.app.get('io'); // Get socket instance

  try {
    const answer = new Answer({
      content,
      question: questionId,
      user: req.user.id,
    });

    const saved = await answer.save();

    // Fetch question to get question owner's ID
    const question = await Question.findById(questionId).populate('user');

    if (question && question.user._id.toString() !== req.user.id) {
      // Save notification to DB
      const notif = new Notification({
        recipient: question.user._id,
        type: 'answer',
        message: `${req.user.username} answered your question`,
        link: `/questions/${questionId}`,
      });
      await notif.save();

      // Emit notification via socket
      io.emit(`notify:${question.user._id}`, {
        message: notif.message,
        link: notif.link,
        type: notif.type,
        time: notif.createdAt,
      });
    }

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.upvoteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    const userId = req.user.id;

    if (answer.upvotes.includes(userId)) {
      answer.upvotes.pull(userId);
    } else {
      answer.upvotes.push(userId);
    }

    await answer.save();
    res.json({ upvotes: answer.upvotes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.commentOnAnswer = async (req, res) => {
  const { content } = req.body;

  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });

    answer.comments.push({
      user: req.user.id,
      content,
    });

    await answer.save();
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
