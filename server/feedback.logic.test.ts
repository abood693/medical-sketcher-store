import { describe, expect, it } from "vitest";
import { feedbackLessonKeyPattern, normalizeFeedbackInput } from "./feedback.logic";

describe("lesson feedback validation", () => {
  it("accepts safe lesson keys", () => {
    expect(feedbackLessonKeyPattern.test("a1-1-lesson-1")).toBe(true);
    expect(feedbackLessonKeyPattern.test("Lesson 1")).toBe(false);
  });

  it("trims author names and comment bodies before persistence", () => {
    expect(normalizeFeedbackInput({ authorName: "  Lina  ", body: "  Helpful lesson.  " })).toEqual({ authorName: "Lina", body: "Helpful lesson." });
  });
});
