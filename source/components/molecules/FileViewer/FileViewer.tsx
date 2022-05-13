import React from "react";

import FileDisplay from "../FileDisplay/FileDisplay";
import { File } from "../FilePicker/FilePicker";

interface Props {
  questionIds: string[];
  answers: Record<string, File[]>;
  onChange: (value: File[], id: string) => void;
}
const FileViewer: React.FC<Props> = ({
  questionIds = [],
  answers,
  onChange,
}) => {
  const files: File[] = [];

  questionIds.forEach((id) => {
    if (Array.isArray(answers[id])) {
      files.push(...answers[id].map((file) => file));
    }
  });

  return <FileDisplay files={files} onChange={onChange} answers={answers} />;
};

export default FileViewer;
