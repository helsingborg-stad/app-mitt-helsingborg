import { storiesOf } from "@storybook/react-native";
import React, { useState } from "react";
import styled from "styled-components/native";
import { Button } from "../../atoms";
import Text from "../../atoms/Text";
import StoryWrapper from "../../molecules/StoryWrapper";
import PinInputModal from "./PinInputModal";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
  margin-left: 30px;
`;

interface UsePinInputModalProps {
  error?: string;
}

type UsePinInputModalPropsReturn = [() => void, JSX.Element];

function usePinInputModal({
  error,
}: UsePinInputModalProps): UsePinInputModalPropsReturn {
  const [showModal, setShowModal] = useState(false);
  const [internalError, setInternalError] = useState<string | undefined>(
    undefined
  );

  const toggleShowModal = () => {
    setShowModal((currentValue) => !currentValue);
    setInternalError(undefined);
  };

  const onPinEntered = (pin: string) => {
    console.log(`entered pin ${pin}`);
    setInternalError("Oops! fel pin");
  };

  const element = (
    <PinInputModal
      visible={showModal}
      mainApplicantName="Karlos"
      onClose={toggleShowModal}
      onPinEntered={onPinEntered}
      error={internalError ?? error}
    />
  );

  return [toggleShowModal, element];
}

const OverviewExamples = () => {
  const [toggleModal, normalModal] = usePinInputModal({});
  const [toggleErrorModal, errorModal] = usePinInputModal({
    error: "test error message",
  });

  return (
    <FlexContainer>
      <Text type="h5" style={{ marginBottom: 10 }}>
        Default design
      </Text>

      <Button onClick={toggleModal} style={{ marginBottom: 10 }}>
        <Text>Show Normal Modal</Text>
      </Button>

      <Button onClick={toggleErrorModal}>
        <Text>Show Error Modal</Text>
      </Button>

      {normalModal}

      {errorModal}
    </FlexContainer>
  );
};

storiesOf("PinInputModal", module).add("Overview examples", () => (
  <StoryWrapper>
    <OverviewExamples />
  </StoryWrapper>
));
