import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Text from '../Text';
import Checkbox from './Checkbox';

storiesOf('Checkbox', module).add('Default', props => (
  <StoryWrapper {...props}>
    <Checkboxes />
  </StoryWrapper>
));

const Checkboxes = injectProps => {
  const [checkboxValues, setCValues] = useState({
    box1: false,
    box2: false,
    box3: false,
    box4: false,
    box5: false,
    box6: false,
    box7: false,
  });

  function handleChange(id) {
    return () => {
      setCValues({ ...checkboxValues, [id]: !checkboxValues[id] });
    };
  }
  return (
    <FlexContainer>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box1')}
          checked={checkboxValues.box1}
          color="blue"
          size="small"
          {...injectProps}
        />
        <Text>Small, blue color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box2')}
          checked={checkboxValues.box2}
          color="green"
          size="small"
          {...injectProps}
        />
        <Text>Small, green color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box3')}
          checked={checkboxValues.box3}
          color="red"
          size="small"
          {...injectProps}
        />
        <Text>Small, red color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box4')}
          checked={checkboxValues.box4}
          color="purple"
          size="medium"
          {...injectProps}
        />
        <Text>Medium size, purple color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box5')}
          checked={checkboxValues.box5}
          color="green"
          size="large"
          {...injectProps}
        />
        <Text>Large size, green color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box6')}
          checked={checkboxValues.box6}
          color="blue"
          size="large"
          {...injectProps}
        />
        <Text>Large size, blue color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box7')}
          checked={checkboxValues.box7}
          color="blue"
          size="medium"
          disabled
          {...injectProps}
        />
        <Text>Disabled, medium, blue color scheme</Text>
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
