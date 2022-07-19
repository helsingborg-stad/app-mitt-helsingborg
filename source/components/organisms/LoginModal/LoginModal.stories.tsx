import { storiesOf } from "@storybook/react-native";
import React, { useState } from "react";
import styled from "styled-components/native";

import { Button, Text } from "../../atoms";
import { StoryWrapper } from "../../molecules";

import LoginModal from "./LoginModal";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
  margin-left: 30px;
`;

interface UseLoginModalProps {
  isLoading?: boolean;
  isIdle?: boolean;
  isResolved?: boolean;
  isRejected?: boolean;
}

type UseLoginModalPropsReturn = [() => void, JSX.Element];

function usePinInputModal({
  isLoading = false,
  isIdle = true,
  isResolved = false,
  isRejected = false,
}: UseLoginModalProps): UseLoginModalPropsReturn {
  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => {
    setShowModal((currentValue) => !currentValue);
  };

  const element = (
    <LoginModal
      visible={showModal}
      handleAuth={() => true}
      isLoading={isLoading}
      toggle={toggleShowModal}
      handleCancelOrder={toggleShowModal}
      isIdle={isIdle}
      isResolved={isResolved}
      isRejected={isRejected}
    />
  );

  return [toggleShowModal, element];
}

const OverviewExamples = () => {
  const [toggleDefaultModal, defaultModal] = usePinInputModal({});
  const [toggleLoadingModal, loadingModal] = usePinInputModal({
    isLoading: true,
  });

  return (
    <FlexContainer>
      <Text type="h5" style={{ marginBottom: 10 }}>
        Default design
      </Text>

      <Button onClick={toggleDefaultModal} style={{ marginBottom: 10 }}>
        <Text>Show default modal</Text>
      </Button>

      <Button onClick={toggleLoadingModal}>
        <Text>Show loading modal</Text>
      </Button>

      {defaultModal}

      {loadingModal}
    </FlexContainer>
  );
};

storiesOf("LoginModal", module).add("Overview examples", () => (
  <StoryWrapper>
    <OverviewExamples />
  </StoryWrapper>
));
