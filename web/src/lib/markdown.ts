import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

export function renderMarkdownToHtml(markdown: string): string {
  const rawHtml = md.render(markdown);
  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "pre",
      "code",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title"],
      code: ["class"],
      span: ["class"],
      div: ["class"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
    },
  });
  return cleanHtml;
}


