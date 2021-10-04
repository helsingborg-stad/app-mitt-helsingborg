import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { render } from "../../../../../test-utils";

import BottomModal from "..";

const mockText = "some text";

it("renders provided children", () => {
  const { queryByText } = render(
    <BottomModal onClose={jest.fn()} visible>
      <Text>{mockText}</Text>
    </BottomModal>
  );

  const titleElement = queryByText(mockText);

  expect(titleElement).not.toBeNull();
  expect(titleElement).toHaveTextContent(mockText);
});

it("shows navigator buttons if callbacks are provided", () => {
  const { queryByTestId } = render(
    <BottomModal onClose={jest.fn()} onBack={jest.fn()} visible>
      <Text>{mockText}</Text>
    </BottomModal>
  );

  const backButtonElement = queryByTestId("modal-navigator-back-button");
  const closeButtonElement = queryByTestId("modal-navigator-close-button");

  expect(backButtonElement).not.toBeNull();
  expect(closeButtonElement).not.toBeNull();
});

it("hides navigator buttons if callbacks are not provided", () => {
  const { queryByTestId } = render(
    <BottomModal visible>
      <Text>{mockText}</Text>
    </BottomModal>
  );

  const backButtonElement = queryByTestId("modal-navigator-back-button");
  const closeButtonElement = queryByTestId("modal-navigator-close-button");

  expect(backButtonElement).toBeNull();
  expect(closeButtonElement).toBeNull();
});

it("calls the provided callbacks when pressed", () => {
  const onGoBackCallback = jest.fn();
  const onCloseCallback = jest.fn();

  const { queryByTestId } = render(
    <BottomModal onClose={onCloseCallback} onBack={onGoBackCallback} visible>
      <Text>{mockText}</Text>
    </BottomModal>
  );

  const backButtonElement = queryByTestId("modal-navigator-back-button");
  const closeButtonElement = queryByTestId("modal-navigator-close-button");

  fireEvent.press(backButtonElement);
  fireEvent.press(closeButtonElement);

  expect(onGoBackCallback).toHaveBeenCalledTimes(1);
  expect(onCloseCallback).toHaveBeenCalledTimes(1);
});

it("prioritizes backButtonText to show instead of back icon", () => {
  const onBackButtonTextMock = "AVBRYT";

  const { queryByTestId, queryByText } = render(
    <BottomModal
      onBack={jest.fn()}
      visible
      backButtonText={onBackButtonTextMock}
    >
      <Text>{mockText}</Text>
    </BottomModal>
  );

  const backButtonIconElement = queryByTestId("modal-navigator-back-button");
  const backButtonTextElement = queryByText(onBackButtonTextMock);

  expect(backButtonIconElement).toBeNull();
  expect(backButtonTextElement).not.toBeNull();
});
