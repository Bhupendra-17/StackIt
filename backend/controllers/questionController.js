const mongoose = require("mongoose");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const { sanitizeHtml, hasMeaningfulContent } = require("../utils/sanitizeHtml");

const MAX_TITLE_LENGTH = 150;
const MAX_TAGS = 5;

const normalizeTags = (tags = []) => {
  if (!Array.isArray(tags)) {
    return [];
  }

  const normalized = tags
    .map((tag) => String(tag || "").trim().toLowerCase())
    .filter(Boolean)
    .slice(0, MAX_TAGS);

  return [...new Set(normalized)];
};

const buildFilter = ({ search, tag }) => {
  const filter = {};

  if (tag) {
    filter.tags = String(tag).trim().toLowerCase();
  }

  if (search) {
    const pattern = String(search).trim();
    filter.$or = [
      { title: { $regex: pattern, $options: "i" } },
      { description: { $regex: pattern, $options: "i" } },
      { tags: { $regex: pattern, $options: "i" } },
    ];
  }

  return filter;
};

const mapAnswer = (answerDoc, viewerId = null) => {
  const upvoters = answerDoc.upvotes || [];

  return {
    ...answerDoc.toObject(),
    upvotes: upvoters.length,
    upvoteCount: upvoters.length,
    hasUpvoted: viewerId
      ? upvoters.some((id) => id.toString() === viewerId.toString())
      : false,
  };
};

const mapQuestion = (questionDoc, answers = [], viewerId = null) => {
  const upvoters = questionDoc.upvotes || [];

  return {
    ...questionDoc.toObject(),
    upvotes: upvoters.length,
    upvoteCount: upvoters.length,
    answerCount: answers.length,
    hasUpvoted: viewerId
      ? upvoters.some((id) => id.toString() === viewerId.toString())
      : false,
    answers,
  };
};

const sortQuestions = (questions, sortBy) => {
  const normalizedSort = String(sortBy || "newest").toLowerCase();

  if (normalizedSort === "oldest") {
    return questions.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
  }

  if (normalizedSort === "votes") {
    return questions.sort((a, b) => b.upvoteCount - a.upvoteCount);
  }

  if (normalizedSort === "unanswered") {
    return questions
      .filter((question) => question.answerCount === 0)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const createQuestion = async (req, res, next) => {
  try {
    const title = String(req.body.title || "").trim();
    const description = sanitizeHtml(req.body.description || "");
    const tags = normalizeTags(req.body.tags);

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (title.length > MAX_TITLE_LENGTH) {
      return res
        .status(400)
        .json({ message: `Title cannot exceed ${MAX_TITLE_LENGTH} characters` });
    }

    if (!hasMeaningfulContent(description)) {
      return res
        .status(400)
        .json({ message: "Description must include meaningful content" });
    }

    const question = await Question.create({
      title,
      description,
      tags,
      user: req.user.id,
    });

    const populatedQuestion = await Question.findById(question._id).populate(
      "user",
      "username email",
    );

    res.status(201).json({
      success: true,
      question: mapQuestion(populatedQuestion, [], req.user.id),
    });
  } catch (err) {
    next(err);
  }
};

const getAllQuestionsWithAnswers = async (req, res, next) => {
  try {
    const filter = buildFilter({
      search: req.query.search,
      tag: req.query.tag,
    });

    const questions = await Question.find(filter)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    const questionIds = questions.map((question) => question._id);

    const answers = await Answer.find({ question: { $in: questionIds } })
      .populate("user", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 });

    const answersByQuestionId = answers.reduce((acc, answerDoc) => {
      const key = answerDoc.question.toString();
      const value = mapAnswer(answerDoc, req.user?.id);
      acc[key] = acc[key] ? [...acc[key], value] : [value];
      return acc;
    }, {});

    const data = questions.map((questionDoc) => {
      const mappedAnswers = answersByQuestionId[questionDoc._id.toString()] || [];
      return mapQuestion(questionDoc, mappedAnswers, req.user?.id);
    });

    const sortedData = sortQuestions(data, req.query.sort);

    res.status(200).json({
      success: true,
      count: sortedData.length,
      questions: sortedData,
    });
  } catch (err) {
    next(err);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid question id" });
    }

    const question = await Question.findById(req.params.id).populate(
      "user",
      "username email",
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answers = await Answer.find({ question: question._id })
      .populate("user", "username email")
      .populate("comments.user", "username email")
      .sort({ createdAt: -1 });

    const payload = mapQuestion(
      question,
      answers.map((answerDoc) => mapAnswer(answerDoc, req.user?.id)),
      req.user?.id,
    );

    res.status(200).json({
      success: true,
      question: payload,
    });
  } catch (err) {
    next(err);
  }
};

const upvoteQuestion = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid question id" });
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const userId = req.user.id;
    const existingIndex = question.upvotes.findIndex(
      (id) => id.toString() === userId,
    );

    let hasUpvoted = false;

    if (existingIndex >= 0) {
      question.upvotes.splice(existingIndex, 1);
      hasUpvoted = false;
    } else {
      question.upvotes.push(userId);
      hasUpvoted = true;
    }

    await question.save();

    res.json({
      success: true,
      upvotes: question.upvotes.length,
      upvoteCount: question.upvotes.length,
      hasUpvoted,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createQuestion,
  getAllQuestionsWithAnswers,
  getQuestionById,
  upvoteQuestion,
};

