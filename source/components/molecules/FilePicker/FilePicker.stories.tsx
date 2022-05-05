import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import { ScrollView } from "react-native-gesture-handler";
import StoryWrapper from "../StoryWrapper";
import FilePicker from "./FilePicker";

const Component = () => {
  const [values, setValues] = useState([]);
  const [answers, setAnswers] = useState({});

  const setAnswersAndValues = (files: any[], questionId: string) => {
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
