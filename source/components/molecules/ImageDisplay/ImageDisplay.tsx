/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image as CropPickerImage } from 'react-native-image-crop-picker';
import styled from 'styled-components/native';
import HorizontalScrollIndicator from '../../atoms/HorizontalScrollIndicator';
import { PrimaryColor } from '../../../styles/themeHelpers';
import ImageItem from './ImageItem';

const Wrapper = styled.View`
  padding-left: 0;
  padding-right: 0;
  padding-top: 15px;
  padding-bottom: 0;
`;
const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
`;

export interface Image extends CropPickerImage {
  errorMessage?: string;
  uploadedFileName?: string;
  url?: string;
  questionId: string;
}

interface Props {
  images: Image[];
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
  colorSchema?: PrimaryColor;
}

const ImageDisplay: React.FC<Props> = ({ images, answers, onChange, colorSchema }) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] = useState(0);
  console.log('answers from display component:', answers);

  const deleteImageFromCloudStorage = async (image: Image) => {
    console.log('Placeholder: not implemented yet in API, want to delete image ', image.path);
  };
  const removeImage = (image: Image) => {
    const answer: Image[] = answers[image.questionId];
    if (answer && Array.isArray(answer)) {
      const answerWithImageRemoved = answer.filter((img) => img.path !== image.path);
      onChange(answerWithImageRemoved, image.questionId);
    }
    deleteImageFromCloudStorage(image);
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
        {images.map((image, index) => (
          <ImageItem
            key={`${image.path}-${index}`}
            image={image}
            onRemove={() => {
              removeImage(image);
            }}
          />
        ))}
      </Container>
      {images.length > 2 && <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />}
    </Wrapper>
  );
};

ImageDisplay.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
  answers: PropTypes.object,
  colorSchema: PropTypes.oneOf(['blue', 'red', 'green', 'purple', 'neutral']),
  onChange: PropTypes.func,
};

export default ImageDisplay;
