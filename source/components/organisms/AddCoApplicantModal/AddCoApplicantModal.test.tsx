import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";
import type { ReactTestInstance } from "react-test-renderer";

import { render } from "../../../../test-utils";

import AddCoApplicantModal from "./AddCoApplicantModal";

const nextButtonText = "Nästa";
const cancelButtonText = "Avbryt";
const personalNumberTestId = "personal-number-input";
const firstNameTestId = "first-name-input";
const lastNameTestId = "last-name-input";

const makeChangeTextEvent = (input: ReactTestInstance, value: string) => {
  fireEvent.changeText(input, value);
};

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

it("renders without crashing", () => {
  const onCloseMock = jest.fn();

  const component = () => renderComponent({ onClose: onCloseMock });

  expect(component).not.toThrow();
});

it("calls the onClose callback when close button is clicked", () => {
  const onCloseMock = jest.fn();

  const { getByText } = renderComponent({ onClose: onCloseMock });

  const buttonElement = getByText(cancelButtonText);
  fireEvent.press(buttonElement);

  expect(onCloseMock).toHaveBeenCalled();
});

it("disables the next button when not all valid input is added", () => {
  const invalidPersonalNumber = "123";
  const onAddCoApplicantMock = jest.fn();

  const { getByText, getByTestId } = renderComponent({
    onAddCoApplicant: onAddCoApplicantMock,
  });

  const input = getByTestId(personalNumberTestId);
  fireEvent.changeText(input, invalidPersonalNumber);

  const buttonElement = getByText(nextButtonText);
  fireEvent.press(buttonElement);

  expect(onAddCoApplicantMock).not.toHaveBeenCalled();
  expect(buttonElement).toBeDisabled();
});

it("invokes onAddApplicant callback when valid input is added", async () => {
  const validPersonalNumber = "199009111111";
  const validFirstName = "Kenth";
  const validLastName = "Andersson";

  const onAddCoApplicantMock = jest.fn().mockResolvedValueOnce(true);

  const { getByText, getByTestId } = renderComponent({
    onAddCoApplicant: onAddCoApplicantMock,
  });

  makeChangeTextEvent(getByTestId(personalNumberTestId), validPersonalNumber);
  makeChangeTextEvent(getByTestId(firstNameTestId), validFirstName);
  makeChangeTextEvent(getByTestId(lastNameTestId), validLastName);

  const buttonElement = getByText(nextButtonText);
  fireEvent.press(buttonElement);

  await waitFor(() => {
    expect(onAddCoApplicantMock).toHaveBeenCalledWith({
      personalNumber: validPersonalNumber,
      lastName: validLastName,
      firstName: validFirstName,
    });
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
