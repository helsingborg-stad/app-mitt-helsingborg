import React from "react";
import { TouchableOpacity } from "react-native";
import { Text, Icon, Button } from "../../atoms";
import { BackgroundBlurWrapper } from "../../atoms/BackgroundBlur";
import { Modal, useModal } from "../Modal";
import {
  getValidColorSchema,
  PrimaryColor,
} from "../../../styles/themeHelpers";
import FileDisplay, { Image } from "../FileDisplay/FileDisplay";
import { splitFilePath } from "../../../helpers/FileUpload";
import { Pdf } from "../PdfDisplay/PdfDisplay";

import useImageUpload from "./useImageUpload";
import usePdfUpload from "./usePdfUpload";

import {
  Wrapper,
  ButtonContainer,
  PopupContainer,
  PopupButton,
  PopupLabel,
  Row,
} from "./styled";

export type ImageStatus = "loading" | "uploaded" | "error";
type File = Image | Pdf;

interface Props {
  buttonText: string;
  value: File[] | "";
  answers: Record<string, unknown>;
  colorSchema: PrimaryColor;
  maxImages?: number;
  id: string;
  preferredFileName?: string;
  onChange: (value: File[], id?: string) => void;
}

const FilePicker: React.FC<Props> = ({
  buttonText,
  value: files,
  answers,
  onChange,
  colorSchema,
  maxImages: maxFiles,
  id,
  preferredFileName,
}) => {
  const [choiceModalVisible, toggleChoiceModal] = useModal();

  const { addImagesFromLibrary, addImageFromCamera } = useImageUpload();
  const { addPdfFromLibrary } = usePdfUpload();

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
            <Row>
              <PopupLabel colorSchema={validColorSchema}>
                Lägg till fil
              </PopupLabel>
              <TouchableOpacity onPress={toggleChoiceModal} activeOpacity={1}>
                <Icon name="clear" />
              </TouchableOpacity>
            </Row>

            <PopupButton
              colorSchema={validColorSchema}
              block
              variant="outlined"
              onClick={handleUploadPdf}
            >
              <Icon name="upload-file" />
              <Text>Filer</Text>
            </PopupButton>
            <Row>
              <PopupLabel colorSchema={validColorSchema}>
                Lägg till bild
              </PopupLabel>
            </Row>
            <PopupButton
              colorSchema={validColorSchema}
              block
              variant="outlined"
              onClick={handleUploadImageFromCamera}
            >
              <Icon name="camera-alt" />
              <Text>Kamera</Text>
            </PopupButton>
            <PopupButton
              colorSchema={validColorSchema}
              block
              variant="outlined"
              onClick={handleUploadImageFromLibrary}
            >
              <Icon name="add-photo-alternate" />
              <Text>Bildbibliotek</Text>
            </PopupButton>
          </PopupContainer>
        </BackgroundBlurWrapper>
      </Modal>
    </>
  );
};

export default FilePicker;
