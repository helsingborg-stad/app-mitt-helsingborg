import React, { useState } from "react";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import HorizontalScrollIndicator from "../../atoms/HorizontalScrollIndicator";
import ImageItem from "../ImageDisplay/ImageItem";
import PdfItem from "../PdfDisplay/PdfItem";
import { remove } from "../../../helpers/ApiRequest";

import { Wrapper, Container } from "./FileDisplay.styled";
import { Pdf } from "../PdfDisplay/PdfDisplay";
import { Image } from "../ImageDisplay/ImageDisplay";

import { File } from "../FilePicker/FilePicker";

interface Props {
  files: File[];
  answers: Record<string, File[]>;
  onChange: (value: File[], id: string) => void;
}

const FileDisplay: React.FC<Props> = ({ files, answers, onChange }) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] =
    useState(0);

  const deleteFileFromCloudStorage = async (file: File) => {
    void remove(`users/me/attachments/${file.uploadedFileName}`);
  };

  const removeFile = (file: File) => {
    const answer = answers[file.questionId];
    if (answer && Array.isArray(answer)) {
      const newFiles = answer.filter(({ id }) => id !== file.id);
      onChange(newFiles, file.questionId);
    }

    if (file.uploadedFileName) {
      void deleteFileFromCloudStorage(file);
    }
  };

  const updateImage = (file: File) => {
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
