import React from "react";
import { fireEvent, waitFor } from "@testing-library/react-native";

import { render } from "../../../../../test-utils";

import FilePicker from "../FilePicker";
import * as Pdf from "../pdfUpload";
import * as Images from "../imageUpload";

import { FileType } from "../FilePicker.types";
import type { ErrorValidation, File } from "../FilePicker.types";

jest.mock("../pdfUpload");
jest.mock("../imageUpload");

const componentButtonText = "My button text";
const addFileButtonText = "Filer";
const addImagesFromCameraButtonText = "Kamera";
const addImagesFromCameraLibraryButtonText = "Bildbibliotek";
const mockId = "mockId";
const mockErrorMessageText = "Error message";

interface Props {
  fileType?: FileType;
  error?: ErrorValidation;
  onChange?: () => Promise<void>;
}
const renderComponent = (props = {}) => {
  const {
    fileType = FileType.ALL,
    error = { isValid: true, message: "" },
    onChange = jest.fn(),
  }: Props = props;

  return render(
    <FilePicker
      answers={{}}
      buttonText={componentButtonText}
      colorSchema="red"
      id={mockId}
      fileType={fileType}
      onChange={onChange}
      value={[]}
      error={error}
    />
  );
};

it("renders the component", () => {
  const { getByText, queryByText } = renderComponent();

  expect(getByText(componentButtonText)).toHaveTextContent(componentButtonText);
  expect(queryByText(addFileButtonText)).toBeNull();
  expect(queryByText(addImagesFromCameraButtonText)).toBeNull();
  expect(queryByText(addImagesFromCameraLibraryButtonText)).toBeNull();
  expect(queryByText(mockErrorMessageText)).toBeNull();
});

it("renders the error message when provided", () => {
  const error = { isValid: false, message: mockErrorMessageText };

  const { queryByText } = renderComponent({ error });

  expect(queryByText(mockErrorMessageText)).not.toBeNull();
});

it("opens the bottom modal on component button click", () => {
  const { getByText } = renderComponent();

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
    const { getByText, queryByText } = renderComponent({ fileType });

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
  { buttonText: addFileButtonText, callback: Pdf.addPdfFromLibrary },
  {
    buttonText: addImagesFromCameraButtonText,
    callback: Images.addImageFromCamera,
  },
  {
    buttonText: addImagesFromCameraLibraryButtonText,
    callback: Images.addImagesFromLibrary,
  },
])(
  "it calls the $callback callback when $buttonText button is pressed",
  ({ buttonText, callback }) => {
    const { getByText } = renderComponent();

    const componentButton = getByText(componentButtonText);
    fireEvent.press(componentButton);

    const button = getByText(buttonText);
    fireEvent.press(button);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(mockId);
  }
);

it("calls the onChange callback with correct parameters", async () => {
  expect.assertions(2);

  const onChangeMock = jest.fn();
  const mockUploadedPdfFile: File = {
    questionId: mockId,
    mime: "application/pdf",
    id: "string",
    deviceFileName: "string",
    externalDisplayName: "string",
    uploadedId: "string",
  };
  jest
    .spyOn(Pdf, "addPdfFromLibrary")
    .mockResolvedValueOnce([mockUploadedPdfFile]);

  const { getByText } = renderComponent({ onChange: onChangeMock });

  const componentButton = getByText(componentButtonText);
  fireEvent.press(componentButton);

  const addFileButton = getByText(addFileButtonText);
  fireEvent.press(addFileButton);

  await waitFor(() => {
    expect(onChangeMock).toHaveBeenCalledWith([mockUploadedPdfFile], mockId);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});
