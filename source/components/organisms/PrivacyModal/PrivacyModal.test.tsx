import React from "react";
import { waitFor } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import PrivacyModal from "./PrivacyModal";

it("renders without crashing", async () => {
  const component = () => render(<PrivacyModal visible toggle={jest.fn()} />);

  await waitFor(() => {
    expect(component).not.toThrow();
  });
});

// it("shows the provided message", () => {
//   const apiStatusMessage = "testMessage";

//   const { getByText } = render(<ApiStatusMessage message={apiStatusMessage} />);

//   expect(getByText(apiStatusMessage)).not.toBeNull();
// });
