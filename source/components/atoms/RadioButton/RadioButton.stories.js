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
        <Text style={{ margin: 10 }}>Small, blue color scheme</Text>
      </FlexRow>
      <FlexRow>
        <RadioButton
          selected={buttonValues.box2}
          onSelect={handleChange('box2')}
          size="small"
          colorSchema="red"
        />
        <Text style={{ margin: 10 }}>Small, red color scheme</Text>
      </FlexRow>
      <FlexRow>
        <RadioButton
          selected={buttonValues.box3}
          onSelect={handleChange('box3')}
          colorSchema="purple"
          size="medium"
        />
        <Text style={{ margin: 10 }}>Medium, purple color scheme</Text>
      </FlexRow>
      <FlexRow>
        <RadioButton
          selected={buttonValues.box4}
          onSelect={handleChange('box4')}
          colorSchema="green"
          size="large"
        />
        <Text style={{ margin: 10 }}>Large, green color scheme</Text>
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
