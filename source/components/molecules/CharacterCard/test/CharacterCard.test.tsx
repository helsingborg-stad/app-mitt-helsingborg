import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { render } from "../../../../../test-utils";

import { colorPalette } from "../../../../styles/palette";
import icons from "../../../../helpers/Icons";

import CharacterCard from "..";

jest.mock("../../../../helpers/Icons", () => ({
  default: "mockTitle.png",
}));

const { ICON_CONTACT_PERSON_1 } = icons;

const mockTitle = "mockTitle";
const mockDepartment = "mockDepartment";
const mockJobTitle = "mockJobTitle";

it("displays the provided props", () => {
  const { getByText } = render(
    <CharacterCard
      icon={ICON_CONTACT_PERSON_1}
      title={mockTitle}
      department={mockDepartment}
      jobTitle={mockJobTitle}
      onCardClick={jest.fn()}
      selected={false}
    />
  );

  const titleElement = getByText(mockTitle);
  const departmentElement = getByText(mockDepartment);
  const jobTitleElement = getByText(mockJobTitle);

  expect(titleElement).toHaveTextContent(mockTitle);
  expect(departmentElement).toHaveTextContent(mockDepartment);
  expect(jobTitleElement).toHaveTextContent(mockJobTitle);
});

it("calls the callback function on card click", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <CharacterCard
      icon={ICON_CONTACT_PERSON_1}
      title={mockTitle}
      department={mockDepartment}
      jobTitle={mockJobTitle}
      onCardClick={mockCallback}
      selected={false}
    />
  );

  const titleElement = getByText(mockTitle);
  fireEvent.press(titleElement);

  expect(mockCallback).toHaveBeenCalled();
});

it("changes color when selected", () => {
  const { getByTestId } = render(
    <CharacterCard
      icon={ICON_CONTACT_PERSON_1}
      title={mockTitle}
      department={mockDepartment}
      jobTitle={mockJobTitle}
      onCardClick={jest.fn()}
      selected
    />
  );

  const bodyElement = getByTestId("characterCard");

  expect(bodyElement).toHaveStyle({
    backgroundColor: colorPalette.complementary.red[3],
    borderColor: colorPalette.primary.red[4],
  });
});
