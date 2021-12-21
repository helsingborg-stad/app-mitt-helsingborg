import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import { Text } from "../../atoms";

import BulletList from "./BulletList";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
  padding: 0px 24px;
`;

const values = [
  "This is a testing text",
  "This is a second testing text",
  "This is a third testing text",
];

const OverviewExamples = () => (
  <FlexContainer>
    <Text type="h1">BulletList</Text>
    <Text type="h4">red</Text>
    <BulletList values={values} />
    <Text type="h4">green</Text>
    <BulletList colorSchema="green" values={values} />
    <Text type="h4">purple</Text>
    <BulletList colorSchema="purple" values={values} />
  </FlexContainer>
);

storiesOf("BulletList", module).add("Overview examples", () => (
  <OverviewExamples />
));
