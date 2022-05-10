import React from "react";
import { fireEvent } from "@testing-library/react-native";

import { render } from "../../../../../test-utils";

import FilePicker, { FileType } from "../FilePicker";
import { addPdfFromLibrary } from "../pdfUpload";
import { addImageFromCamera, addImagesFromLibrary } from "../imageUpload";

jest.mock("../pdfUpload");
jest.mock("../imageUpload");

const componentButtonText = "My button text";
const addFileButtonText = "Filer";
const addImagesFromCameraButtonText = "Kamera";
const addImagesFromCameraLibraryButtonText = "Bildbibliotek";
const mockId = "mockId";

it("renders the component", async () => {
  const { getByText, queryByText } = render(
    <FilePicker
      answers={{}}
      buttonText={componentButtonText}
      colorSchema="red"
      id={mockId}
      fileType={FileType.ALL}
      onChange={jest.fn().mockResolvedValueOnce(undefined)}
      value={[]}
    />
  );

  expect(getByText(componentButtonText)).toHaveTextContent(componentButtonText);
  expect(queryByText(addFileButtonText)).toBeNull();
  expect(queryByText(addImagesFromCameraButtonText)).toBeNull();
  expect(queryByText(addImagesFromCameraLibraryButtonText)).toBeNull();
});

it("opens the bottom modal on component button click", async () => {
  const { getByText } = render(
    <FilePicker
      answers={{}}
      buttonText={componentButtonText}
      colorSchema="red"
      id={mockId}
      fileType={FileType.ALL}
      onChange={jest.fn().mockRejectedValue(undefined)}
      value={[]}
    />
  );

  const componentButton = getByText(componentButtonText);
  fireEvent.press(componentButton);

  expect(getByText(addFileButtonText)).toBeTruthy();
  expect(getByText(addImagesFromCameraButtonText)).toBeTruthy();
  expect(getByText(addImagesFromCameraLibraryButtonText)).toBeTruthy();
});

test.each([
  {
    fileType: FileType.ALL,
    shownButtons: [
      addFileButtonText,
      addImagesFromCameraButtonText,
      addImagesFromCameraLibraryButtonText,
    ],
    hiddenButtons: [],
  },
  {
    fileType: FileType.PDF,
    shownButtons: [addFileButtonText],
    hiddenButtons: [
      addImagesFromCameraButtonText,
      addImagesFromCameraLibraryButtonText,
    ],
  },
  {
    fileType: FileType.IMAGES,
    shownButtons: [
      addImagesFromCameraButtonText,
      addImagesFromCameraLibraryButtonText,
    ],
    hiddenButtons: [addFileButtonText],
  },
])(
  "it renders the $shownButtons buttons and hides $hiddenButtons for fileType $fileType",
  ({ fileType, shownButtons, hiddenButtons }) => {
    const { getByText, queryByText } = render(
      <FilePicker
        answers={{}}
        buttonText={componentButtonText}
        colorSchema="red"
        id={mockId}
        fileType={fileType}
        onChange={jest.fn().mockRejectedValue(undefined)}
        value={[]}
      />
    );

    const componentButton = getByText(componentButtonText);
    fireEvent.press(componentButton);

    shownButtons.forEach((button) => {
      expect(getByText(button)).toBeTruthy();
    });
    hiddenButtons.forEach((button) => {
      expect(queryByText(button)).toBeNull();
    });
  }
);

test.each([
  { buttonText: addFileButtonText, callback: addPdfFromLibrary },
  { buttonText: addImagesFromCameraButtonText, callback: addImageFromCamera },
  {
    buttonText: addImagesFromCameraLibraryButtonText,
    callback: addImagesFromLibrary,
  },
])(
  "it calls the $callback callback when $buttonText button is pressed",
  ({ buttonText, callback }) => {
    const { getByText } = render(
      <FilePicker
        answers={{}}
        buttonText={componentButtonText}
        colorSchema="red"
        id={mockId}
        fileType={FileType.ALL}
        onChange={jest.fn().mockRejectedValue(undefined)}
        value={[]}
      />
    );

    const componentButton = getByText(componentButtonText);
    fireEvent.press(componentButton);

    const button = getByText(buttonText);
    fireEvent.press(button);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(mockId);
  }
);
