import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import FormList from './FormList';

const FormListStory = () => {
  const [formId, setFormId] = useState('');
  return (
<<<<<<< HEAD
    <FormList
      onClickCallback={async id => {
        setFormId(id);
      }}
    />
=======
    <>
      <FormList
        onClickCallback={async id => {
          setFormId(id);
          setModalVisible(true);
        }}
      />
    </>
>>>>>>> 22fd7c2... Removed old components dealing with substeps
  );
};

storiesOf('Form List', module).add('default', props => (
  <StoryWrapper {...props}>
    <FormListStory />
  </StoryWrapper>
));
