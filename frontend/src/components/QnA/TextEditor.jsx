import React from "react";
import { Editor } from "primereact/editor";
import "quill/dist/quill.snow.css";

const TextEditor = ({ value, onChange }) => {
  return (
    <div className="card">
      <Editor
        value={value}
        onTextChange={(e) => onChange(e.htmlValue)}
        style={{ height: "320px" }}
        className="bg-gray-800 text-white"
      />
    </div>
  );
};

export default TextEditor;
