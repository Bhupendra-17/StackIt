import React from "react";
import Layout from "../layout/Layout";

const QuestionList = ({ questions }) => {
  return (
    <div className="space-y-6 w-full">
      {/* Questions List */}
      {questions.map((question) => (
        <div
          key={question.id}
          className="bg-gray-800 shadow-md rounded-lg p-4 border border-gray-700 w-full"
        >
          {/* Question Title */}
          <h3 className="text-xl md:text-2xl font-semibold mb-2 text-white">
            {question.title}
          </h3>

          {/* Question Description */}
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

          {/* Meta Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm">
            <span className="text-gray-400 mb-2 md:mb-0">
              Asked by {question.author} •{" "}
              {new Date(question.createdAt).toLocaleDateString()}
            </span>
            <span className="text-gray-400">
              {question.answers.length}{" "}
              {question.answers.length === 1 ? "answer" : "answers"}
            </span>
          </div>

          {/* Answers Preview */}
          {question.answers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-medium mb-2 text-white md:text-lg">
                Top Answer:
              </h4>
              <div className="bg-gray-700 p-3 rounded-md">
                <p className="text-gray-200 mb-2 text-base md:text-lg">
                  {question.answers[0].content.substring(
                    0,
                    window.innerWidth < 768 ? 100 : 200
                  )}
                  ...
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm">
                  <span className="text-gray-400 mb-1 sm:mb-0">
                    Answered by {question.answers[0].author}
                  </span>
                  <span className="text-gray-400">
                    {question.answers[0].votes} votes
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Example usage with mock data
const HomePage = () => {
  const mockQuestions = [
    {
      id: 1,
      title: "How to use React hooks?",
      description:
        "I'm new to React and I want to understand how to use hooks properly. Can someone explain with an example?",
      tags: ["React", "Hooks", "JavaScript", "Frontend"],
      author: "user123",
      answers: [
        {
          id: 1,
          content:
            "React hooks are functions that let you use state and other React features without writing a class. For example, useState is used to add state to functional components. You can use it like this: 'const [count, setCount] = useState(0)'. This gives you a state variable 'count' and a function 'setCount' to update it. Other common hooks include useEffect for side effects, useContext for context API, and useReducer for more complex state logic.",
          author: "expert456",
          votes: 15,
        },
      ],
      createdAt: "2025-04-05T10:00:00Z",
    },
    {
      id: 2,
      title: "What is JWT and how does it work in modern web applications?",
      description:
        "I'm trying to understand JSON Web Tokens and their role in authentication. Can someone explain this in simple terms with examples of how it's implemented in a typical MERN stack application?",
      tags: ["JWT", "Authentication", "Security", "MERN"],
      author: "user456",
      answers: [
        {
          id: 2,
          content:
            "JWT (JSON Web Token) is a compact, URL-safe means of representing claims to be transferred between two parties. In web applications, JWTs are commonly used for authentication. After a user logs in with their credentials, the server generates a JWT that contains user information (claims) and sends it back to the client. The client then includes this token in subsequent requests, typically in the Authorization header. The server verifies the token's signature to ensure it hasn't been tampered with before granting access to protected resources. In a MERN stack, you'd typically use libraries like jsonwebtoken on the Node.js backend and store the token in localStorage or cookies on the React frontend.",
          author: "expert456",
          votes: 12,
        },
      ],
      createdAt: "2025-04-05T11:30:00Z",
    },
  ];

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Title */}
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">
              Recent Questions
            </h1>

            {/* Questions List Component */}
            <QuestionList questions={mockQuestions} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
