import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { StyleSheet } from 'react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Step from './Step';

const COAPPLICATION = require('source/images/illu_sammanstallning.png');

const styles = StyleSheet.create({
  smallIcon: {
    top: 283,
    right: -30,
  },
});

storiesOf('Step', module)
  .add('Default', () => (
    <StoryWrapper>
      <Step
        banner={{
          height: '327px',
          imageSrc: COAPPLICATION,
          imageStyle: styles.smallIcon,
        }}
        heading="Step heading"
        tagline="Step tagline"
        description={{
          heading: 'Vill du ansöka om Ekonomiskt bistånd igen?',
          tagline: 'Ansökan',
          text: 'Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.',
        }}
        footer={{
          buttons: [
            {
              label: 'Nästa',
              onClick: () => console.log('clicked'),
            },
          ],
        }}
      />
    </StoryWrapper>
  ))
  .add('Hide back button', () => (
    <StoryWrapper>
      <Step
        banner={{
          height: '327px',
          imageSrc: COAPPLICATION,
          imageStyle: styles.smallIcon,
        }}
        isBackBtnVisible={false}
        heading="Step heading"
        tagline="Step tagline"
        description={{
          heading: 'Vill du ansöka om Ekonomiskt bistånd igen?',
          tagline: 'Ansökan',
          text: 'Du kommer behöva ange inkomster, utgifter och kontrollera dina boende detaljer.',
        }}
        footer={{
          buttons: [
            {
              label: 'Nästa',
              onClick: () => console.log('clicked'),
            },
          ],
        }}
      />
    </StoryWrapper>
  ));
