import React from 'react';
import {storiesOf} from '@storybook/react-native';
import {Text} from '../components/atoms';
import styled from 'styled-components/native';
import StoryWrapper from '../../components/molecules/StoryWrapper';
import DynamicCardRenderer from './DynamicCardRenderer';

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
    {type: 'image', image: 'ICON_EXPENSES'},
    {type: 'title', text: 'Flat Card'},
    {type: 'subtitle', text: 'Subtitle'},
    {type: 'text', text: 'Some card text here'},
  ],
};

const cardData2 = {
  shadow: true,
  colorSchema: 'green',
  backgroundColor: 'neutral',
  components: [
    {type: 'image', image: 'ICON_CONTACT_PERSON', circle: true},
    {type: 'title', text: 'Contact us'},
    {type: 'subtitle', text: 'Subtitle'},
    {type: 'text', text: 'Some card text here'},
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
    {type: 'title', text: 'Navigate somewhere'},
    {type: 'subtitle', text: 'Subtitle'},
    {type: 'text', text: 'Some card text here'},
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
    {type: 'image', image: 'ICON_CONTACT_PERSON', circle: true},
    {type: 'subtitle', text: 'Subtitle'},
    {type: 'title', text: 'Purple theme'},
    {type: 'text', text: 'Some italic text here', italic: true},
  ],
};

const cardData5 = {
  shadow: true,
  outlined: false,
  backgroundColor: 'green',
  colorSchema: 'green',
  components: [
    {type: 'image', image: 'ICON_TELL'},
    {type: 'subtitle', text: 'Subtitle'},
    {type: 'title', text: 'Green theme'},
    {
      type: 'button',
      text: 'Helsingborg.se',
      action: 'url',
      url: 'https://www.helsingborg.se',
      icon: 'arrow-forward',
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
    </FlexContainer>
  </StoryWrapper>
));
