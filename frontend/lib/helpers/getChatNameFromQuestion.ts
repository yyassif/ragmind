export const getChatNameFromQuestion = (question: string): string => {
  return question.split(" ").slice(0, 3).join(" ");
};
