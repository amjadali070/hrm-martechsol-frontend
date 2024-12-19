const MAX_WORDS = 4;
export const truncateComment = (comment: string) => {
  if (!comment) return "No Comments";
  const words = comment.trim().split(" ");
  if (words.length > MAX_WORDS) {
    return words.slice(0, MAX_WORDS).join(" ") + "......";
  }
  return comment;
};
