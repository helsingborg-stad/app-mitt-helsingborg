import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import LoginModal from "./LoginModal";

import type { Props } from "./LoginModal.types";

const loginButtonTestId = "loginButton";
const loginInputTestId = "loginInput";

const mockValidPersonalNumber = "199009111234";

const renderComponent = (props: Partial<Props> = {}) => {
  const {
    visible = true,
    isLoading = false,
    isIdle = true,
    isResolved = false,
    isRejected = false,
    toggle = jest.fn(),
    handleAuth = jest.fn(),
    handleCancelOrder = jest.fn(),
  } = props;

  return render(
    <LoginModal
      visible={visible}
      isLoading={isLoading}
      isIdle={isIdle}
      isResolved={isResolved}
      isRejected={isRejected}
      toggle={toggle}
      handleAuth={handleAuth}
      handleCancelOrder={handleCancelOrder}
    />
  );
};

it("renders without crashing", () => {
  const component = () => renderComponent();

  expect(component).not.toThrow();
});

it("disables the login button if none valid personal number is provided", () => {
  const { getByTestId } = renderComponent();

  const loginButton = getByTestId(loginButtonTestId);

  expect(loginButton).toBeDisabled();
});

it("enables the login button if valid personal number is provided", () => {
  const { getByTestId } = renderComponent();

  const input = getByTestId(loginInputTestId);
  fireEvent.changeText(input, mockValidPersonalNumber);

  const loginButton = getByTestId(loginButtonTestId);

  expect(loginButton).not.toBeDisabled();
});

it("calls handleAuth callback when trying to login", () => {
  const handleAuthMock = jest.fn();

  const { getByTestId } = renderComponent({ handleAuth: handleAuthMock });

  const input = getByTestId(loginInputTestId);
  fireEvent.changeText(input, mockValidPersonalNumber);

  const loginButton = getByTestId(loginButtonTestId);
  fireEvent.press(loginButton);

  expect(handleAuthMock).toHaveBeenCalledWith(mockValidPersonalNumber, true);
  expect(handleAuthMock).toHaveBeenCalledTimes(1);
});
