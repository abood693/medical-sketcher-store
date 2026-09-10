import { describe, expect, it } from "vitest";
import { scoreAnswers, starterQuestions } from "./learning.logic";

describe("learning quiz scoring", () => {
  it("contains the 30 supplied A1.1 questions", () => {
    expect(starterQuestions["A1/A2"]).toHaveLength(30);
  });

  it("scores all 30 correct A1.1 responses as a perfect result", () => {
    const questions = starterQuestions["A1/A2"];
    const answers = questions.map(question => question.correctIndex);
    expect(questions).toHaveLength(30);
    expect(scoreAnswers(questions, answers)).toBe(30);
  });

  it("keeps an incomplete result below the passing score", () => {
    const questions = starterQuestions["A1/A2"];
    const answers = questions.map((question, index) => index % 2 === 0 ? question.correctIndex : (question.correctIndex + 1) % question.choices.length);
    expect(scoreAnswers(questions, answers)).toBe(15);
  });

  it("does not award points for incorrect responses", () => {
    const questions = starterQuestions["B1/B2"];
    expect(scoreAnswers(questions, [3, 3, 3])).toBe(0);
  });
});
