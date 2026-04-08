const mongoose = require("mongoose");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const Notification = require("../models/Notification");
const { sanitizeHtml, hasMeaningfulContent } = require("../utils/sanitizeHtml");

const emitNotification = (io, userId, payload) => {
  if (!io || !userId) {
    return;
  }

  io.to(`user:${userId}`).emit("notification", payload);
};

const createNotification = async ({ recipient, type, message, link }) => {
  if (!recipient) {
    return null;
  }

  return Notification.create({
    recipient,
    type,
    message,
    link,
  });
};

exports.postAnswer = async (req, res, next) => {
  try {
    const questionId = req.body.questionId;
    const content = sanitizeHtml(req.body.content || "");

    if (!questionId || !mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "A valid questionId is required" });
    }

    if (!hasMeaningfulContent(content)) {
      return res.status(400).json({ message: "Answer content is required" });
    }

    const question = await Question.findById(questionId).populate("user", "username");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = await Answer.create({
      content,
      question: questionId,
      user: req.user.id,
    });

    const populatedAnswer = await Answer.findById(answer._id)
      .populate("user", "username email")
      .populate("comments.user", "username email");

    const io = req.app.get("io");

    if (question.user && question.user._id.toString() !== req.user.id) {
      const notification = await createNotification({
        recipient: question.user._id,
        type: "answer",
        message: `${req.user.username} answered your question`,
        link: `/?question=${questionId}`,
      });

      emitNotification(io, question.user._id.toString(), {
        id: notification?._id,
        type: "answer",
        message: `${req.user.username} answered your question`,
        link: `/?question=${questionId}`,
        createdAt: notification?.createdAt || new Date(),
      });
    }

    res.status(201).json({
      success: true,
      answer: {
        ...populatedAnswer.toObject(),
        upvotes: 0,
        upvoteCount: 0,
        hasUpvoted: false,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.upvoteAnswer = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid answer id" });
    }

    const answer = await Answer.findById(req.params.id).populate("user", "username");
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const userId = req.user.id;
    const existingIndex = answer.upvotes.findIndex((id) => id.toString() === userId);

    let hasUpvoted = false;

    if (existingIndex >= 0) {
      answer.upvotes.splice(existingIndex, 1);
      hasUpvoted = false;
    } else {
      answer.upvotes.push(userId);
      hasUpvoted = true;
    }

    await answer.save();

    if (
      hasUpvoted &&
      answer.user &&
      answer.user._id &&
      answer.user._id.toString() !== userId
    ) {
      const io = req.app.get("io");
      const notification = await createNotification({
        recipient: answer.user._id,
        type: "upvote",
        message: `${req.user.username} upvoted your answer`,
        link: `/?question=${answer.question.toString()}`,
      });

      emitNotification(io, answer.user._id.toString(), {
        id: notification?._id,
        type: "upvote",
        message: `${req.user.username} upvoted your answer`,
        link: `/?question=${answer.question.toString()}`,
        createdAt: notification?.createdAt || new Date(),
      });
    }

    res.json({
      success: true,
      upvotes: answer.upvotes.length,
      upvoteCount: answer.upvotes.length,
      hasUpvoted,
    });
  } catch (err) {
    next(err);
  }
};

exports.commentOnAnswer = async (req, res, next) => {
  try {
    const content = sanitizeHtml(req.body.content || "");

    if (!hasMeaningfulContent(content)) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid answer id" });
    }

    const answer = await Answer.findById(req.params.id)
      .populate("user", "username")
      .populate("question", "_id");

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    answer.comments.push({
      user: req.user.id,
      content,
    });

    await answer.save();

    const updatedAnswer = await Answer.findById(answer._id)
      .populate("user", "username email")
      .populate("comments.user", "username email");

    if (answer.user && answer.user._id.toString() !== req.user.id) {
      const io = req.app.get("io");
      const notification = await createNotification({
        recipient: answer.user._id,
        type: "comment",
        message: `${req.user.username} commented on your answer`,
        link: `/?question=${answer.question._id.toString()}`,
      });

      emitNotification(io, answer.user._id.toString(), {
        id: notification?._id,
        type: "comment",
        message: `${req.user.username} commented on your answer`,
        link: `/?question=${answer.question._id.toString()}`,
        createdAt: notification?.createdAt || new Date(),
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      answer: {
        ...updatedAnswer.toObject(),
        upvotes: updatedAnswer.upvotes.length,
        upvoteCount: updatedAnswer.upvotes.length,
        hasUpvoted: updatedAnswer.upvotes.some(
          (id) => id.toString() === req.user.id,
        ),
      },
    });
  } catch (err) {
    next(err);
  }
};

