const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strong",
  "sub",
  "sup",
  "u",
  "ul",
]);

const sanitizeHtml = (input = "") => {
  if (typeof input !== "string") {
    return "";
  }

  let safe = input;

  // Remove dangerous blocks first.
  safe = safe.replace(/<\s*script[\s\S]*?>[\s\S]*?<\s*\/\s*script\s*>/gi, "");
  safe = safe.replace(/<\s*style[\s\S]*?>[\s\S]*?<\s*\/\s*style\s*>/gi, "");
  safe = safe.replace(/<\s*iframe[\s\S]*?>[\s\S]*?<\s*\/\s*iframe\s*>/gi, "");

  // Remove inline event handlers and javascript/data URLs.
  safe = safe.replace(/\son\w+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  safe = safe.replace(/\s(href|src)=["']\s*javascript:[^"']*["']/gi, "");
  safe = safe.replace(/\s(href|src)=["']\s*data:text\/html[^"']*["']/gi, "");

  // Drop tags outside allow-list while preserving text content.
  safe = safe.replace(/<\/?([a-z][a-z0-9-]*)\b[^>]*>/gi, (match, tagName) => {
    return ALLOWED_TAGS.has(tagName.toLowerCase()) ? match : "";
  });

  return safe.trim();
};

const hasMeaningfulContent = (html = "") => {
  if (typeof html !== "string") {
    return false;
  }

  const textOnly = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return textOnly.length > 0;
};

module.exports = {
  sanitizeHtml,
  hasMeaningfulContent,
};
