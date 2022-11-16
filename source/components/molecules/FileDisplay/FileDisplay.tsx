import React, { useState } from "react";
import type { NativeSyntheticEvent, NativeScrollEvent } from "react-native";

import { ImageItem, PdfItem } from "..";

import { HorizontalScrollIndicator } from "../../atoms";

import { Wrapper, Container } from "./FileDisplay.styled";

import type { File } from "../FilePicker/FilePicker.types";
import defaultFileStorageService from "../../../services/storage/fileStorage/FileStorageService";

interface Props {
  files: File[];
  answers: Record<string, File[]>;
  onChange: (value: File[], id: string) => void;
}

const FileDisplay: React.FC<Props> = ({ files, answers, onChange }) => {
  const [horizontalScrollPercentage, setHorizontalScrollPercentage] =
    useState(0);

  const removeFile = (file: File) => {
    void defaultFileStorageService.removeFile(file.id);

    const answer = answers[file.questionId];
    if (answer && Array.isArray(answer)) {
      const newFiles = answer.filter(({ id }) => id !== file.id);
      onChange(newFiles, file.questionId);
    }
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
            {file.mime.toLowerCase().startsWith("image/") && (
              <ImageItem
                key={`image-${file.id}`}
                file={file}
                onRemove={() => {
                  removeFile(file);
                }}
              />
            )}
            {file.mime.toLowerCase() === "application/pdf" && (
              <PdfItem
                onRemove={() => {
                  removeFile(file);
                }}
                file={file}
                key={`pdf-${file.id}`}
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
