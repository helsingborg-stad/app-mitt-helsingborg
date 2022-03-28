import React from "react";
import styled from "styled-components/native";
import DocumentPicker from "react-native-document-picker";
import { Text, Button, Icon } from "../../atoms";
import {
  getValidColorSchema,
  PrimaryColor,
} from "../../../styles/themeHelpers";
import PdfDisplay, { Pdf, UploadedPdf } from "../PdfDisplay/PdfDisplay";
import { AllowedFileTypes, splitFilePath } from "../../../helpers/FileUpload";

const Wrapper = styled.View`
  padding-left: 0;
  padding-right: 0;
  padding-top: 15px;
  padding-bottom: 0;
`;
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 100%;
`;

interface Props {
  buttonText: string;
  value: UploadedPdf[] | "";
  answers: Record<string, unknown>;
  colorSchema?: PrimaryColor;
  maxDocuments?: number;
  id: string;
  preferredFileName?: string;
  onChange: (value: Pdf[], id?: string) => void;
}

const renamePdfWithSuffix = (
  pdf: Pdf,
  baseName: string,
  ext: string,
  suffix: string
) => ({
  ...pdf,
  filename: `${baseName}_${suffix}.${ext}`,
});

const PdfUploader: React.FC<Props> = ({
  buttonText,
  value: pdfs,
  answers,
  colorSchema,
  maxDocuments,
  id,
  preferredFileName,
  onChange,
}) => {
  const addPdfFromLibrary = async () => {
    try {
      let files = await DocumentPicker.pick({
        type: DocumentPicker.types.pdf,
        allowMultiSelection: true,
      });

      if (preferredFileName) {
        files = files.map((pdf, index) =>
          renamePdfWithSuffix(
            pdf as Pdf,
            preferredFileName,
            splitFilePath(pdf?.name).ext,
            index.toString()
          )
        );
      }

      const filesWithQuestionId = files.map((pdf) => {
        const split = splitFilePath(pdf?.name);
        return {
          ...pdf,
          questionId: id,
          filename: pdf?.filename ?? `${split.name}${split.ext}`,
          fileType: "pdf" as AllowedFileTypes,
          path: pdf.uri,
        };
      });

      onChange(filesWithQuestionId);
    } catch (error) {
      if (!DocumentPicker.isCancel(error as Error)) {
        console.error("Error while adding pdf from library:", error);
      }
    }
  };

  const validColorSchema = getValidColorSchema(colorSchema ?? "Blue");
  return (
    <Wrapper>
      {pdfs !== "" && (
        <PdfDisplay pdfs={pdfs} onChange={onChange} answers={answers} />
      )}
      <ButtonContainer>
        <Button
          colorSchema={validColorSchema}
          onClick={addPdfFromLibrary}
          disabled={!!maxDocuments && pdfs.length >= maxDocuments}
        >
          <Icon name="add" />
          <Text>
            {" "}
            {buttonText && buttonText !== "" ? buttonText : "Ladda upp PDF"}
          </Text>
        </Button>
      </ButtonContainer>
    </Wrapper>
  );
};

export default PdfUploader;
