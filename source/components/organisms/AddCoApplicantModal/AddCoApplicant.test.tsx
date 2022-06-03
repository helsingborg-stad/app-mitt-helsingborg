import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import AddCoApplicantModal from "./AddCoApplicantModal";

const nextButtonText = "Nästa";
const cancelButtonText = "Avbryt";
const inputTestId = "personal-number-input";

const renderComponent = ({
  onClose = jest.fn(),
  onAddCoApplicant = jest.fn(),
  isLoading = false,
  errorMessage = "",
}) =>
  render(
    <AddCoApplicantModal
      onClose={onClose}
      visible
      isLoading={isLoading}
      onAddCoApplicant={onAddCoApplicant}
      errorMessage={errorMessage}
    />
  );

it("calls the onClose callback when close button is clicked", () => {
  const onCloseMock = jest.fn();

  const { getByText } = renderComponent({ onClose: onCloseMock });

  const buttonElement = getByText(cancelButtonText);
  fireEvent.press(buttonElement);

  expect(onCloseMock).toHaveBeenCalled();
});

it("disables the next button when no valid personal number is added", () => {
  const invalidPersonalNumber = "123";
  const onAddCoApplicantMock = jest.fn();

  const { getByText, getByTestId } = renderComponent({
    onAddCoApplicant: onAddCoApplicantMock,
  });

  const input = getByTestId(inputTestId);
  fireEvent.changeText(input, invalidPersonalNumber);

  const buttonElement = getByText(nextButtonText);
  fireEvent.press(buttonElement);

  expect(onAddCoApplicantMock).not.toHaveBeenCalled();
  expect(buttonElement).toBeDisabled();
});

it("invokes onAddApplicant callback with valid personal number", async () => {
  const validPersonalNumber = "199009111111";
  const onAddCoApplicantMock = jest.fn().mockResolvedValueOnce(true);

  const { getByText, getByTestId } = renderComponent({
    onAddCoApplicant: onAddCoApplicantMock,
  });

  const input = getByTestId(inputTestId);
  fireEvent.changeText(input, validPersonalNumber);

  const buttonElement = getByText(nextButtonText);
  fireEvent.press(buttonElement);

  await waitFor(() => {
    expect(onAddCoApplicantMock).toHaveBeenCalledWith(validPersonalNumber);
  });
});

it("shows an error message if provided", () => {
  const errorMessage = "My fancy error";

  const { queryByText } = renderComponent({
    errorMessage,
  });

  const errorText = queryByText(errorMessage);

  expect(errorText).not.toBeNull();
});
