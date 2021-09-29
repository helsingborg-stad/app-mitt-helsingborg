import React from "react";
import { fireEvent } from "@testing-library/react-native";
import { render } from "../../../../../test-utils";

import { colorPalette } from "../../../../styles/palette";
import TimeSpanButton from "..";

const timeStartMock = "10:00";
const timeEndMock = "12:00";
const timeSpan = `${timeStartMock} - ${timeEndMock}`;

it("displays the provided props", () => {
  const { getByText, getByTestId, queryByTestId } = render(
    <TimeSpanButton selected={false} onClick={jest.fn()}>
      {timeSpan}
    </TimeSpanButton>
  );

  const timeSpanTextElement = getByText(timeSpan);
  const buttonElement = getByTestId("timeSpanButton");
  const checkMarkIcon = queryByTestId("timespanbutton_checkmarkIcon");

  expect(buttonElement).toContainElement(timeSpanTextElement);
  expect(timeSpanTextElement).toHaveTextContent(timeSpan);
  expect(buttonElement).not.toContainElement(checkMarkIcon);
});

it("calls the onClick callback when clicked", () => {
  const onClickCallbackMock = jest.fn();

  const { getByText } = render(
    <TimeSpanButton selected={false} onClick={onClickCallbackMock}>
      {timeSpan}
    </TimeSpanButton>
  );

  const timeSpanTextElement = getByText(timeSpan);
  fireEvent.press(timeSpanTextElement);

  expect(onClickCallbackMock).toHaveBeenCalledTimes(1);
});

it("does not call the onClick callback when selected", () => {
  const onClickCallbackMock = jest.fn();

  const { getByText } = render(
    <TimeSpanButton selected onClick={onClickCallbackMock}>
      {timeSpan}
    </TimeSpanButton>
  );

  const timeSpanTextElement = getByText(timeSpan);
  fireEvent.press(timeSpanTextElement);

  expect(onClickCallbackMock).toHaveBeenCalledTimes(0);
});

it("changes style and show icon when selected", () => {
  const { getByTestId } = render(
    <TimeSpanButton selected onClick={jest.fn()}>
      {timeSpan}
    </TimeSpanButton>
  );

  const buttonElement = getByTestId("timeSpanButton");
  const checkMarkIcon = getByTestId("timespanbutton_checkmarkIcon");

  expect(buttonElement).toContainElement(checkMarkIcon);
  expect(buttonElement).toHaveStyle({
    backgroundColor: colorPalette.primary.red[1],
  });
});
