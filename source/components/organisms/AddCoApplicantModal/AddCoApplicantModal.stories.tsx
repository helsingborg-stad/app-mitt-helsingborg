import React, { useState } from "react";
import { Button, Text } from "react-native";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import StoryWrapper from "../../molecules/StoryWrapper";

import AddCoApplicantModal from "./AddCoApplicantModal";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const OverviewExamples = () => {
  const [showModal, setShowModal] = useState(false);
  const [personalNumber, setPersonalNumber] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const toggleShowModal = () => {
    setPersonalNumber("");
    setShowModal((oldValue) => !oldValue);
  };

  const addApplicant = async (newPersonalNumber: string) => {
    setIsloading(true);
    setPersonalNumber(newPersonalNumber);
    setTimeout(() => {
      setIsloading(false);
      setShowModal(false);
    }, 2000);
  };

  return (
    <>
      <AddCoApplicantModal
        visible={showModal}
        onClose={toggleShowModal}
        onAddCoApplicant={addApplicant}
        isLoading={isLoading}
      />
      <Text>Personal number added: {personalNumber}</Text>
      <Button title="Show modal" onPress={toggleShowModal} />
    </>
  );
};

storiesOf("AddCoApplicantModal", module).add("Default", () => (
  <StoryWrapper>
    <Container>
      <OverviewExamples />
    </Container>
  </StoryWrapper>
));
