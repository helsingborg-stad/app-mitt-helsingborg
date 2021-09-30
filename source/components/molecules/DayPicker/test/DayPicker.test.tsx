import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { render } from "../../../../../test-utils";

import DayPicker from "..";

const mockStartDate = "2018-08-08";
const mockAvailableDates = ["2018-08-13"];

it("calls the callback function when an available date is clicked", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <DayPicker
      startDate={mockStartDate}
      availableDates={mockAvailableDates}
      selectedDate={undefined}
      onDateSelected={mockCallback}
    />
  );

  const dayElement = getByText("13");
  fireEvent.press(dayElement);

  expect(mockCallback).toHaveBeenCalled();
});

it("doesn't call the callback function when an unavailable date is clicked", () => {
  const mockCallback = jest.fn();

  const { getByText } = render(
    <DayPicker
      startDate={mockStartDate}
      availableDates={mockAvailableDates}
      selectedDate={undefined}
      onDateSelected={mockCallback}
    />
  );

  const dayElement = getByText("10");
  fireEvent.press(dayElement);

  expect(mockCallback).not.toHaveBeenCalled();
});
