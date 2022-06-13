import React, { useState } from "react";
import { Button, Text } from "react-native";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import StoryWrapper from "../../molecules/StoryWrapper";

import AddCoApplicantModal from "./AddCoApplicantModal";

import { AddCoApplicantParameters } from "../../../types/CaseContext";

const Container = styled.View`
  width: 100%;
  height: 100%;
`;

const OverviewExamples = () => {
  const [showModal, setShowModal] = useState(false);
  const [parameters, setParameters] = useState({});
  const [isLoading, setIsloading] = useState(false);

  const toggleShowModal = () => {
    setParameters({});
    setShowModal((oldValue) => !oldValue);
  };

  const addApplicant = async (newParameters: AddCoApplicantParameters) => {
    setIsloading(true);
    setParameters(newParameters);
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
      <Text>Personal number added:</Text>
      <Text>{JSON.stringify(parameters, null, 2)}</Text>
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
