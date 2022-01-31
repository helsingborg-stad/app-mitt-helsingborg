import React from "react";
import styled from "styled-components/native";
import DocumentPicker from "react-native-document-picker";
import { Text, Button, Icon } from "../../atoms";
import {
  getValidColorSchema,
  PrimaryColor,
} from "../../../styles/themeHelpers";
import PdfDisplay, { Pdf, UploadedPdf } from "../PdfDisplay/PdfDisplay";
import { getBlob, uploadFile } from "../../../helpers/FileUpload";

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
  onChange: (value: UploadedPdf[], id?: string) => void;
  colorSchema?: PrimaryColor;
  maxDocuments?: number;
  id: string;
}

async function uploadPdf(pdf: Pdf): Promise<UploadedPdf> {
  const data: Blob = await getBlob(pdf.uri);
  const uploadResponse = await uploadFile({
    endpoint: "users/me/attachments",
    fileName: pdf.name,
    fileType: "pdf",
    data,
  });

  if (uploadResponse.message) {
    throw new Error(uploadResponse.message);
  }

  return {
    ...pdf,
    uploadedFileName: uploadResponse.uploadedFileName,
    url: uploadResponse.url,
  };
}

function handlePdfFailedUpload(pdf: Pdf, error: Error) {
  console.error("failed to upload pdf", pdf.name, error);
}

async function handleUploadPdfs(pdfs: Pdf[]): Promise<UploadedPdf[]> {
  const uploadedPdfs = await Promise.all(
    pdfs.map(async (pdf) => {
      try {
        return await uploadPdf(pdf);
      } catch (error) {
        handlePdfFailedUpload(pdf, error as Error);
        return null;
      }
    })
  );

  return uploadedPdfs.filter((pdf) => pdf) as UploadedPdf[];
}

const PdfUploader: React.FC<Props> = ({
  buttonText,
  value: pdfs,
  answers,
  onChange,
  colorSchema,
  maxDocuments,
  id,
}) => {
  const addPdfFromLibrary = async () => {
    try {
      const files = await DocumentPicker.pick({
        type: DocumentPicker.types.pdf,
      });

      const filesWithQuestionId: Pdf[] = files.map((file) => ({
        ...file,
        questionId: id,
      }));

      const uploadedPdfs = await handleUploadPdfs(filesWithQuestionId);

      const newPdfs = [...(pdfs === "" ? [] : pdfs), ...uploadedPdfs];
      onChange(newPdfs);
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
