import React from 'react';
import PropTypes from 'prop-types';
import ImageDisplay, { Image } from '../ImageDisplay/ImageDisplay';
import { PrimaryColor } from '../../../styles/themeHelpers';

interface Props {
  questionIds: string[];
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
  colorSchema?: PrimaryColor;
}

const ImageViewer: React.FC<Props> = ({ questionIds, answers, onChange, colorSchema }) => {
  const images: Image[] = [];
  questionIds.forEach((id) => {
    if (answers[id] && Array.isArray(answers[id])) {
      const imgs: Image[] = answers[id].map((img: Record<string, string>) => ({
        ...img,
        questionId: id,
      }));
      images.push(...imgs);
    }
  });

  return (
    <ImageDisplay images={images} onChange={onChange} colorSchema={colorSchema} answers={answers} />
  );
};

ImageViewer.propTypes = {
  questionIds: PropTypes.arrayOf(PropTypes.string),
  answers: PropTypes.object,
  onChange: PropTypes.func,
  colorSchema: PropTypes.oneOf(['blue', 'green', 'red', 'purple', 'neutral']),
};

export default ImageViewer;
