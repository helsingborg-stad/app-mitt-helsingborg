import React, { useState } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Image as CropPickerImage } from "react-native-image-crop-picker";
import HorizontalScrollIndicator from "../../atoms/HorizontalScrollIndicator";
import ImageItem from "../ImageDisplay/ImageItem";
import PdfItem from "../PdfDisplay/PdfItem";
import { remove } from "../../../helpers/ApiRequest";
import { AllowedFileTypes } from "../../../helpers/FileUpload";

import { Wrapper, Container } from "./FileDisplayed.styled";
import { Pdf } from "../PdfDisplay/PdfDisplay";

export interface Image extends CropPickerImage {
  errorMessage?: string;
  uploadedFileName?: string;
  url?: string;
  index?: number;
  questionId: string;
  fileType: AllowedFileTypes;
  id: string;
}

interface Props {
  files: (Image | Pdf)[];
  answers: Record<string, (Image | Pdf)[]>;
  onChange: (value: (Image | Pdf)[], id: string) => void;
}

const FileDisplay: React.FC<Props> = ({ files, answers, onChange }) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] =
    useState(0);

  const deleteImageFromCloudStorage = async (file: Image | Pdf) => {
    void remove(`users/me/attachments/${file.uploadedFileName}`);
  };

  const removeFile = (file: Image | Pdf) => {
    const answer = answers[file.questionId];
    if (answer && Array.isArray(answer)) {
      const newFiles = answer.filter(({ id }) => id !== file.id);
      onChange(newFiles, file.questionId);
    }
    void deleteImageFromCloudStorage(file);
  };

  const updateImage = (file: Image | Pdf) => {
    const answer = answers[file.questionId];
    const index = answer.findIndex(
      ({ uploadedFileName }) => uploadedFileName === file.uploadedFileName
    );
    answer[index] = file;
    onChange(answer, file.questionId);
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
        {files.map((file) => (
          <React.Fragment key={`fragment-${file.id}`}>
            {["jpg", "jpeg", "png"].includes(file.fileType.toLowerCase()) && (
              <ImageItem
                key={`image-${file.filename}-${file.id}`}
                image={file as Image}
                onRemove={() => {
                  removeFile(file);
                }}
                onChange={() => updateImage(file as Image)}
              />
            )}
            {file.fileType.toLowerCase() === "pdf" && (
              <PdfItem
                onRemove={() => {
                  removeFile(file);
                }}
                pdf={file as Pdf}
                key={`pdf-${file.filename}-${file.id}`}
              />
            )}
          </React.Fragment>
        ))}
      </Container>
      {files.length > 2 && (
        <HorizontalScrollIndicator percentage={horizontalScrollPercentage} />
      )}
    </Wrapper>
  );
};

export default FileDisplay;