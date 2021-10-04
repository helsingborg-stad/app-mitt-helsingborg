import React, { useState } from "react";
import { Button } from "react-native";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import StoryWrapper from "../StoryWrapper";
import Text from "../../atoms/Text";

import BottomModal from "./BottomModal";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
`;

const Children = () => (
  <Text style={{ margin: 0, padding: 0 }}>
    This is my awesome children text
  </Text>
);

const OverviewExamples = () => {
  const [showModal, setShowModal] = useState({});

  const handleOnCLick = (id) => {
    const oldStateValue = showModal[id] || false;

    setShowModal((oldValues) => ({
      ...oldValues,
      [id]: !oldStateValue,
    }));
  };

  return (
    <FlexContainer>
      <Text type="h5">Default design</Text>
      <Button onPress={() => handleOnCLick("1")} title="open modal" />
      <BottomModal
        visible={showModal["1"]}
        onClose={() => handleOnCLick("1")}
        onBack={() => true}
        modalTitle="Vad vill du göra?"
      >
        <Children />
      </BottomModal>

      <Text type="h5">With red color schema</Text>
      <Button onPress={() => handleOnCLick("2")} title="open modal" />
      <BottomModal
        visible={showModal["2"]}
        onClose={() => handleOnCLick("2")}
        onBack={() => true}
        modalTitle="Vad vill du göra?"
        colorSchema="red"
      >
        <Children />
      </BottomModal>

      <Text type="h5">With buck button text</Text>
      <Button onPress={() => handleOnCLick("3")} title="open modal" />
      <BottomModal
        visible={showModal["3"]}
        onClose={() => handleOnCLick("3")}
        onBack={() => true}
        modalTitle="Vad vill du göra?"
        backButtonText="AVBRYT"
      >
        <Children />
      </BottomModal>
    </FlexContainer>
  );
};

storiesOf("BottomModal", module).add(
  "Overview examples",
  ({ style, kind, name, children }) => (
    <StoryWrapper style={style} kind={kind} name={name}>
      {children}
      <OverviewExamples />
    </StoryWrapper>
  )
);
