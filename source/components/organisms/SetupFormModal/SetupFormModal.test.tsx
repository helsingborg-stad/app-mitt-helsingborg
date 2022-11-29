import React from "react";

import { render } from "../../../../test-utils";

import SetupFormModal from "./SetupFormModal";

it("renders without crashing", () => {
  const component = () =>
    render(
      <SetupFormModal
        hasError={false}
        visible
        onRetryOpenForm={() => undefined}
        onCloseModal={() => undefined}
      />
    );

  expect(component).not.toThrow();
});
