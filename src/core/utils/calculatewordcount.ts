export const calculateWordCount = (text: string) => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};
