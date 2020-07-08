import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import Text from 'source/components/atoms';
import { View } from 'react-native';
import StoryWrapper from '../StoryWrapper';

import SubstepButton from './SubstepButton';

const ICON_EKB = require('source/assets/images/icons/icn_Main_ekonomiskt-bistand_1x.png');
const ICON_BREIF = require('source/assets/images/icons/icn_sammanstallning_1x.png');

const testForm = {
  steps: [
    {
      title: 'Hej!',
      description: 'Först börjar vi med att bekräfta dina uppgifter. Stämmer det här?',
      group: 'Ekonomiskt Bistånd',
      image: '',
      icon: ICON_BREIF,
      actions: [
        {
          type: 'next',
          label: 'Ja, allt stämmer',
        },
      ],
      fields: [
        {
          id: 'testField',
          label: 'Namn',
          placeholder: 'Skriv ditt namn',
          type: 'text',
        },
      ],
      theme: {
        step: {
          bg: '#FFAA9B',
          banner: {},
          footer: {},
          text: {
            colors: {
              primary: '#00213F',
              secondary: '#733232',
            },
          },
        },
      },
    },
    {
      title: 'Okej...',
      description: 'Nu kommer lite frågor om dina inkomster',
      group: 'Inkomster',
      image: '',
      icon: ICON_BREIF,
      actions: [
        {
          type: 'submit',
          label: 'Avsluta och spara',
        },
      ],
      fields: [
        {
          id: 'incomeField',
          label: 'Lön',
          placeholder: '0',
          type: 'number',
        },
        {
          id: 'incomeSwishField',
          label: 'Swish',
          placeholder: '0',
          type: 'number',
        },
      ],
      theme: {
        step: {
          bg: '#FFAA9B',
          banner: {},
          footer: {},
          text: {
            colors: {
              primary: '#00213F',
              secondary: '#733232',
            },
          },
        },
      },
    },
  ],
};

storiesOf('SubstepButton', module).add('Default', props => (
  <StoryWrapper {...props}>
    <SubstepStory />
  </StoryWrapper>
));

const SubstepStory = props => {
  const [answers, setAnswers] = useState('');

  const updateVal = data => {
    setAnswers(data);
  };

  return (
    <SubstepButton
      text="Open sub-form"
      value={answers}
      form={testForm}
      onChange={updateVal}
    ></SubstepButton>
  );
};
