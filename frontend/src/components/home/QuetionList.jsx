// components/QuestionList.jsx
import React, { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";

const QuestionList = ({ questions, onVote, onAnswerSubmit }) => {
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onVote={onVote}
          onAnswerSubmit={onAnswerSubmit}
        />
      ))}
    </div>
  );
};

// Nested QuestionItem component
const QuestionItem = ({ question, onVote, onAnswerSubmit }) => {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700 w-full mb-6">
      <div className="flex gap-4">
        {/* Voting buttons */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => onVote(question.id, "up")}
            className="text-gray-400 hover:text-green-500"
          >
            <ArrowUp size={24} />
          </button>
          <span className="text-gray-300 my-1 text-lg">
            {question.votes || 0}
          </span>
          <button
            onClick={() => onVote(question.id, "down")}
            className="text-gray-400 hover:text-red-500"
          >
            <ArrowDown size={24} />
          </button>
        </div>

        {/* Question content */}
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">
            {question.title}
          </h3>
          <p className="text-gray-300 mb-4 text-base md:text-lg">
            {question.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-700 text-gray-200 rounded text-sm md:text-base"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Answer button */}
          <div className="border-t border-gray-700 pt-3">
            <button
              onClick={() => setShowAnswerForm(!showAnswerForm)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-400"
            >
              <MessageSquare size={16} /> Answer
            </button>
          </div>

          {/* Answer form */}
          {showAnswerForm && (
            <AnswerForm
              onSubmit={(content) => {
                onAnswerSubmit(question.id, content);
                setShowAnswerForm(false);
              }}
            />
          )}

          {/* Answers list */}
          {question.answers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-white md:text-lg mb-3">
                Answers ({question.answers.length})
              </h4>

              {showAllAnswers ? (
                question.answers.map((answer) => (
                  <AnswerItem
                    key={answer.id}
                    answer={answer}
                    onVote={(answerId, direction) =>
                      onVote(question.id, direction, answerId)
                    }
                  />
                ))
              ) : (
                <>
                  <AnswerItem
                    answer={question.answers[0]}
                    onVote={(answerId, direction) =>
                      onVote(question.id, direction, answerId)
                    }
                  />
                  {question.answers.length > 1 && (
                    <button
                      onClick={() => setShowAllAnswers(true)}
                      className="text-blue-500 text-sm mt-2 hover:underline"
                    >
                      Show {question.answers.length - 1} more answers
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

// Nested AnswerForm component
const AnswerForm = ({ onSubmit }) => {
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
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Post Answer
        </button>
      </div>
    </form>
  );
};

// Nested AnswerItem component
const AnswerItem = ({ answer, onVote }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800 p-4 rounded-md mb-3">
      <div className="flex items-start gap-3">
        {/* Voting buttons */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => onVote(answer.id, "up")}
            className="text-gray-400 hover:text-green-500"
          >
            <ArrowUp size={20} />
          </button>
          <span className="text-gray-300 my-1">{answer.votes}</span>
          <button
            onClick={() => onVote(answer.id, "down")}
            className="text-gray-400 hover:text-red-500"
          >
            <ArrowDown size={20} />
          </button>
        </div>

        {/* Answer content */}
        <div className="flex-1">
          <p
            className={`text-gray-200 ${
              !expanded && answer.content.length > 200 ? "line-clamp-3" : ""
            }`}
          >
            {answer.content}
          </p>
          {answer.content.length > 200 && (
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

export default QuestionList;
