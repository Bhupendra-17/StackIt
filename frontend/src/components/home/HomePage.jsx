import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowBigUp,
  Clock3,
  Filter,
  MessageSquare,
  RefreshCcw,
  SendHorizontal,
  Tag,
  UserRound,
} from "lucide-react";
import Layout from "../layout/Layout";
import { answerAPI, questionAPI } from "../../services/api";
import { useAuth } from "../context/auth-context";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "votes", label: "Most Voted" },
  { value: "unanswered", label: "Unanswered" },
  { value: "oldest", label: "Oldest" },
];

const formatDate = (value) => {
  if (!value) {
    return "Unknown date";
  }

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const AnswerComposer = ({ onSubmit, submitting }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!content.trim()) {
      return;
    }

    await onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-700/60 bg-slate-950/50 p-4">
      <label className="block text-sm font-medium text-slate-300">Your answer</label>
      <textarea
        rows={5}
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Share a practical explanation. You can use simple HTML formatting."
        className="app-input min-h-28 w-full resize-y rounded-xl px-3 py-2.5"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="app-btn-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizontal className="h-4 w-4" />
          {submitting ? "Posting..." : "Post Answer"}
        </button>
      </div>
    </form>
  );
};

const AnswerCard = ({ answer, onVote, onComment, isAuthenticated, authGuard }) => {
  const [commentText, setCommentText] = useState("");
  const [commenting, setCommenting] = useState(false);

  const submitComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    if (!isAuthenticated) {
      authGuard();
      return;
    }

    setCommenting(true);
    try {
      await onComment(answer._id, commentText);
      setCommentText("");
    } catch {
      // handled in parent
    } finally {
      setCommenting(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-700/60 bg-slate-950/55 p-4 sm:p-5">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => (isAuthenticated ? onVote(answer._id) : authGuard())}
          className="group mt-0.5 flex min-w-14 flex-col items-center rounded-xl border border-slate-700 bg-slate-900/60 px-2 py-2 transition hover:border-cyan-300/40"
        >
          <ArrowBigUp className="h-5 w-5 text-slate-400 transition group-hover:text-cyan-300" />
          <span className="text-sm font-semibold text-slate-200">{answer.upvoteCount || 0}</span>
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-3.5 w-3.5" />
              {answer.user?.username || "Anonymous"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDate(answer.createdAt)}
            </span>
          </div>

          <div
            className="prose prose-invert max-w-none text-sm text-slate-200 sm:text-base"
            dangerouslySetInnerHTML={{ __html: answer.content }}
          />

          <div className="mt-4 space-y-2">
            {answer.comments?.slice(0, 4).map((comment) => (
              <div key={comment._id} className="rounded-xl bg-slate-900/60 px-3 py-2 text-sm">
                <span className="font-semibold text-slate-200">{comment.user?.username || "User"}</span>
                <span className="text-slate-300"> · {comment.content}</span>
              </div>
            ))}
          </div>

          <form onSubmit={submitComment} className="mt-3 flex gap-2">
            <input
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Add a short comment"
              className="app-input h-10 flex-1 rounded-xl px-3 text-sm"
            />
            <button
              type="submit"
              disabled={commenting || !commentText.trim()}
              className="app-btn-ghost h-10 rounded-xl px-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {commenting ? "Sending" : "Comment"}
            </button>
          </form>
        </div>
      </div>
    </article>
  );
};

const QuestionCard = ({
  question,
  isAuthenticated,
  onQuestionVote,
  onAnswerVote,
  onAnswerSubmit,
  onCommentSubmit,
  authGuard,
  expanded,
  onToggleExpand,
}) => {
  const [showAnswerComposer, setShowAnswerComposer] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const answers = expanded ? question.answers : question.answers?.slice(0, 1);

  const handleSubmit = async (content) => {
    setSubmittingAnswer(true);
    try {
      await onAnswerSubmit(question._id, content);
      setShowAnswerComposer(false);
    } catch {
      // handled in parent
    } finally {
      setSubmittingAnswer(false);
    }
  };

  return (
    <article
      id={`question-${question._id}`}
      className="app-surface overflow-hidden rounded-2xl border border-slate-700/70 p-4 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => (isAuthenticated ? onQuestionVote(question._id) : authGuard())}
          className="group flex items-center justify-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 sm:min-w-16 sm:flex-col sm:gap-0.5 sm:px-2"
        >
          <ArrowBigUp className="h-5 w-5 text-slate-400 transition group-hover:text-cyan-300" />
          <span className="text-sm font-semibold text-slate-100">{question.upvoteCount || 0}</span>
        </button>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-heading font-semibold leading-tight text-slate-100 sm:text-2xl">
            {question.title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-3.5 w-3.5" />
              {question.user?.username || "Anonymous"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" />
              {formatDate(question.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {question.answerCount || 0} answers
            </span>
          </div>

          <div
            className="prose prose-invert mt-4 max-w-none text-sm text-slate-200 sm:text-base"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />

          {question.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span
                  key={`${question._id}-${tag}`}
                  className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  authGuard();
                  return;
                }
                setShowAnswerComposer((value) => !value);
              }}
              className="app-btn-primary rounded-xl px-4 py-2 text-sm font-medium"
            >
              {showAnswerComposer ? "Cancel" : "Write Answer"}
            </button>
            {question.answerCount > 1 && (
              <button
                type="button"
                onClick={onToggleExpand}
                className="app-btn-ghost rounded-xl px-4 py-2 text-sm"
              >
                {expanded
                  ? "Show Less"
                  : `Show All Answers (${question.answerCount})`}
              </button>
            )}
          </div>

          {showAnswerComposer && (
            <div className="mt-4">
              <AnswerComposer onSubmit={handleSubmit} submitting={submittingAnswer} />
            </div>
          )}

          {question.answers?.length > 0 && (
            <div className="mt-5 space-y-3">
              {answers.map((answer) => (
                <AnswerCard
                  key={answer._id}
                  answer={answer}
                  isAuthenticated={isAuthenticated}
                  authGuard={authGuard}
                  onVote={(answerId) => onAnswerVote(question._id, answerId)}
                  onComment={(answerId, comment) =>
                    onCommentSubmit(question._id, answerId, comment)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const searchValue = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  }, [location.search]);

  const fetchQuestions = useCallback(
    async ({ showLoader = false } = {}) => {
      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const response = await questionAPI.getAllQuestions({
          search: searchValue || undefined,
          tag: activeTag || undefined,
          sort: sortBy,
        });

        setQuestions(response.data.questions || []);
        setError("");
      } catch {
        setError("Could not load questions right now. Please try again.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchValue, activeTag, sortBy],
  );

  useEffect(() => {
    fetchQuestions({ showLoader: true });
  }, [fetchQuestions]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const questionId = params.get("question");

    if (!questionId) {
      return;
    }

    const timer = setTimeout(() => {
      const target = document.getElementById(`question-${questionId}`);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [location.search, questions]);

  const allTags = useMemo(() => {
    const tagCounts = new Map();

    questions.forEach((question) => {
      question.tags?.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count]) => ({ name, count }));
  }, [questions]);

  const askForLogin = () => {
    navigate("/login", {
      state: {
        from: location,
      },
    });
  };

  const refreshFeed = async () => {
    await fetchQuestions();
  };

  const handleQuestionVote = async (questionId) => {
    try {
      await questionAPI.upvoteQuestion(questionId);
      await refreshFeed();
    } catch {
      setError("Could not update your vote right now.");
    }
  };

  const handleAnswerVote = async (_questionId, answerId) => {
    try {
      await answerAPI.upvoteAnswer(answerId);
      await refreshFeed();
    } catch {
      setError("Could not update your vote right now.");
    }
  };

  const handleAnswerSubmit = async (questionId, content) => {
    try {
      await answerAPI.postAnswer({ questionId, content });
      await refreshFeed();
    } catch (error) {
      setError("Could not post your answer right now.");
      throw error;
    }
  };

  const handleCommentSubmit = async (_questionId, answerId, content) => {
    try {
      await answerAPI.commentOnAnswer(answerId, content);
      await refreshFeed();
    } catch (error) {
      setError("Could not add your comment right now.");
      throw error;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center">
          <div className="app-surface w-full max-w-sm p-8 text-center">
            <div className="mx-auto mb-4 h-11 w-11 rounded-full border-2 border-cyan-400/30 border-t-cyan-200 animate-spin" />
            <p className="text-slate-200">Loading community questions...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="app-surface rounded-3xl border border-slate-700/70 p-5 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300/70">Community Feed</p>
              <h1 className="text-3xl font-heading font-semibold text-slate-100 sm:text-4xl">
                Ship Better Answers Together
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-300 sm:text-base">
                Browse real-world questions, upvote the most useful solutions, and share fixes that help the next developer ship faster.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-200">
                <Filter className="h-4 w-4 text-cyan-300" />
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="bg-transparent text-sm outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={() => fetchQuestions()}
                className="app-btn-ghost inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm"
              >
                <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <Link to="/ask" className="app-btn-primary rounded-xl px-4 py-2 text-sm font-medium">
                Ask Question
              </Link>
            </div>
          </div>

          {searchValue && (
            <p className="mt-3 text-sm text-slate-300">
              Showing results for <span className="font-semibold text-cyan-200">"{searchValue}"</span>
            </p>
          )}

          {allTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag("")}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  activeTag
                    ? "border-slate-600 bg-slate-900/70 text-slate-300"
                    : "border-cyan-300/40 bg-cyan-400/10 text-cyan-200"
                }`}
              >
                All tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => setActiveTag(tag.name)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    activeTag === tag.name
                      ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-200"
                      : "border-slate-600 bg-slate-900/70 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {tag.name} ({tag.count})
                </button>
              ))}
            </div>
          )}
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        {questions.length === 0 ? (
          <section className="app-surface rounded-3xl border border-slate-700/70 p-8 text-center sm:p-10">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-slate-500" />
            <h2 className="text-2xl font-heading font-semibold text-slate-100">No questions yet</h2>
            <p className="mt-2 text-slate-300">
              {searchValue || activeTag
                ? "Try clearing your filters, or ask the first question in this topic."
                : "Start the first discussion and help shape the knowledge base."}
            </p>
            <Link to="/ask" className="app-btn-primary mt-6 inline-block rounded-xl px-5 py-2.5 text-sm font-medium">
              Ask Your First Question
            </Link>
          </section>
        ) : (
          <section className="space-y-4">
            {questions.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                isAuthenticated={isAuthenticated}
                authGuard={askForLogin}
                expanded={Boolean(expandedQuestions[question._id])}
                onToggleExpand={() =>
                  setExpandedQuestions((state) => ({
                    ...state,
                    [question._id]: !state[question._id],
                  }))
                }
                onQuestionVote={handleQuestionVote}
                onAnswerVote={handleAnswerVote}
                onAnswerSubmit={handleAnswerSubmit}
                onCommentSubmit={handleCommentSubmit}
              />
            ))}
          </section>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;


