import { describe, expect, it } from "vitest";

describe("application title configuration", () => {
  it("exposes the medical.sketcher title to the runtime environment", () => {
    expect(process.env.VITE_APP_TITLE).toBe("medical.sketcher");
  });
});
