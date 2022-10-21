import React from "react";
import sanitize from "sanitize-filename";
import type { Answers } from "../../../types/AnswerTypes";
import type { File } from "../FilePicker/FilePicker";
import FilePicker from "../FilePicker/FilePicker";
import type {
  FileUploaderInternalItem,
  FileUploaderProps,
} from "./FileUploaderList.types";
import {
  Container,
  UploaderLabel,
  UploaderLabelContainer,
} from "./FileUploaderList.styled";

function makeInternalItem(
  text: string,
  id: string,
  answers: Answers
): FileUploaderInternalItem {
  const files: File[] = (answers[id] as File[]) ?? [];

  return {
    text,
    id,
    files,
  };
}

function makeInternalItemsFromList(
  list: string[],
  baseId: string,
  answers: Answers
): FileUploaderInternalItem[] {
  return list.map((item, i) =>
    makeInternalItem(item, `${baseId}_${i}`, answers)
  );
}

export default function FileUploaderList({
  id,
  colorSchema,
  values,
  answers,
  onChange,
}: FileUploaderProps): JSX.Element {
  const items = makeInternalItemsFromList(values, id, answers);

  return (
    <>
      {items.map((entry) => (
        <Container key={entry.id}>
          <UploaderLabelContainer>
            <UploaderLabel colorSchema={colorSchema}>
              {entry.text}
            </UploaderLabel>
          </UploaderLabelContainer>
          <FilePicker
            colorSchema={colorSchema}
            buttonText="Ladda upp fil"
            value={entry.files}
            answers={answers as Record<string, File[]>}
            id={entry.id}
            preferredFileName={sanitize(entry.text)}
            onChange={onChange}
          />
        </Container>
      ))}
    </>
  );
}
