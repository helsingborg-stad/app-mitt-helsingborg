import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../test-utils";

import InputFields, { InputField } from "./InputFields";

const inputIdentifiers = [
  { label: "inputLabelOne", testId: "inputTestIdOne" },
  { label: "inputLabelTwo", testId: "inputTestIdTwo" },
];

it("renders provided fields", () => {
  const fields: InputField[] = inputIdentifiers.map(({ label, testId }) => ({
    label,
    testId,
    value: "",
    onChange: jest.fn(),
  }));

  const { getByText, queryByTestId } = render(<InputFields fields={fields} />);

  fields.forEach(({ label, testId }) => {
    const labelComponent = getByText(label);
    const inputComponent = queryByTestId(testId);

    expect(labelComponent).not.toBeNull();
    expect(inputComponent).not.toBeNull();
  });
});

it("calls the provided onChange callback", () => {
  const onChangeMock = jest.fn();

  const fields: InputField[] = inputIdentifiers.map(({ label, testId }) => ({
    label,
    testId,
    value: "",
    onChange: onChangeMock,
  }));

  const { getByTestId } = render(<InputFields fields={fields} />);

  fields.forEach(({ testId }, index) => {
    const newValue = index.toString();
    const mockCallOrder = index + 1;

    const inputComponent = getByTestId(testId);
    fireEvent.changeText(inputComponent, newValue);

    expect(onChangeMock).toHaveBeenNthCalledWith(mockCallOrder, newValue);
  });
});
