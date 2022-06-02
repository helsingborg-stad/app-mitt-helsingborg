import React, { useState } from "react";
import { Button } from "react-native";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import StoryWrapper from "../../molecules/StoryWrapper";

import StartNewApplicationModal from "./StartNewApplicationModal";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const OverviewExamples = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = () => {
    setShowModal((oldValue) => !oldValue);
  };

  return (
    <>
      <StartNewApplicationModal
        visible={showModal}
        onClose={toggleShowModal}
        onOpenForm={toggleShowModal}
        onChangeModal={toggleShowModal}
      />
      <Button title="Show modal" onPress={toggleShowModal} />
    </>
  );
};

storiesOf("StartNewApplicationModal", module).add("Default", () => (
  <StoryWrapper>
    <Container>
      <OverviewExamples />
    </Container>
  </StoryWrapper>
));
