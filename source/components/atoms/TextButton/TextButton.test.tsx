import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import TextButton from "./TextButton";

const buttonLabel = "label";

it("renders without crashing", () => {
  const mockCallback = jest.fn();

  const component = () =>
    render(<TextButton onPress={mockCallback} label={buttonLabel} />);

  expect(component).not.toThrow();
});

it("calls the callback function when clicked", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <TextButton onPress={mockCallback} label={buttonLabel} />
  );

  const buttonElement = getByText(buttonLabel);
  fireEvent.press(buttonElement);

  expect(mockCallback).toHaveBeenCalled();
});

it("does not call the callback function when disabled", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <TextButton onPress={mockCallback} label={buttonLabel} disabled />
  );

  const buttonElement = getByText(buttonLabel);
  fireEvent.press(buttonElement);

  expect(mockCallback).not.toHaveBeenCalled();
});
