export default function parseTags(tagString = "") {
  return tagString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}
