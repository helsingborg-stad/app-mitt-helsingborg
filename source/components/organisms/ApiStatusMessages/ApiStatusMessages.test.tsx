import React from "react";

import { render } from "../../../../test-utils";

import ApiStatusMessages from "./ApiStatusMessages";

it("renders without crashing", () => {
  const component = () => render(<ApiStatusMessages messages={[]} />);

  expect(component).not.toThrow();
});
