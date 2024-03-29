import React from "react";
import { Text, Icon, Button } from "../../atoms";
import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";
import { Modal, useModal } from "../Modal";
import { getValidColorSchema } from "../../../theme/themeHelpers";
import FileDisplay from "../FileDisplay/FileDisplay";

import { addImagesFromLibrary, addImageFromCamera } from "./imageUpload";
import { addPdfFromLibrary } from "./pdfUpload";
import PopupButton from "./PopupButton";
import PopupLabel from "./PopupLabel";

import {
  Wrapper,
  ButtonContainer,
  PopupContainer,
  OverflowAvoidingView,
  ErrorText,
} from "./FilePicker.styled";

import type { Props, File } from "./FilePicker.types";
import { FileType } from "./FilePicker.types";

const fileTypeMap: Record<FileType, (FileType.PDF | FileType.IMAGES)[]> = {
  [FileType.ALL]: [FileType.PDF, FileType.IMAGES],
  [FileType.PDF]: [FileType.PDF],
  [FileType.IMAGES]: [FileType.IMAGES],
};

const mimeExtensionMap: Record<string, string> = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const FilePicker: React.FC<Props> = ({
  buttonText,
  value: files,
  answers,
  onChange,
  colorSchema,
  id,
  preferredFileName,
  fileType,
  error,
}) => {
  const [choiceModalVisible, toggleChoiceModal] = useModal();

  const fileTypes = fileTypeMap[fileType] ?? fileTypeMap[FileType.ALL];

  const renameFileWithSuffix = (
    file: File,
    baseName: string,
    suffix: string
  ): File => {
    const fileExtension = mimeExtensionMap[file.mime] ?? "";

    return {
      ...file,
      externalDisplayName: `${baseName}_${suffix}${fileExtension}`,
    };
  };

  const addFilesToState = (newFiles: File[]) => {
    let updatedFiles = files === "" ? [...newFiles] : [...files, ...newFiles];

    if (preferredFileName) {
      updatedFiles = updatedFiles.map((file, index) =>
        renameFileWithSuffix(file, preferredFileName, index.toString())
      );
    }

    if (updatedFiles.length > 0 && updatedFiles[0].questionId) {
      onChange(updatedFiles, updatedFiles[0].questionId);
    }
    return updatedFiles;
  };

  const addFile = async (callback: (id: string) => Promise<File[]>) => {
    const selectedFiles = await callback(id);

    if (selectedFiles.length > 0) {
      toggleChoiceModal();
      addFilesToState(selectedFiles);
    }
  };

  const handleUploadPdf = () => addFile(addPdfFromLibrary);
  const handleUploadImageFromCamera = () => addFile(addImageFromCamera);
  const handleUploadImageFromLibrary = () => addFile(addImagesFromLibrary);

  const modalMenuItems = {
    [FileType.PDF]: {
      label: "Lägg till fil",
      buttons: [
        {
          icon: "upload-file",
          buttonText: "Filer",
          callback: handleUploadPdf,
        },
      ],
    },
    [FileType.IMAGES]: {
      label: "Lägg till bild",
      buttons: [
        {
          icon: "camera-alt",
          buttonText: "Kamera",
          callback: handleUploadImageFromCamera,
        },
        {
          icon: "add-photo-alternate",
          buttonText: "Bildbibliotek",
          callback: handleUploadImageFromLibrary,
        },
      ],
    },
  };

  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <>
      <Wrapper>
        {files !== "" && (
          <OverflowAvoidingView>
            <FileDisplay files={files} onChange={onChange} answers={answers} />
          </OverflowAvoidingView>
        )}
        <ButtonContainer>
          <Button colorSchema={validColorSchema} onClick={toggleChoiceModal}>
            <Icon name="add" />
            <Text>{buttonText || "Ladda upp fil"}</Text>
          </Button>
        </ButtonContainer>

        {error?.isValid === false && <ErrorText>{error.message}</ErrorText>}
      </Wrapper>

      <Modal
        visible={choiceModalVisible}
        hide={toggleChoiceModal}
        presentationStyle="overFullScreen"
        transparent
        animationType="fade"
      >
        <BackgroundBlurWrapper>
          <PopupContainer colorSchema={validColorSchema}>
            {fileTypes.map((type, index) => (
              <React.Fragment key={type}>
                <PopupLabel
                  labelText={modalMenuItems[type].label}
                  showCloseButton={index === 0}
                  colorSchema={validColorSchema}
                  onClick={toggleChoiceModal}
                />

                {modalMenuItems[type].buttons.map((button) => (
                  <PopupButton
                    key={button.buttonText}
                    colorSchema={validColorSchema}
                    icon={button.icon}
                    buttonText={button.buttonText}
                    onClick={button.callback}
                  />
                ))}
              </React.Fragment>
            ))}
          </PopupContainer>
        </BackgroundBlurWrapper>
      </Modal>
    </>
  );
};

export default FilePicker;
