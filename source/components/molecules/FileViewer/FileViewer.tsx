import React from "react";

import FileDisplay from "../FileDisplay/FileDisplay";
import type { File } from "../FilePicker/FilePicker";

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
  const files = questionIds
    .filter((id) => Array.isArray(answers[id]))
    .flatMap((id) => answers[id]);

  return <FileDisplay files={files} onChange={onChange} answers={answers} />;
};

export default FileViewer;
