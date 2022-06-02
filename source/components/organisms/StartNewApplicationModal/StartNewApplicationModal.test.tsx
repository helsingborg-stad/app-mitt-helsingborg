import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import StartNewApplicationModal from "./StartNewApplicationModal";

const renderComponent = ({
  onClose = jest.fn(),
  onOpenForm = jest.fn(),
  onChangeModal = jest.fn(),
}) =>
  render(
    <StartNewApplicationModal
      onClose={onClose}
      visible
      onOpenForm={onOpenForm}
      onChangeModal={onChangeModal}
    />
  );

it("calls the onClose callback when close button is clicked", () => {
  const cancelButtonText = "Avbryt";
  const onCloseMock = jest.fn();

  const { getByText } = renderComponent({ onClose: onCloseMock });

  const buttonElement = getByText(cancelButtonText);
  fireEvent.press(buttonElement);

  expect(onCloseMock).toHaveBeenCalled();
});

it("calls the onOpenForm callback when clicked", () => {
  const openFormButtonText = "Söker själv";
  const onOpenFormMock = jest.fn();

  const { getByText } = renderComponent({ onOpenForm: onOpenFormMock });

  const buttonElement = getByText(openFormButtonText);
  fireEvent.press(buttonElement);

  expect(onOpenFormMock).toHaveBeenCalled();
});

it("calls the onChangeModal callback when clicked", () => {
  const onChangeModalButtonText = "Söker med man, fru eller sambo";
  const onChangeModalMock = jest.fn();

  const { getByText } = renderComponent({ onChangeModal: onChangeModalMock });

  const buttonElement = getByText(onChangeModalButtonText);
  fireEvent.press(buttonElement);

  expect(onChangeModalMock).toHaveBeenCalled();
});
