import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import { Text } from "../../atoms";

import TaskCompletionList from "./TaskCompletionList";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
`;

const tasks = [
  { text: "This is a testing text", checked: false },
  { text: "This is a second testing text", checked: true },
  { text: "This is a third testing text", checked: false },
];

const OverviewExamples = () => (
  <FlexContainer>
    <Text type="h1">TaskCompletionList</Text>
    <Text type="h4">red</Text>
    <TaskCompletionList tasks={tasks} />
    <Text type="h4">green</Text>
    <TaskCompletionList colorSchema="green" tasks={tasks} />
    <Text type="h4">purple</Text>
    <TaskCompletionList colorSchema="purple" tasks={tasks} />
  </FlexContainer>
);

storiesOf("TaskCompletionList", module).add("Overview examples", () => (
  <OverviewExamples />
));
