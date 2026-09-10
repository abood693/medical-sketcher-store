import { describe, expect, it } from "vitest";
import { initialUserRole, shouldUpdateExistingRole } from "./user-role.logic";

describe("user role persistence", () => {
  it("assigns user to a new non-owner account", () => {
    expect(initialUserRole(undefined, false)).toBe("user");
  });

  it("preserves a manually granted role during routine sign-in", () => {
    expect(shouldUpdateExistingRole(undefined, false)).toBe(false);
  });

  it("keeps configured owners eligible for admin on sign-in", () => {
    expect(initialUserRole(undefined, true)).toBe("admin");
    expect(shouldUpdateExistingRole(undefined, true)).toBe(true);
  });
});
