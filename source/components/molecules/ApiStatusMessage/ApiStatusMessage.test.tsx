import React from "react";

import { render } from "../../../../test-utils";

import ApiStatusMessage from "./ApiStatusMessage";

it("renders without crashing", () => {
  const component = () => render(<ApiStatusMessage message="" />);

  expect(component).not.toThrow();
});

it("shows the provided message", () => {
  const apiStatusMessage = "testMessage";

  const { getByText } = render(<ApiStatusMessage message={apiStatusMessage} />);

  expect(getByText(apiStatusMessage)).not.toBeNull();
});
