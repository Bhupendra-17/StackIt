import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Layout from "../layout/Layout";
import { questionAPI } from "../../services/api";
import { useAuth } from "../context/auth-context";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState("questions");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await questionAPI.getAllQuestions({ sort: "newest" });
        setQuestions(response.data.questions || []);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const myQuestions = useMemo(
    () => questions.filter((question) => question.user?._id === user?.id),
    [questions, user?.id],
  );

  const myAnswers = useMemo(
    () =>
      questions.flatMap((question) =>
        (question.answers || [])
          .filter((answer) => answer.user?._id === user?.id)
          .map((answer) => ({ ...answer, questionId: question._id, questionTitle: question.title })),
      ),
    [questions, user?.id],
  );

  const stats = useMemo(() => {
    const questionUpvotes = myQuestions.reduce(
      (total, question) => total + (question.upvoteCount || 0),
      0,
    );
    const answerUpvotes = myAnswers.reduce(
      (total, answer) => total + (answer.upvoteCount || 0),
      0,
    );

    return {
      questions: myQuestions.length,
      answers: myAnswers.length,
      upvotes: questionUpvotes + answerUpvotes,
      totalContributions: myQuestions.length + myAnswers.length,
    };
  }, [myQuestions, myAnswers]);

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center">
          <div className="app-surface w-full max-w-sm p-8 text-center">
            <div className="mx-auto mb-4 h-11 w-11 rounded-full border-2 border-cyan-400/30 border-t-cyan-200 animate-spin" />
            <p className="text-slate-200">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="app-surface rounded-3xl border border-slate-700/70 p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-3xl font-heading font-semibold text-slate-950 sm:h-24 sm:w-24 sm:text-4xl">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-heading font-semibold text-slate-100 sm:text-4xl">
                {user?.username}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" />
                  {user?.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Joined {formatDate(user?.createdAt || new Date())}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 text-center">
              <MessageSquare className="mx-auto mb-1 h-5 w-5 text-cyan-200" />
              <p className="text-2xl font-semibold text-slate-100">{stats.questions}</p>
              <p className="text-xs text-slate-400">Questions</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 text-center">
              <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-emerald-300" />
              <p className="text-2xl font-semibold text-slate-100">{stats.answers}</p>
              <p className="text-xs text-slate-400">Answers</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 text-center">
              <TrendingUp className="mx-auto mb-1 h-5 w-5 text-cyan-200" />
              <p className="text-2xl font-semibold text-slate-100">{stats.upvotes}</p>
              <p className="text-xs text-slate-400">Upvotes</p>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4 text-center">
              <Award className="mx-auto mb-1 h-5 w-5 text-amber-300" />
              <p className="text-2xl font-semibold text-slate-100">{stats.totalContributions}</p>
              <p className="text-xs text-slate-400">Total Posts</p>
            </div>
          </div>
        </section>

        <section className="app-surface rounded-3xl border border-slate-700/70 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === "questions"
                  ? "app-btn-primary"
                  : "app-btn-ghost"
              }`}
            >
              Questions ({stats.questions})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("answers")}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === "answers"
                  ? "app-btn-primary"
                  : "app-btn-ghost"
              }`}
            >
              Answers ({stats.answers})
            </button>
          </div>

          {activeTab === "questions" ? (
            <div className="space-y-3">
              {myQuestions.length === 0 ? (
                <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-8 text-center">
                  <p className="text-slate-300">You haven&apos;t asked a question yet.</p>
                  <Link to="/ask" className="app-btn-primary mt-4 inline-block rounded-xl px-4 py-2 text-sm">
                    Ask Your First Question
                  </Link>
                </div>
              ) : (
                myQuestions.map((question) => (
                  <article
                    key={question._id}
                    className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4"
                  >
                    <h3 className="text-lg font-semibold text-slate-100">{question.title}</h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {question.answerCount || 0} answers · {question.upvoteCount || 0} upvotes
                    </p>
                    <Link
                      to={`/?question=${question._id}`}
                      className="mt-3 inline-block text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                    >
                      View discussion
                    </Link>
                  </article>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {myAnswers.length === 0 ? (
                <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-8 text-center">
                  <p className="text-slate-300">No answers posted yet.</p>
                  <Link to="/" className="app-btn-primary mt-4 inline-block rounded-xl px-4 py-2 text-sm">
                    Browse Questions
                  </Link>
                </div>
              ) : (
                myAnswers.map((answer) => (
                  <article
                    key={answer._id}
                    className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Answered On</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-100">{answer.questionTitle}</h3>
                    <p className="mt-2 text-sm text-slate-300 line-clamp-3">
                      {answer.content
                        .replace(/<[^>]*>/g, " ")
                        .replace(/\s+/g, " ")
                        .trim()}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {answer.upvoteCount || 0} upvotes · {formatDate(answer.createdAt)}
                    </p>
                    <Link
                      to={`/?question=${answer.questionId}`}
                      className="mt-3 inline-block text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
                    >
                      Open question
                    </Link>
                  </article>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;


