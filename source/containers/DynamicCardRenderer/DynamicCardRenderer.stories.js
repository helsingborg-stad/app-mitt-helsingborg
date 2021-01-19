import React from 'react';
import styled from 'styled-components/native';
import { storiesOf } from '@storybook/react-native';

import { Text } from '../../components/atoms';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import DynamicCardRenderer from './';

const userAgreementText = `
För att kunna handlägga din ansökan om ekonomiskt bistånd måste vi behandla följande personuppgifter om dig/er:  

+ För och efternamn samt mellannamn på dig, eventuell medsökande och barn 
+ Adress för dig och eventuell medsökande 
+ Personnummer för dig och eventuell medsökande 
+ Folkbokföringsadress 
+ Information om barns boendesituation samt om barnet går i skola eller står i kö till skola 
+ Inkomster och utgifter  
+ Sökt ersättning  
+ E-postadress 
+ Telefonnummer 
+ Civilstånd 
+ Medborgarskap 
+ Bostad 
+ Ekonomisk översikt.  
+ Tillgångar i form av fastighet, fordon 
+ Sysselsättning  
+ Uppgifter om hälsa. 
 

Den rättsliga grunden för behandlingen är rättslig förpliktelse, samtycke samt myndighetsutövning och uppgift av allmänt intresse. Uppgifterna sparas under 5 år i enlighet med Arbetsmarknadsnämndens dokumenthanteringsplan för att därefter gallras.  

Helsingborgs stad, Arbetsmarknadsnämnden, är personuppgiftsansvarig för den personuppgiftsbehandling som sker i e-tjänsten.  
`;

const FlexContainer = styled.ScrollView`
  background-color: #fff;
  padding: 16px;
`;

const Title = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 6px;
`;

const cardData = {
  colorSchema: 'blue',
  backgroundColor: 'blue',
  components: [
    { type: 'image', image: 'ICON_EXPENSES' },
    { type: 'title', text: 'Flat Card' },
    { type: 'subtitle', text: 'Subtitle' },
    { type: 'text', text: 'Some card text here' },
  ],
};

const cardData2 = {
  shadow: true,
  colorSchema: 'green',
  backgroundColor: 'neutral',
  components: [
    { type: 'image', image: 'ICON_CONTACT_PERSON', circle: true },
    { type: 'title', text: 'Contact us' },
    { type: 'subtitle', text: 'Subtitle' },
    { type: 'text', text: 'Some card text here' },
    {
      type: 'button',
      text: 'Do it!',
      action: 'email',
      email: 'test@test.com',
      icon: 'email',
      iconPosition: 'left',
    },
  ],
};

const cardData3 = {
  shadow: true,
  outlined: true,
  backgroundColor: 'red',
  colorSchema: 'red',
  components: [
    { type: 'title', text: 'Navigate somewhere' },
    { type: 'subtitle', text: 'Subtitle' },
    { type: 'text', text: 'Some card text here' },
    {
      type: 'button',
      text: 'Do it!',
      action: 'navigate',
      screen: 'UserEvents',
      icon: 'arrow-forward',
    },
  ],
};

const cardData4 = {
  shadow: false,
  outlined: true,
  backgroundColor: 'purple',
  colorSchema: 'purple',
  components: [
    { type: 'image', image: 'ICON_CONTACT_PERSON', circle: true },
    { type: 'subtitle', text: 'Subtitle' },
    { type: 'title', text: 'Purple theme' },
    { type: 'text', text: 'Some italic text here', italic: true },
  ],
};

const cardData5 = {
  shadow: true,
  outlined: false,
  backgroundColor: 'green',
  colorSchema: 'green',
  components: [
    { type: 'image', image: 'ICON_TELL' },
    { type: 'subtitle', text: 'Subtitle' },
    { type: 'title', text: 'Green theme' },
    {
      type: 'button',
      text: 'Helsingborg.se',
      action: 'url',
      url: 'https://www.helsingborg.se',
      icon: 'arrow-forward',
    },
  ],
};

const cardData6 = {
  shadow: true,
  outlined: false,
  backgroundColor: 'blue',
  colorSchema: 'blue',
  components: [
    { type: 'image', image: 'ICON_TELL' },
    { type: 'subtitle', text: 'Subtitle' },
    { type: 'title', text: 'Informationsmodal' },
    {
      type: 'button',
      text: 'Se Info',
      icon: 'help',
      action: 'infoModal',
      closeButtonText: 'Tillbaka',
      markdownText: userAgreementText,
      heading: 'Behandling av personuppgifter i e-tjänsten Ansök om Ekonomiskt bistånd',
    },
  ],
};

storiesOf('Dynamic Card Renderer', module).add('default', (props) => (
  <StoryWrapper {...props}>
    <FlexContainer>
      <Title>Some different card variants</Title>
      <DynamicCardRenderer {...cardData} />
      <DynamicCardRenderer {...cardData2} />
      <DynamicCardRenderer {...cardData3} />
      <DynamicCardRenderer {...cardData4} />
      <DynamicCardRenderer {...cardData5} />
      <DynamicCardRenderer {...cardData6} />
    </FlexContainer>
  </StoryWrapper>
));
