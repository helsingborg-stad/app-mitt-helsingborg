import React from "react";

import { render } from "../../../../test-utils";

import ApiStatusMessage from "./ApiStatusMessage";
import type { Message } from "../../../types/StatusMessages";
import { Type } from "../../../types/StatusMessages";

it("renders without crashing", () => {
  const component = () =>
    render(
      <ApiStatusMessage
        message={{
          title: "title",
          text: "text",
        }}
        type={Type.Info}
      />
    );

  expect(component).not.toThrow();
});

it("shows the provided message", () => {
  const apiStatusMessage: Message = {
    title: "title",
    text: "text",
  };

  const { getByText } = render(
    <ApiStatusMessage message={apiStatusMessage} type={Type.Info} />
  );

  expect(getByText(apiStatusMessage.title)).not.toBeNull();
  expect(getByText(apiStatusMessage.text)).not.toBeNull();
});
