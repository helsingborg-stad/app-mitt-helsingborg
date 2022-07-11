import React, { useState } from "react";
import { ScrollView } from "react-native";
import { storiesOf } from "@storybook/react-native";

import StoryWrapper from "../StoryWrapper";
import FilePicker from "./FilePicker";

import { FileType } from "./FilePicker.types";
import type { File } from "./FilePicker.types";

const Component = () => {
  const [values, setValues] = useState<File[]>([]);
  const [answers, setAnswers] = useState({});

  const setAnswersAndValues = (files: File[], questionId: string) => {
    setAnswers((oldAnswers) => ({
      ...oldAnswers,
      [questionId]: files,
    }));

    setValues(files);
  };

  return (
    <FilePicker
      id="myQuestionId"
      preferredFileName="preferredName"
      answers={answers}
      buttonText="My button text"
      colorSchema="red"
      value={values}
      onChange={setAnswersAndValues}
      fileType={FileType.ALL}
    />
  );
};

storiesOf("FilePicker", module).add("Default", () => (
  <StoryWrapper>
    <ScrollView>
      <Component />
    </ScrollView>
  </StoryWrapper>
));
