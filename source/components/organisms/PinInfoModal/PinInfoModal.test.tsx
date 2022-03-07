import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import PinInfoModal from "./PinInfoModal";

const mockName = "mockName";
const mockPin = "1234";

it("renders provided properties", () => {
  const { queryByText } = render(
    <PinInfoModal visible name={mockName} pin={mockPin} onClose={jest.fn} />
  );

  const nameElement = queryByText(mockName);
  const pinElement = queryByText(mockPin);

  expect(nameElement).not.toBeNull();
  expect(nameElement).toHaveTextContent(mockName);
  expect(pinElement).not.toBeNull();
  expect(pinElement).toHaveTextContent(mockPin);
});

it("calls the onClose callback", async () => {
  const mockOnCloseCallback = jest.fn();

  const { findByText } = render(
    <PinInfoModal
      visible
      name={mockName}
      pin={mockPin}
      onClose={mockOnCloseCallback}
    />
  );

  const button = await findByText("Okej");

  fireEvent.press(button);

  expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
});
