import { storiesOf } from "@storybook/react-native";
import React, { useState } from "react";
import styled from "styled-components/native";

import { Text, Button } from "../../atoms";
import { StoryWrapper } from "../../molecules";

import PrivacyModal from "./PrivacyModal";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
  margin-left: 30px;
`;

const OverviewExamples = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <FlexContainer>
      <Text type="h5" style={{ marginBottom: 10 }}>
        Default design
      </Text>

      <PrivacyModal visible={showModal} toggle={() => setShowModal(false)} />
      <Button onClick={() => setShowModal((oldValue) => !oldValue)}>
        <Text>{showModal ? "Hide" : "Show"} modal</Text>
      </Button>
    </FlexContainer>
  );
};

storiesOf("PrivacyModal", module).add("Overview examples", () => (
  <StoryWrapper>
    <OverviewExamples />
  </StoryWrapper>
));
