import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import FormList from './FormList';

const FormListStory = () => {
  const [formId, setFormId] = useState('');
  return (
    <FormList
      onClickCallback={async id => {
        setFormId(id);
      }}
    />
  );
};

storiesOf('Form List', module).add('default', props => (
  <StoryWrapper {...props}>
    <FormListStory />
  </StoryWrapper>
));
