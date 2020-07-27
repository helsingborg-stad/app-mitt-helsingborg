import { storiesOf } from '@storybook/react-native';
import React from 'react';
import StoryWrapper from '../ScreenWrapper';
import HelpButton from './HelpButton';

const text = `Du som har ekonomiska problem och 
inte kan försörja dig själv eller din familj kan ansöka om ekonomiskt bistånd. 
Detta kallas ofta försörjningsstöd eller socialbidrag.

Alla kan under kortare eller längre perioder hamna i ekonomiska svårigheter. 
Det kan innebära att man behöver hjälp och stöd i frågor som rör den egna ekonomin.


Du får också hjälp att förändra din situation. Vilken hjälp du kan få beror på din och 
din familjs ekonomi och situation. Om du är gift eller sambo ska ni göra en gemensam ansökan.

om du söker första gången kommer du bli uppringd efter att du lämnat in din ansökan. Samtalet 
behövs för att vi ska kunna utreda rätten till bistånd.

om du söker första gången behöver du skicka underlag för
 boende, uppehållstillstånd och kontoöversikt.

Du kan kontakta oss för rådgivning innan du ansöker.

om du söker första gången behöver du skicka underlag 
för boende, uppehållstillstånd och kontoöversikt.

ekonomiskt bistånd är sista alternativet när alla andra alternativ är uttömda.
`;

const tagline = 'Hjälp';
const heading = 'Så här fungerar ekonomiskt bistånd';
const url = 'https://helsingborg.se/';

storiesOf('HelpButton', module)
  .add('With Text', props => (
    <StoryWrapper {...props}>
      <HelpButton text={text} heading={heading} tagline={tagline} url={url} />
    </StoryWrapper>
  ))
  .add('With Link', props => (
    <StoryWrapper {...props}>
      <HelpButton url={url} />
    </StoryWrapper>
  ));
