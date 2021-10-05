import React from "react";
import { Text } from "react-native";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../../test-utils";

import CollapsibleSection from "..";

const mockText = "mockText";
const mockSectionTitle = "mockTitle";

const ChildComponent = () => <Text>{mockText}</Text>;

it("renders the provided props (including children)", () => {
  const { queryByText } = render(
    <CollapsibleSection
      title={mockSectionTitle}
      collapsed={false}
      onPress={jest.fn()}
    >
      <ChildComponent />
    </CollapsibleSection>
  );

  const titleElement = queryByText(mockSectionTitle);
  const childTextElement = queryByText(mockText);

  expect(titleElement).not.toBeNull();
  expect(childTextElement).not.toBeNull();
});

it("calls the onPress callback when section is clicked", () => {
  const mockCallback = jest.fn();

  const { queryByText } = render(
    <CollapsibleSection
      title={mockSectionTitle}
      collapsed={false}
      onPress={mockCallback}
    >
      <ChildComponent />
    </CollapsibleSection>
  );

  const titleElement = queryByText(mockSectionTitle);
  fireEvent.press(titleElement);

  expect(mockCallback).toHaveBeenCalledTimes(1);
});
