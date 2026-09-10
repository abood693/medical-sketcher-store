import { describe, expect, it } from "vitest";
import { DEFAULT_ASSISTANT_CONFIG, SHELF_DEFAULTS } from "./studio.defaults";

describe("owner studio defaults", () => {
  it("keeps six distinct shelves available for the owner to manage", () => {
    expect(SHELF_DEFAULTS.map(item => item.id)).toEqual(["A1.1", "A1.2", "B1.1", "B1.2", "C1.1", "C1.2"]);
  });

  it("uses abdelrazaq as the initial assistant identity", () => {
    expect(DEFAULT_ASSISTANT_CONFIG.name).toBe("abdelrazaq");
  });
});
