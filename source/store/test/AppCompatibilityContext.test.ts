import {
  AppCompatibilityVisitor,
  APPLICATION_COMPATIBILITY_STATUS,
} from "../../types/AppCompatibilityTypes";
import { createAppCompatibilityContextValue } from "../AppCompatibilityContext";

describe("AppCompatibilityContext", () => {
  it("visit(visitor) calls correct visitor method", () => {
    const visit = (
      status: APPLICATION_COMPATIBILITY_STATUS,
      updateUrl: string,
      visitor: Partial<AppCompatibilityVisitor<unknown>>
    ) => {
      const c = createAppCompatibilityContextValue({
        status,
        updateUrl,
      });
      return c.visit(visitor);
    };

    expect(
      visit(APPLICATION_COMPATIBILITY_STATUS.COMPATIBLE, "", {
        compatible: () => "compatible was called",
      })
    ).toBe("compatible was called");

    expect(
      visit(APPLICATION_COMPATIBILITY_STATUS.INCOMPATIBLE, "www.example.com", {
        incompatible: ({ updateUrl }) =>
          `incompatible was called with ${updateUrl}`,
      })
    ).toBe("incompatible was called with www.example.com");

    expect(
      visit(APPLICATION_COMPATIBILITY_STATUS.PENDING, "", {
        pending: () => "pending was called",
      })
    ).toBe("pending was called");
  });

  it("visit(visitor) returns undefined for unmapped visitor methods", () => {
    const visit = (status: APPLICATION_COMPATIBILITY_STATUS) => {
      const c = createAppCompatibilityContextValue({
        status,
        updateUrl: "",
      });
      return c.visit({
        /* empty visitor */
      });
    };

    expect(visit(APPLICATION_COMPATIBILITY_STATUS.COMPATIBLE)).toBeUndefined();

    expect(
      visit(APPLICATION_COMPATIBILITY_STATUS.INCOMPATIBLE)
    ).toBeUndefined();

    expect(visit(APPLICATION_COMPATIBILITY_STATUS.PENDING)).toBeUndefined();
  });
});
