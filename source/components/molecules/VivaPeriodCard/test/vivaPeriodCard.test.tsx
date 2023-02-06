import React from "react";
import { render } from "../../../../../test-utils";
import { VivaPeriodCard } from "../vivaPeriodCard";

describe("VivaPeriodCard", () => {
  it("renders without error", async () => {
    const func = () => render(<VivaPeriodCard />);
    expect(func).not.toThrow();
  });
});
