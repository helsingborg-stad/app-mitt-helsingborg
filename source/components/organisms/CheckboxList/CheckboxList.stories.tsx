import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import { Text } from "../../atoms";

import CheckboxList from "./CheckboxList";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
  padding: 0px 24px;
`;

const choices: { displayText: string; tags?: string[]; id: string }[] = [
  { displayText: "Text 1", id: "id-1" },
  { displayText: "Text 2", id: "id-2" },
  { displayText: "Text 3", id: "id-3" },
];

const values: Record<string, boolean> = { "id-1": true, "id-2": false };

const OverviewExamples = () => (
  <FlexContainer>
    <Text type="h1">CheckboxList</Text>
    <Text type="h4">red</Text>
    <CheckboxList value={values} choices={choices} />
    <Text type="h4">green</Text>
    <CheckboxList colorSchema="green" value={values} choices={choices} />
    <Text type="h4">purple</Text>
    <CheckboxList colorSchema="purple" value={values} choices={choices} />
  </FlexContainer>
);

storiesOf("CheckboxList", module).add("Overview examples", () => (
  <OverviewExamples />
));
