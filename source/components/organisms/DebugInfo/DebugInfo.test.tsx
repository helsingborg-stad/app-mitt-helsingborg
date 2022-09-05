import React from "react";
import DebugInfo from "./DebugInfo";
import { render } from "../../../../test-utils";

describe("DebugInfo", () => {
  it("renders", () => {
    const func = () => {
      render(<DebugInfo />);
    };

    expect(func).not.toThrow();
  });
});
