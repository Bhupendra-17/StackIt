import { X } from "lucide-react";

const MAX_TAGS = 5;

const TagsInput = ({ tags, setTags, inputValue, setInputValue }) => {
  const addTag = () => {
    const normalized = inputValue.trim().toLowerCase();

    if (!normalized || tags.includes(normalized) || tags.length >= MAX_TAGS) {
      return;
    }

    setTags([...tags, normalized]);
    setInputValue("");
  };

  const handleTagsKeyDown = (event) => {
    if (["Enter", ","].includes(event.key)) {
      event.preventDefault();
      addTag();
    }

    if (event.key === "Backspace" && !inputValue && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div>
      <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 text-cyan-100/80 transition hover:bg-cyan-300/20 hover:text-cyan-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleTagsKeyDown}
          onBlur={addTag}
          placeholder={
            tags.length >= MAX_TAGS
              ? `Maximum ${MAX_TAGS} tags reached`
              : "Type a tag and press Enter"
          }
          disabled={tags.length >= MAX_TAGS}
          className="app-input h-11 w-full rounded-xl px-3"
        />
      </div>

      <p className="mt-2 text-xs text-slate-400">
        {tags.length}/{MAX_TAGS} tags used.
      </p>
    </div>
  );
};

export default TagsInput;

