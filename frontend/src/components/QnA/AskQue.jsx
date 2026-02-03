import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";
import TextEditor from "./TextEditor";
import TagsInput from "./TagsInput";
import { questionAPI } from "../../services/api";

const AskQue = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setError("");
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await questionAPI.createQuestion({
        title,
        description,
        tags,
      });

      // Success - redirect to home
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post question");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ask a Question
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Section */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Title
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Be specific and imagine you're asking a question to another
                  person.
                </p>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. How do I center a div in React?"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Introduce the problem and expand on what you put in the title.
                </p>
                <TextEditor
                  value={description}
                  onChange={handleDescriptionChange}
                />
              </div>

              {/* Tags Section */}
              <TagsInput
                tags={tags}
                setTags={setTags}
                inputValue={tagsInput}
                setInputValue={setTagsInput}
              />

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!title || !description || isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AskQue;
