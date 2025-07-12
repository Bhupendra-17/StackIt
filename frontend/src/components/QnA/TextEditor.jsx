import React, { useState } from "react";
import { Editor } from "primereact/editor";
import "quill/dist/quill.snow.css"; // Required for Editor styling

const TextEditor = () => {
  const [text, setText] = useState("");

  return (
    <div className="card">
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue)}
        style={{ height: "320px", color: "white" }}
      />
    </div>
  );
};

export default TextEditor;
