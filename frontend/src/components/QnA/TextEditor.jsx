import { Editor } from "primereact/editor";
import "quill/dist/quill.snow.css";

const TextEditor = ({ value, onChange }) => {
  return (
    <Editor
      value={value}
      onTextChange={(event) => onChange(event.htmlValue)}
      placeholder="Explain the issue clearly, include what you tried, and add code if useful."
      style={{ minHeight: "320px" }}
      className="text-slate-100"
    />
  );
};

export default TextEditor;

