import React from "react";
import { Text, Icon, Button } from "../../atoms";
import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";
import { Modal, useModal } from "../Modal";
import {
  getValidColorSchema,
  PrimaryColor,
} from "../../../styles/themeHelpers";
import FileDisplay from "../FileDisplay/FileDisplay";
import { splitFilePath } from "../../../helpers/FileUpload";
import { Pdf } from "../PdfDisplay/PdfDisplay";
import { Image } from "../ImageDisplay/ImageDisplay";

import { addImagesFromLibrary, addImageFromCamera } from "./imageUpload";
import { addPdfFromLibrary } from "./pdfUpload";
import PopupButton from "./PopupButton";
import PopupLabel from "./PopupLabel";

import { Wrapper, ButtonContainer, PopupContainer } from "./FilePicker.styled";

const maxNumberOfFilesDefault = 100;

export enum FileType {
  ALL = "all",
  PDF = "pdf",
  IMAGES = "images",
}

const fileTypeMap: Record<FileType, (FileType.PDF | FileType.IMAGES)[]> = {
  [FileType.ALL]: [FileType.PDF, FileType.IMAGES],
  [FileType.PDF]: [FileType.PDF],
  [FileType.IMAGES]: [FileType.IMAGES],
};

export type File = Image | Pdf;

interface Props {
  buttonText: string;
  value: File[] | "";
  answers: Record<string, File[]>;
  colorSchema: PrimaryColor;
  maxFiles?: number;
  id: string;
  preferredFileName?: string;
  fileType: FileType;
  onChange: (value: File[], id: string) => void;
}

const FilePicker: React.FC<Props> = ({
  buttonText,
  value: files,
  answers,
  onChange,
  colorSchema,
  maxFiles = maxNumberOfFilesDefault,
  id,
  preferredFileName,
  fileType,
}) => {
  const [choiceModalVisible, toggleChoiceModal] = useModal();

  const fileTypes = fileTypeMap[fileType] ?? fileTypeMap[FileType.ALL];

  const renameFileWithSuffix = (
    file: File,
    baseName: string,
    ext: string,
    suffix: string
  ) => ({
    ...file,
    filename: `${baseName}_${suffix}${ext}`,
  });

  const addFilesToState = (newFiles: File[]) => {
    let updatedFiles = files === "" ? [...newFiles] : [...files, ...newFiles];

    if (preferredFileName) {
      updatedFiles = updatedFiles.map((file, index) =>
        renameFileWithSuffix(
          file,
          preferredFileName,
          splitFilePath(file.filename).ext,
          index.toString()
        )
      );
    }

    if (updatedFiles.length > 0 && updatedFiles[0].questionId) {
      onChange(updatedFiles, updatedFiles[0].questionId);
    }
    return updatedFiles;
  };

  const uploadFile = async (callback: (id: string) => Promise<File[]>) => {
    const selectedFiles = await callback(id);

    if (selectedFiles.length > 0) {
      toggleChoiceModal();
      addFilesToState(selectedFiles);
    }
  };

  const handleUploadPdf = () => uploadFile(addPdfFromLibrary);
  const handleUploadImageFromCamera = () => uploadFile(addImageFromCamera);
  const handleUploadImageFromLibrary = () => uploadFile(addImagesFromLibrary);

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
          <FileDisplay files={files} onChange={onChange} answers={answers} />
        )}
        <ButtonContainer>
          <Button
            colorSchema={validColorSchema}
            onClick={toggleChoiceModal}
            disabled={!!maxFiles && files.length >= maxFiles}
          >
            <Icon name="add" />
            <Text>{buttonText || "Ladda upp fil"}</Text>
          </Button>
        </ButtonContainer>
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
