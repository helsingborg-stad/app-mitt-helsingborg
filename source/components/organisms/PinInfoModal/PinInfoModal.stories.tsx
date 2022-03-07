import React, { useState } from "react";
import { Button } from "react-native";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";

import Text from "../../atoms/Text";

import PinInfoModal from "./PinInfoModal";

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  flex: 1;
`;

const OverviewExamples = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = () => {
    setShowModal((currentValue) => !currentValue);
  };

  return (
    <FlexContainer>
      <Text type="h5">Default design</Text>
      <Button onPress={toggleShowModal} title="Show modal" />
      <PinInfoModal
        visible={showModal}
        name="Karlos"
        pin="1234"
        onClose={toggleShowModal}
      />
    </FlexContainer>
  );
};

storiesOf("PinInfoModal", module).add("Overview examples", () => (
  <OverviewExamples />
));
