import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Text from '../Text';
import RadioButton from './RadioButton';

storiesOf('RadioButtons', module).add('Default', props => (
  <StoryWrapper {...props}>
    <RadioButtons />
  </StoryWrapper>
));

const RadioButtons = injectProps => {
  const [buttonValues, setBValues] = useState({
    box1: false,
    box2: false,
    box3: false,
    box4: false,
  });

  function handleChange(id) {
    return () => {
      setBValues({ ...buttonValues, [id]: !buttonValues[id] });
    };
  }
  return (
    <FlexContainer>
      <FlexRow>
        <RadioButton selected={buttonValues.box1} onSelect={handleChange('box1')} size="small" />
        <Text>Small, white color scheme</Text>
      </FlexRow>
      <FlexRow>
        <RadioButton selected={buttonValues.box2} onSelect={handleChange('box2')} size="medium" />
        <Text>Small, dark color scheme</Text>
      </FlexRow>
      <FlexRow>
        <RadioButton
          selected={buttonValues.box3}
          onSelect={handleChange('box3')}
          color="light"
          size="medium"
        />
        <Text>Medium, light color scheme</Text>
      </FlexRow>
      <FlexRow>
        <RadioButton
          selected={buttonValues.box4}
          onSelect={handleChange('box4')}
          color="light"
          size="large"
        />
        <Text>Large, light color scheme</Text>
      </FlexRow>
    </FlexContainer>
  );
};

const FlexContainer = styled.View`
  flex: 1;
`;
const FlexRow = styled.View`
  flex-direction: row;
  max-height: 70px;
  height: 100%;
  flex: auto;
`;
