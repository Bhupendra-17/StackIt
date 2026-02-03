import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";
import { questionAPI, answerAPI } from "../../services/api";
import { useAuth } from "../context/AuthContext";

const AnswerForm = ({ onSubmit, isSubmitting }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your answer..."
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={4}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </form>
  );
};

const AnswerItem = ({ answer, onVote, questionId }) => {
  const [expanded, setExpanded] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-gray-800 p-4 rounded-md mb-3">
      <div className="flex items-start gap-3">
        {/* Answer voting */}
        <div className="flex flex-col items-center">
          <button
            onClick={() =>
              isAuthenticated && onVote(questionId, "up", answer._id)
            }
            className={`${isAuthenticated ? "text-gray-400 hover:text-green-500" : "text-gray-600 cursor-not-allowed"}`}
            disabled={!isAuthenticated}
          >
            <ArrowUp size={20} />
          </button>
          <span className="text-gray-300 my-1">
            {answer.upvotes?.length || 0}
          </span>
          <button
            onClick={() =>
              isAuthenticated && onVote(questionId, "down", answer._id)
            }
            className={`${isAuthenticated ? "text-gray-400 hover:text-red-500" : "text-gray-600 cursor-not-allowed"}`}
            disabled={!isAuthenticated}
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Answer content */}
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-sm text-gray-400">
              answered by{" "}
              <span className="text-blue-400">
                {answer.user?.username || "Anonymous"}
              </span>
            </span>
          </div>
          <div
            className={`text-gray-200 prose prose-invert max-w-none ${
              !expanded && answer.content.length > 300 ? "line-clamp-4" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />
          {answer.content.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-500 text-sm mt-1 hover:underline"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const QuestionItem = ({
  question,
  onVote,
  onAnswerSubmit,
  refreshQuestions,
}) => {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleAnswerSubmit = async (content) => {
    setIsSubmittingAnswer(true);
    try {
      await onAnswerSubmit(question._id, content);
      setShowAnswerForm(false);
      // Refresh questions to show new answer
      refreshQuestions();
    } catch (error) {
      console.error("Failed to post answer:", error);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700 w-full mb-6">
      <div className="flex gap-4">
        {/* Question voting */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => isAuthenticated && onVote(question._id, "up")}
            className={`${isAuthenticated ? "text-gray-400 hover:text-green-500" : "text-gray-600 cursor-not-allowed"}`}
            disabled={!isAuthenticated}
          >
            <ArrowUp size={24} />
          </button>
          <span className="text-gray-300 my-1 text-lg">
            {question.upvotes || 0}
          </span>
          <button
            onClick={() => isAuthenticated && onVote(question._id, "down")}
            className={`${isAuthenticated ? "text-gray-400 hover:text-red-500" : "text-gray-600 cursor-not-allowed"}`}
            disabled={!isAuthenticated}
          >
            <ArrowDown size={24} />
          </button>
        </div>

        {/* Question content */}
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">
            {question.title}
          </h3>
          <div
            className="text-gray-300 mb-4 text-base md:text-lg prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />

          {/* Author info */}
          <div className="mb-3">
            <span className="text-sm text-gray-400">
              asked by{" "}
              <span className="text-blue-400">
                {question.user?.username || "Anonymous"}
              </span>
            </span>
          </div>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-sm md:text-base"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Answer button */}
          <div className="border-t border-gray-700 pt-3">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setShowAnswerForm(!showAnswerForm);
                } else {
                  window.location.href = "/login";
                }
              }}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-400"
            >
              <MessageSquare size={16} /> Answer
            </button>
          </div>

          {/* Answer form */}
          {showAnswerForm && (
            <AnswerForm
              onSubmit={handleAnswerSubmit}
              isSubmitting={isSubmittingAnswer}
            />
          )}

          {/* Answers section */}
          {question.answers && question.answers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-white md:text-lg mb-3">
                Answers ({question.answers.length})
              </h4>

              {showAllAnswers ? (
                question.answers.map((answer) => (
                  <AnswerItem
                    key={answer._id}
                    answer={answer}
                    questionId={question._id}
                    onVote={onVote}
                  />
                ))
              ) : (
                <>
                  <AnswerItem
                    answer={question.answers[0]}
                    questionId={question._id}
                    onVote={onVote}
                  />
                  {question.answers.length > 1 && (
                    <button
                      onClick={() => setShowAllAnswers(true)}
                      className="text-blue-500 text-sm mt-2 hover:underline"
                    >
                      Show {question.answers.length - 1} more answer
                      {question.answers.length - 1 > 1 ? "s" : ""}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionAPI.getAllQuestions();
      setQuestions(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleVote = async (questionId, direction, answerId = null) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      if (answerId) {
        // Voting on an answer
        await answerAPI.upvoteAnswer(answerId);
      } else {
        // Voting on a question
        await questionAPI.upvoteQuestion(questionId);
      }
      // Refresh questions to show updated vote counts
      fetchQuestions();
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const handleAnswerSubmit = async (questionId, content) => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    try {
      await answerAPI.postAnswer({
        questionId,
        content,
      });
    } catch (err) {
      console.error("Failed to post answer:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading questions...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-xl">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Recent Questions
            </h1>

            {questions.length === 0 ? (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 text-lg mb-4">
                  No questions yet. Be the first to ask!
                </p>
                <a
                  href="/ask"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition"
                >
                  Ask a Question
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question) => (
                  <QuestionItem
                    key={question._id}
                    question={question}
                    onVote={handleVote}
                    onAnswerSubmit={handleAnswerSubmit}
                    refreshQuestions={fetchQuestions}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
