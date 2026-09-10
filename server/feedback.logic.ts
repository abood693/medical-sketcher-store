export const feedbackLessonKeyPattern = /^[a-z0-9-]+$/;

export function normalizeFeedbackInput(input: { authorName: string; body: string }) {
  return {
    authorName: input.authorName.trim(),
    body: input.body.trim(),
  };
}
