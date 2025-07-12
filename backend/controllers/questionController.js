const Question = require('../models/Question');
const Answer = require('../models/Answer');

// ✅ Create Question
const createQuestion = async (req, res) => {
  const { title, description, tags } = req.body;

  try {
    const question = new Question({
      title,
      description,
      tags,
      user: req.user.id,
    });

    const saved = await question.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Questions with Answers
const getAllQuestionsWithAnswers = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });

    const data = await Promise.all(
      questions.map(async (q) => {
        const answers = await Answer.find({ question: q._id })
          .populate('user', 'email')
          .sort({ createdAt: -1 });

        return {
          ...q._doc,
          upvotes: q.upvotes?.length || 0,
          answers,
        };
      })
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Upvote a Question
const upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) return res.status(404).json({ message: 'Question not found' });

    const userId = req.user.id;

    // Toggle upvote
    if (question.upvotes.includes(userId)) {
      question.upvotes.pull(userId);
    } else {
      question.upvotes.push(userId);
    }

    await question.save();
    res.json({ upvotes: question.upvotes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Export all functions together
module.exports = {
  createQuestion,
  getAllQuestionsWithAnswers,
  upvoteQuestion, // ✅ include this here
};
