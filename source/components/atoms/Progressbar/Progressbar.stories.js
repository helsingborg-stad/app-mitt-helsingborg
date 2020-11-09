import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Progressbar from './Progressbar';
import Button from '../Button/Button';
import Text from '../Text/Text';

storiesOf('Progressbar', module).add('Default', props => (
  <StoryWrapper {...props}>
    <ProgressBar />
  </StoryWrapper>
));

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
