import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import PrivacyModal from "./PrivacyModal";

it("renders without crashing", async () => {
  const component = () => render(<PrivacyModal visible toggle={jest.fn()} />);

  expect(component).not.toThrow();
});

it("calls the toggle callback when clicked", () => {
  const toggleMock = jest.fn();
  const toggleButtonText = "Återvänd till inloggning";

  const { getByText } = render(<PrivacyModal visible toggle={toggleMock} />);

  const toggleButton = getByText(toggleButtonText);
  fireEvent.press(toggleButton);

  expect(toggleMock).toHaveBeenCalledTimes(1);
});
