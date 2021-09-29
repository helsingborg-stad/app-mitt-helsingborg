import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { render } from "../../../../../test-utils";

import { colorPalette } from "../../../../styles/palette";

import DayPicker from "..";

const mockStartDate = "2018-04-08";
const mockAvailableDates = ["2018-04-13"];

jest.mock(
  "@react-navigation/stack/lib/commonjs/views/assets/back-icon.png",
  () => ({
    default: "mockTitle.png",
  })
);

it("calls the callback function when available date is clicked", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <DayPicker
      startDate={mockStartDate}
      availableDates={mockAvailableDates}
      onDateSelected={mockCallback}
    />
  );

  const dayElement = getByText("13");
  fireEvent.press(dayElement);

  expect(mockCallback).toHaveBeenCalled();
});

it("doesn't calls the callback function when unavailable date is clicked", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <DayPicker
      startDate={mockStartDate}
      availableDates={mockAvailableDates}
      onDateSelected={mockCallback}
    />
  );

  const dayElement = getByText("10");
  fireEvent.press(dayElement);

  expect(mockCallback).not.toHaveBeenCalled();
});

it("changes the color of date element when selected", () => {
  const { getByText } = render(
    <DayPicker
      startDate={mockStartDate}
      availableDates={mockAvailableDates}
      onDateSelected={() => true}
    />
  );

  const dayElement = getByText("13");

  expect(dayElement).toHaveStyle({
    backgroundColor: colorPalette.complementary.red[2],
  });

  fireEvent.press(dayElement);

  expect(dayElement).toHaveStyle({
    backgroundColor: colorPalette.primary.red[0],
  });
});
