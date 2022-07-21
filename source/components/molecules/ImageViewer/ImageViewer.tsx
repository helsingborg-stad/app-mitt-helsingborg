import React from "react";
import PropTypes from "prop-types";
import type { Image } from "../ImageDisplay/ImageDisplay";
import ImageDisplay from "../ImageDisplay/ImageDisplay";

interface Props {
  questionIds: string[];
  answers: Record<string, any>;
  onChange: (value: Record<string, any>[], id?: string) => void;
}

const ImageViewer: React.FC<Props> = ({ questionIds, answers, onChange }) => {
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

  return <ImageDisplay images={images} onChange={onChange} answers={answers} />;
};

ImageViewer.propTypes = {
  questionIds: PropTypes.arrayOf(PropTypes.string),
  answers: PropTypes.object,
  onChange: PropTypes.func,
};

export default ImageViewer;
