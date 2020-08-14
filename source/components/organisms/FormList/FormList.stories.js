import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { SubstepModal } from 'app/components/molecules';
import StoryWrapper from '../../molecules/StoryWrapper';
import FormList from './FormList';

const FormListStory = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [formId, setFormId] = useState('');
  return (
    <>
      <FormList
        onClickCallback={async id => {
          setFormId(id);
          setModalVisible(true);
        }}
      />
      <SubstepModal
        visible={modalVisible}
        setVisible={setModalVisible}
        value={{}}
        formId={formId}
      />
    </>
  );
};

storiesOf('Form List', module).add('default', props => (
  <StoryWrapper {...props}>
    <FormListStory />
  </StoryWrapper>
));
