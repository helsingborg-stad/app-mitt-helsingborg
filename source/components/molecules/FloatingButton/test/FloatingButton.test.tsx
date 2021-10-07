import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { render } from "../../../../../test-utils";

import FloatingButton from "..";

const mockButtonText = "mockButtonText";

it("calls the callback function on floating button click", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <FloatingButton onClick={mockCallback} type="text" text={mockButtonText} />
  );

  const buttonElement = getByText(mockButtonText);
  fireEvent.press(buttonElement);

  expect(mockCallback).toHaveBeenCalled();
});
