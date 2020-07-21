import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native/dist';
import { StoryWrapper } from 'app/components/molecules';
import ConditionalTextField from 'app/components/molecules/ConditinalTextField/ConditionalTextField';

storiesOf('Conditional text field', module).add('default', () => (
  <StoryWrapper>
    <ConstTextFields />
  </StoryWrapper>
));

const ConstTextFields = () => {
  const [text, setText] = useState('');

  return (
    <ConditionalTextField
      checkboxDisableText="Disable text field"
      checkboxEnableText="Enable text field"
      onInputChange={setText}
      value={text}
    />
  );
};
