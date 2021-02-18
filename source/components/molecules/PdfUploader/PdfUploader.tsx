import React from 'react';
import styled from 'styled-components/native';
import DocumentPicker, { DocumentPickerOptions } from 'react-native-document-picker';
import { Text, Button, Icon } from '../../atoms';
import { getBlob, uploadFile } from '../../../helpers/FileUpload';
import { getValidColorSchema, PrimaryColor } from '../../../styles/themeHelpers';
import PdfDisplay, { Pdf } from '../PdfDisplay/PdfDisplay';

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
  value: Pdf[] | '';
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
  colorSchema?: PrimaryColor;
  maxDocuments?: number;
  id: string;
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
  const addPdf = (newPdf: Pdf) => {
    const updatedPdfs = pdfs === '' ? [newPdf] : [...pdfs, newPdf];
    onChange(updatedPdfs);
    return updatedPdfs;
  };

  const uploadPdf = async (pdf: Pdf, index: number, updatedPdfs: Pdf[]) => {
    const data: Blob = await getBlob(pdf.uri);
    const uploadResponse = await uploadFile({
      endpoint: 'users/me/attachments',
      fileName: pdf.name,
      fileType: 'pdf',
      data,
    });

    if (uploadResponse.error) {
      updatedPdfs[index].errorMessage = uploadResponse.message;
    } else {
      updatedPdfs[index].uploadedFileName = uploadResponse.uploadedFilename;
      updatedPdfs[index].url = uploadResponse.url;
    }
    onChange(updatedPdfs);
  };

  const addPdfFromLibrary = async () => {
    const pickerOptions: DocumentPickerOptions<'android' | 'ios'> = {
      type: DocumentPicker.types.pdf,
    };

    try {
      const fileInfo = await DocumentPicker.pick(pickerOptions);

      const pdf: Pdf = { questionId: id, ...fileInfo };
      const originalLength = pdfs.length;
      const updatedPdfs = addPdf(pdf);
      // uploadPdf(pdf, originalLength, updatedPdfs);
    } catch (error) {
      console.log(error);
    }
  };

  const validColorSchema = getValidColorSchema(colorSchema);
  return (
    <>
      <Wrapper>
        {pdfs !== '' && <PdfDisplay pdfs={pdfs} onChange={onChange} answers={answers} />}
        <ButtonContainer>
          <Button
            colorSchema={validColorSchema}
            onClick={addPdfFromLibrary}
            disabled={maxDocuments && pdfs.length >= maxDocuments}
          >
            <Icon name="add" />
            <Text> {buttonText && buttonText !== '' ? buttonText : 'Ladda upp PDF'}</Text>
          </Button>
        </ButtonContainer>
      </Wrapper>
    </>
  );
};

export default PdfUploader;
