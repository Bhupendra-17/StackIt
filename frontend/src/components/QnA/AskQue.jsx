import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, CircleAlert, Lightbulb } from "lucide-react";
import Layout from "../layout/Layout";
import TextEditor from "./TextEditor";
import TagsInput from "./TagsInput";
import { questionAPI } from "../../services/api";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const AskQue = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const plainDescription = useMemo(() => stripHtml(description), [description]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please add a clear title.");
      return;
    }

    if (title.trim().length > 150) {
      setError("Title cannot exceed 150 characters.");
      return;
    }

    if (!plainDescription) {
      setError("Please add a detailed description.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await questionAPI.createQuestion({
        title: title.trim(),
        description,
        tags,
      });

      const createdId = response.data?.question?._id;
      navigate(createdId ? `/?question=${createdId}` : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post your question.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <section className="app-surface rounded-3xl border border-slate-700/70 p-6 sm:p-8">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-cyan-300/70">Ask The Community</p>
          <h1 className="text-3xl font-heading font-semibold text-slate-100 sm:text-4xl">
            Share Your Question Clearly
          </h1>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Better context gets better answers. Show what you tried, what failed, and what you expect.
          </p>
        </section>

        <section className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 p-5">
          <h2 className="mb-3 inline-flex items-center gap-2 text-base font-semibold text-cyan-100">
            <Lightbulb className="h-4 w-4" />
            Quick Tips
          </h2>
          <ul className="space-y-2 text-sm text-cyan-50/90">
            <li className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Keep the title specific so experts can understand the issue quickly.
            </li>
            <li className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Include exact errors, environment details, and code snippets when possible.
            </li>
            <li className="inline-flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              Add relevant tags so the right people can discover your question.
            </li>
          </ul>
        </section>

        {error && (
          <div className="rounded-2xl border border-rose-300/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
            <span className="inline-flex items-center gap-2">
              <CircleAlert className="h-4 w-4" />
              {error}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="app-surface rounded-2xl border border-slate-700/70 p-5 sm:p-6">
            <label htmlFor="title" className="mb-2 block text-lg font-semibold text-slate-100">
              Title
            </label>
            <p className="mb-3 text-sm text-slate-400">
              Good example: "Why does my React state update lag in a debounced input?"
            </p>
            <input
              id="title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              maxLength={160}
              placeholder="Describe your issue in one sentence"
              className="app-input h-12 w-full rounded-xl px-4"
            />
            <p className="mt-2 text-xs text-slate-400">{title.trim().length}/150 recommended</p>
          </section>

          <section className="app-surface rounded-2xl border border-slate-700/70 p-5 sm:p-6">
            <label className="mb-2 block text-lg font-semibold text-slate-100">Description</label>
            <p className="mb-3 text-sm text-slate-400">
              Add context, expected result, current output, and code snippets.
            </p>
            <TextEditor
              value={description}
              onChange={(value) => {
                setDescription(value || "");
                if (error) {
                  setError("");
                }
              }}
            />
          </section>

          <section className="app-surface rounded-2xl border border-slate-700/70 p-5 sm:p-6">
            <label className="mb-2 block text-lg font-semibold text-slate-100">Tags</label>
            <p className="mb-3 text-sm text-slate-400">
              Up to five tags. Use concise keywords like `react`, `nodejs`, or `mongodb`.
            </p>
            <TagsInput
              tags={tags}
              setTags={setTags}
              inputValue={tagsInput}
              setInputValue={setTagsInput}
            />
          </section>

          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="app-btn-ghost rounded-xl px-5 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !plainDescription}
              className="app-btn-primary rounded-xl px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Publish Question"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AskQue;

