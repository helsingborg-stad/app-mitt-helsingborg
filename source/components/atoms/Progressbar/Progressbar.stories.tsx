import { storiesOf } from "@storybook/react-native";
import React, { useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import StoryWrapper from "../../molecules/StoryWrapper";
import Progressbar from "./Progressbar";
import Button from "../Button/Button";
import Text from "../Text/Text";

const Title = styled(Text)`
  padding-top: 8px;
  padding-bottom: 8px;
`;

const ProgressBar = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;
  const takeStep = () => {
    let nextStep = currentStep + 1;
    if (nextStep > totalSteps) nextStep = 1;
    setCurrentStep(nextStep);
  };
  return (
    <View style={{ paddingTop: 20 }}>
      <Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />
      <Button style={{ marginTop: 20 }} onClick={takeStep}>
        <Text>Take step</Text>
      </Button>
      <Text>
        Step {currentStep}/{totalSteps}
      </Text>
    </View>
  );
};

const ColorSchemas = () => (
  <>
    <Title type="h5">Neutral</Title>
    <Progressbar colorSchema="neutral" currentStep={1} totalStepNumber={2} />
    <Title type="h5">Red</Title>
    <Progressbar colorSchema="red" currentStep={1} totalStepNumber={2} />
    <Title type="h5">Green</Title>
    <Progressbar colorSchema="green" currentStep={1} totalStepNumber={2} />
    <Title type="h5">Blue</Title>
    <Progressbar colorSchema="blue" currentStep={1} totalStepNumber={2} />
    <Title type="h5">Purple</Title>
    <Progressbar colorSchema="purple" currentStep={1} totalStepNumber={2} />
  </>
);

storiesOf("Progressbar", module)
  .add("Default", () => (
    <StoryWrapper>
      <ProgressBar />
    </StoryWrapper>
  ))
  .add("Rounded", () => (
    <StoryWrapper>
      <Progressbar rounded currentStep={3} totalStepNumber={6} />
    </StoryWrapper>
  ))
  .add("Color schemas", () => (
    <StoryWrapper>
      <ColorSchemas />
    </StoryWrapper>
  ));
