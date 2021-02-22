import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Image as CropPickerImage } from 'react-native-image-crop-picker';
import styled from 'styled-components/native';
import HorizontalScrollIndicator from '../../atoms/HorizontalScrollIndicator';
import ImageItem from './ImageItem';
import { deleteUploadedFile } from '../../../helpers/FileUpload';

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
}

const ImageDisplay: React.FC<Props> = ({ images, answers, onChange }) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] = useState(0);

  const deleteImageFromCloudStorage = async (image: Image) => {
    deleteUploadedFile({
      endpoint: 'users/me/attachments',
      fileName: image.uploadedFileName,
    });
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
        {images.length > 0 &&
          images.map((image, index) => (
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
  onChange: PropTypes.func,
};

export default ImageDisplay;
