import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import Text from "../../atoms/Text";

import PinInfoModal from "./PinInfoModal";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
`;

const OverviewExamples = () => (
  <FlexContainer>
    <Text type="h5">Default design</Text>
    <PinInfoModal visible name="Karlos" pin="1234" onClose={() => true} />
  </FlexContainer>
);

storiesOf("PinInfoModal", module).add("Overview examples", () => (
  <OverviewExamples />
));
