import React from "react";
import EnvironmentPicker from "./EnvironmentPicker";
import { render } from "../../../../test-utils";

jest.mock("../../../services/environment/environmentServiceLocator", () => ({
  get() {
    return {
      getActive: () => ({
        url: "",
        apiKey: "",
      }),
      getEnvironmentMap: () => ({ sandbox: { url: "", apiKey: "" } }),
    };
  },
}));

describe("EnvironmentPicker", () => {
  it("renders without error", async () => {
    const func = () => render(<EnvironmentPicker />);
    expect(func).not.toThrow();
  });
});
