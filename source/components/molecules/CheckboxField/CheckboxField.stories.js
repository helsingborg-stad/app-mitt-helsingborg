import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import StoryWrapper from '../StoryWrapper';
import CheckboxField from './CheckboxField';

storiesOf('CheckboxField', module).add('Default', props => (
  <StoryWrapper {...props}>
    <CheckboxFields />
  </StoryWrapper>
));

const CheckboxFields = injectProps => {
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
    <View>
      <CheckboxField
        text="Do you feel it? Light, small"
        color="light"
        size="small"
        checked={checkboxValues.box1}
        onChange={handleChange('box1')}
      />
      <CheckboxField
        text="Does it feel good? Can I ask longer questions here? How does it handle long strings?"
        color="gray"
        size="small"
        checked={checkboxValues.box2}
        onChange={handleChange('box2')}
      />
      <CheckboxField
        text="Is it happening? Light, medium"
        color="light"
        size="medium"
        checked={checkboxValues.box5}
        onChange={handleChange('box5')}
      />
      <View backgroundColor="rgb(29,32,37)">
        <CheckboxField
          text="Do you feel it? Dark theme"
          color="dark"
          size="small"
          checked={checkboxValues.box3}
          onChange={handleChange('box3')}
        />
        <CheckboxField
          text="Is it happening? Blue theme"
          color="blue"
          size="large"
          checked={checkboxValues.box4}
          onChange={handleChange('box4')}
        />
        <CheckboxField
          text="Is it happening? Blue theme"
          color="blue"
          size="large"
          checked={checkboxValues.box6}
          onChange={handleChange('box6')}
        />
      </View>
    </View>
  );
};
