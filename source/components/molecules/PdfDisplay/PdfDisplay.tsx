import React, { useState } from "react";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import styled from "styled-components/native";
import type { DocumentPickerResponse } from "react-native-document-picker";
import { HorizontalScrollIndicator } from "../../atoms";
import PdfItem from "./PdfItem";
import type { AllowedFileTypes } from "../../../helpers/FileUpload";

const Wrapper = styled.View`
  padding-left: 0;
  padding-right: 0;
  padding-top: 15px;
  padding-bottom: 0;
`;
const Container = styled.ScrollView`
  padding-left: 0px;
  padding-right: 16px;
`;

export interface Pdf extends DocumentPickerResponse {
  errorMessage?: string;
  uploadedFileName?: string;
  url?: string;
  questionId: string;
  fileCopyUri: string;
  name: string;
  size: number;
  type: string;
  fileType: AllowedFileTypes;
  path: string;
  filename?: string;
  displayName: string;
  id: string;
}

export interface UploadedPdf extends Pdf {
  uploadedFileName: string;
  url: string;
}

interface Props {
  pdfs: UploadedPdf[];
  answers: Record<string, unknown>;
  onChange: (value: UploadedPdf[], id?: string) => void;
}

const PdfDisplay: React.FC<Props> = ({ pdfs, answers, onChange }) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] =
    useState(0);

  const deletePdfFromCloudStorage = async (pdf: UploadedPdf) => {
    console.log(
      "Placeholder: not implemented yet in API, want to delete pdf ",
      pdf.name,
      pdf.uri
    );
  };

  const removePdf = (pdf: UploadedPdf) => {
    const answer = answers[pdf.questionId] as UploadedPdf[];

    if (answer && Array.isArray(answer)) {
      const answerWithPdfRemoved = answer.filter((p) => pdf.id !== p.id);
      onChange(answerWithPdfRemoved, pdf.questionId);
    }

    void deletePdfFromCloudStorage(pdf);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setHorizontalScrollPercentage(
      event.nativeEvent.contentOffset.x /
        (event.nativeEvent.contentSize.width -
          event.nativeEvent.layoutMeasurement.width)
    );
  };

  return (
    <Wrapper>
      <Container
        horizontal
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      >
        {pdfs.length > 0 &&
          pdfs.map((pdf) => (
            <PdfItem
              key={pdf.id}
              pdf={pdf}
              onRemove={() => {
                removePdf(pdf);
              }}
            />
          ))}
      </Container>
      {pdfs.length > 2 && (
        <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />
      )}
    </Wrapper>
  );
};

export default PdfDisplay;
