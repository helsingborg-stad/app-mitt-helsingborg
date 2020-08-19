import React, { useState, useEffect, useContext } from 'react';
import { storiesOf } from '@storybook/react-native';
import { View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import FormContext from 'app/store/FormContext';
import StoryWrapper from '../StoryWrapper';
import { Text } from '../../atoms';
import SubstepButton from './SubstepButton';

const ICON_EKB = require('source/assets/images/icons/icn_Main_ekonomiskt-bistand_1x.png');
const ICON_BREIF = require('source/assets/images/icons/icn_sammanstallning_1x.png');

storiesOf('SubstepButton', module).add('Default', props => (
  <StoryWrapper {...props}>
    <SubstepStory />
  </StoryWrapper>
));

const SubstepStory = props => {
  const [answers, setAnswers] = useState({});

  const updateVal = data => {
    setAnswers(data);
  };

  const subformId = 'a3165a20-ca10-11ea-a07a-7f5f78324df2';

  return (
    <View>
      <SubstepButton
        text="Open sub-form"
        color="dark"
        value={answers}
        formId={subformId}
        onChange={updateVal}
      ></SubstepButton>
      <Text>answers from substep: {JSON.stringify(answers, null, 2)}</Text>
    </View>
  );
};
