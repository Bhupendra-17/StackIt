import React, { useState } from "react";
import Layout from "../layout/Layout";
import { ArrowUp, ArrowDown, MessageSquare } from "lucide-react";

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

const AnswerItem = ({ answer, onVote }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800 p-4 rounded-md mb-3">
      <div className="flex items-start gap-3">
        {/* Answer voting */}
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

const QuestionItem = ({ question, onVote, onAnswerSubmit }) => {
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  return (
    <div className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700 w-full mb-6">
      <div className="flex gap-4">
        {/* Question voting */}
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

          {/* Answers section */}
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

const HomePage = () => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "How to use React hooks?",
      description:
        "I'm new to React and I want to understand how to use hooks properly. Can someone explain with an example?",
      tags: ["React", "Hooks", "JavaScript", "Frontend"],
      votes: 15,
      answers: [
        {
          id: 1,
          content:
            "React hooks are functions that let you use state and other React features without writing a class. For example, useState is used to add state to functional components. You can use it like this: 'const [count, setCount] = useState(0)'. This gives you a state variable 'count' and a function 'setCount' to update it. Other common hooks include useEffect for side effects, useContext for context API, and useReducer for more complex state logic.",
          votes: 8,
        },
      ],
    },
    {
      id: 2,
      title: "What is JWT and how does it work in modern web applications?",
      description:
        "I'm trying to understand JSON Web Tokens and their role in authentication. Can someone explain this in simple terms with examples of how it's implemented in a typical MERN stack application?",
      tags: ["JWT", "Authentication", "Security", "MERN"],
      votes: 12,
      answers: [
        {
          id: 2,
          content:
            "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. In web applications, JWTs are commonly used for authentication. After a user logs in with their credentials, the server generates a JWT that contains user information (claims) and sends it back to the client. The client then includes this token in subsequent requests, typically in the Authorization header. The server verifies the token's signature to ensure it hasn't been tampered with before granting access to protected resources. In a MERN stack, you'd typically use libraries like jsonwebtoken on the Node.js backend and store the token in localStorage or cookies on the React frontend.",
          votes: 5,
        },
        {
          id: 3,
          content:
            "Additionally, JWTs consist of three parts: header, payload, and signature. The header typically consists of the token type and the signing algorithm. The payload contains the claims which are statements about an entity (typically the user) and additional data. The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.",
          votes: 3,
        },
      ],
    },
  ]);

  const handleVote = (questionId, direction, answerId = null) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        if (question.id === questionId) {
          if (answerId) {
            // Voting on an answer
            const updatedAnswers = question.answers.map((answer) => {
              if (answer.id === answerId) {
                return {
                  ...answer,
                  votes:
                    direction === "up" ? answer.votes + 1 : answer.votes - 1,
                };
              }
              return answer;
            });
            return { ...question, answers: updatedAnswers };
          } else {
            // Voting on the question
            return {
              ...question,
              votes:
                direction === "up" ? question.votes + 1 : question.votes - 1,
            };
          }
        }
        return question;
      });
    });
  };

  const handleAnswerSubmit = (questionId, content) => {
    setQuestions((prevQuestions) => {
      return prevQuestions.map((question) => {
        if (question.id === questionId) {
          const newAnswer = {
            id: Date.now(),
            content,
            votes: 0,
          };
          return {
            ...question,
            answers: [...question.answers, newAnswer],
          };
        }
        return question;
      });
    });
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Recent Questions
            </h1>

            <div className="space-y-6">
              {questions.map((question) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  onVote={handleVote}
                  onAnswerSubmit={handleAnswerSubmit}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
