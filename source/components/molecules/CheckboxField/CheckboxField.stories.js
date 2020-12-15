import { storiesOf } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import StoryWrapper from '../StoryWrapper';
import CheckboxField from './CheckboxField';

storiesOf('CheckboxField', module).add('Default', (props) => (
  <StoryWrapper {...props}>
    <CheckboxFields />
  </StoryWrapper>
));

const CheckboxFields = () => {
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
        text="Do you feel it? Blue theme, small"
        color="blue"
        size="small"
        value={checkboxValues.box1}
        onChange={handleChange('box1')}
        help={{ text: 'some other helper text' }}
      />
      <CheckboxField
        text="Do you feel it? Neutral theme, small"
        color="neutral"
        size="small"
        value={checkboxValues.box1}
        onChange={handleChange('box1')}
        help={{ text: 'some other helper text' }}
      />
      <CheckboxField
        text="Does it feel good? Can I ask longer questions here? How does it handle long strings?"
        color="red"
        size="small"
        value={checkboxValues.box2}
        onChange={handleChange('box2')}
        help={{ text: 'some helper text' }}
      />
      <CheckboxField
        text="Is it happening? Green theme, medium"
        color="green"
        size="medium"
        value={checkboxValues.box5}
        onChange={handleChange('box5')}
      />
      <CheckboxField
        text="Do you feel it? Purple theme, small"
        color="purple"
        size="small"
        value={checkboxValues.box3}
        onChange={handleChange('box3')}
      />
      <CheckboxField
        text="Is it happening? Red theme, large"
        color="red"
        size="large"
        value={checkboxValues.box4}
        onChange={handleChange('box4')}
      />
      <CheckboxField
        text="Is it happening? Green theme, large"
        color="green"
        size="large"
        value={checkboxValues.box6}
        onChange={handleChange('box6')}
        help={{ text: 'some helper text' }}
      />
    </View>
  );
};
