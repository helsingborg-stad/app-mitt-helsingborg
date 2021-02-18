import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import styled from 'styled-components/native';
import { DocumentPickerResponse } from 'react-native-document-picker';
import HorizontalScrollIndicator from '../../atoms/HorizontalScrollIndicator';
import ImageItem from './PdfItem';

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
}

interface Props {
  pdfs: Pdf[];
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
}

const PdfDisplay: React.FC<Props> = ({ pdfs, answers, onChange }) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] = useState(0);

  const deletePdfFromCloudStorage = async (pdf: Pdf) => {
    console.log('Placeholder: not implemented yet in API, want to delete pdf ', pdf.name, pdf.uri);
  };
  const removePdf = (pdf: Pdf) => {
    const answer: Pdf[] = answers[pdf.questionId];
    if (answer && Array.isArray(answer)) {
      const answerWithPdfRemoved = answer.filter((p) => pdf.uri !== p.uri);
      onChange(answerWithPdfRemoved, pdf.questionId);
    }
    deletePdfFromCloudStorage(pdf);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setHorizontalScrollPercentage(
      event.nativeEvent.contentOffset.x /
        (event.nativeEvent.contentSize.width - event.nativeEvent.layoutMeasurement.width)
    );
  };

  return (
    <Wrapper>
      <Container horizontal onScroll={handleScroll} showsHorizontalScrollIndicator={false}>
        {pdfs.length > 0 &&
          pdfs.map((pdf, index) => (
            <ImageItem
              key={`${pdf.uri}-${index}`}
              image={pdf}
              onRemove={() => {
                removePdf(pdf);
              }}
            />
          ))}
      </Container>
      {pdfs.length > 2 && <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />}
    </Wrapper>
  );
};

PdfDisplay.propTypes = {
  pdfs: PropTypes.arrayOf(PropTypes.object),
  answers: PropTypes.object,
  onChange: PropTypes.func,
};

export default PdfDisplay;
