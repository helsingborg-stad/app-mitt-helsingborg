import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../StoryWrapper';
import ButtonListField from './ButtonListField';

const testOptions = [
  {
    text: 'coolkid',
    icon: '3d-rotation',
    value: 'buttonOne',
  },
  {
    text: 'collkid2',
    icon: '3d-rotation',
    value: 'button2',
  },
  {
    text: 'coolkid3',
    value: 'button3',
  },
];

function ButtonListFieldStory(props) {
  const [values, setValues] = useState({});

  const handleChange = data => {
    const updatedValue = values[data.id] ? [...values[data.id], data.value] : [data.value];
    setValues({ ...values, [data.id]: updatedValue });
  };

  return (
    <StoryWrapper>
      <ButtonListField onChange={handleChange} {...props} />
    </StoryWrapper>
  );
}

storiesOf('ButtonListField', module)
  .add('Normal', () => (
    <ButtonListFieldStory id="someExampleId" options={testOptions} title="Editable List" />
  ))
  .add('Label', () => (
    <ButtonListFieldStory
      label="ButtonListField"
      id="someExampleId"
      options={testOptions}
      title="Editable List"
    />
  ))
  .add('Icon', () => (
    <ButtonListFieldStory id="someExampleId" options={testOptions} title="Editable List" />
  ));
