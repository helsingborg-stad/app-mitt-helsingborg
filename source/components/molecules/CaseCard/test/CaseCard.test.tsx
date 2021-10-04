import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { render } from "../../../../../test-utils";

import CaseCard from "..";

const mockTitle = "mockTitle";
const mockButtonText = "mockButtonText";

it("calls the callback function on card click", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <CaseCard title={mockTitle} onCardClick={mockCallback} />
  );

  const titleElement = getByText(mockTitle);
  fireEvent.press(titleElement);

  expect(mockCallback).toHaveBeenCalled();
});

it("calls the callback function on button click", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <CaseCard
      title={mockTitle}
      onCardClick={mockCallback}
      showButton
      buttonText={mockButtonText}
    />
  );

  const titleElement = getByText(mockButtonText);
  fireEvent.press(titleElement);

  expect(mockCallback).toHaveBeenCalled();
});
