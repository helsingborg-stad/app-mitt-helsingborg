import React from 'react';
import { storiesOf } from '@storybook/react-native';
import StoryWrapper from '../../molecules/StoryWrapper';
import Step from './Step';

const ILLU_INCOME = require('source/assets/images/illustrations/illu_inkomster_margins_2x.png');
const ICON_INCOME = require('source/assets/images/icons/icn_inkomster_1x.png');

storiesOf('Step', module)
  .add('Default', () => (
    <StoryWrapper>
      <Step
        banner={{
          imageSrc: ILLU_INCOME,
          iconSrc: ICON_INCOME,
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
          imageSrc: ILLU_INCOME,
          iconSrc: ICON_INCOME,
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
