import React, { useState } from "react";
import Layout from "../layout/Layout";
import TextEditor from "./TextEditor";
import TagsInput from "./TagsInput";

const AskQue = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState([]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ title, description, tags });
    setTitle("");
    setDescription("");
    setTags([]);
    setTagsInput("");
  };

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Ask a Question
            </h1>

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

              {/* Tags Section - Using the new TagsInput component */}
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-200"
                  disabled={!title || !description}
                >
                  Post Question
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