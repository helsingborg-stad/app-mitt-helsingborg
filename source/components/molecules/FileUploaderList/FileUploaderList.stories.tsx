import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import { Text } from "../../atoms";
import StoryWrapper from "../StoryWrapper";
import FileUploaderList from "./FileUploaderList";
import { File } from "../FilePicker/FilePicker";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  padding: 16px;
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 6px;
`;

const FileUploaderListStory = () => {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const onChange = (value: unknown, id: string) => {
    setAnswers((oldAnswers) => ({
      ...oldAnswers,
      [id]: value,
    }));
  };

  return (
    <FlexContainer>
      <Title>File Uploader List</Title>
      <FileUploaderList
        colorSchema="neutral"
        id="testUploaderList"
        list={[
          "Test item",
          "Another test item",
          '"Hej! jag, vill veta/kunna åäö."',
        ]}
        answers={answers}
        onChange={onChange}
      />
      <Title>Answers</Title>
      {Object.keys(answers).map((key) => (
        <Text key={key}>
          {key}:
          {(answers[key] as File[])
            .map((file) => `${file.filename}`)
            .join(", ")}
        </Text>
      ))}
    </FlexContainer>
  );
};

storiesOf("File Uploader List", module).add("Default", () => (
  <StoryWrapper>
    <FileUploaderListStory />
  </StoryWrapper>
));
