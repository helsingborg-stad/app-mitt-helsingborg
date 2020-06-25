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
          color="white"
          size="small"
          {...injectProps}
        />
        <Text>Small, white color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box2')}
          checked={checkboxValues.box2}
          color="dark"
          size="small"
          {...injectProps}
        />
        <Text>Small, dark color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box3')}
          checked={checkboxValues.box3}
          color="light"
          size="small"
          {...injectProps}
        />
        <Text>Small, light color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box4')}
          checked={checkboxValues.box4}
          color="light"
          size="medium"
          {...injectProps}
        />
        <Text>Medium size, light color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box5')}
          checked={checkboxValues.box5}
          color="dark"
          size="large"
          {...injectProps}
        />
        <Text>Large size, dark color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box6')}
          checked={checkboxValues.box6}
          color="gray"
          size="large"
          {...injectProps}
        />
        <Text>Large size, gray color scheme</Text>
      </FlexRow>
      <FlexRow>
        <Checkbox
          onChange={handleChange('box7')}
          checked={checkboxValues.box7}
          color="gray"
          size="medium"
          disabled="true"
          {...injectProps}
        />
        <Text>Disabled, gray color scheme</Text>
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
