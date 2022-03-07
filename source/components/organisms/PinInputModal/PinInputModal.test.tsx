import { fireEvent } from "@testing-library/react-native";
import React from "react";

import { render } from "../../../../test-utils";
import PinInputModal from "./PinInputModal";

const mockName = "Karlos";
const mockPin = "1234";
const mockError = "Oops! Felaktig pinkod inmatad";

describe("PinInputModal", () => {
  it("renders provided name", async () => {
    const { findByText } = render(
      <PinInputModal
        visible
        mainApplicantName={mockName}
        onClose={jest.fn}
        onPinEntered={jest.fn}
      />
    );

    const nameElement = await findByText(new RegExp(`${mockName}`));

    expect(nameElement).toHaveTextContent(mockName);
  });

  it("renders error message", async () => {
    const { findByText } = render(
      <PinInputModal
        visible
        mainApplicantName={mockName}
        error={mockError}
        onClose={jest.fn}
        onPinEntered={jest.fn}
      />
    );

    const errorElement = await findByText(new RegExp(`${mockError}`));

    expect(errorElement).not.toBeNull();
    expect(errorElement).toHaveTextContent(mockError);
  });

  it("calls the onClose callback", async () => {
    const mockOnCloseCallback = jest.fn();

    const { findByText } = render(
      <PinInputModal
        visible
        mainApplicantName={mockName}
        onClose={mockOnCloseCallback}
        onPinEntered={jest.fn}
      />
    );

    const button = await findByText("Avbryt");

    fireEvent.press(button);

    expect(mockOnCloseCallback).toHaveBeenCalledTimes(1);
  });

  it("calls onPinEntered with correct pin", () => {
    const mockOnPinEnteredCallback = jest.fn();

    const { getByText, getByTestId } = render(
      <PinInputModal
        visible
        mainApplicantName={mockName}
        onClose={jest.fn}
        onPinEntered={mockOnPinEnteredCallback}
      />
    );
    const inputElement = getByTestId("pin-input");
    const button = getByText("Lås upp");

    fireEvent.changeText(inputElement, mockPin);
    fireEvent.press(button);

    expect(mockOnPinEnteredCallback).toHaveBeenCalledTimes(1);
    expect(mockOnPinEnteredCallback).toHaveBeenCalledWith(mockPin);
  });
});
