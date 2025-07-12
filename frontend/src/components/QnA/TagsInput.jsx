import React from "react";

const TagsInput = ({ tags, setTags, inputValue, setInputValue }) => {
  const handleTagsChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTagsKeyDown = (e) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      }
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label
        htmlFor="tags"
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        Tags
      </label>
      <p className="text-xs text-gray-400 mb-3">
        Add up to 5 tags to describe what your question is about.
      </p>
      <input
        type="text"
        id="tags"
        value={inputValue}
        onChange={handleTagsChange}
        onKeyDown={handleTagsKeyDown}
        placeholder="Type a tag and press comma or enter"
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Selected Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-2 text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsInput;
