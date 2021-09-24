import React from 'react';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import { Text } from '../../atoms';
import StoryWrapper from '../StoryWrapper';
import CharacterCard from './CharacterCard';
import icons from '../../../helpers/Icons';

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

storiesOf('Character card', module).add('Overview examples', (props) => (
  <StoryWrapper {...props}>
    <OverviewExamples />
  </StoryWrapper>
));

const OverviewExamples = () => (
  <FlexContainer>
    <Title>Normalt utförande</Title>
    <CharacterCard
      onCardClick={() => {}}
      title="Arnold Schwarzenegger"
      appartment="Socialförvaltningen"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
    />

    <Title>Normalt utförande lång titel</Title>
    <CharacterCard
      onCardClick={() => {}}
      title="Captain America Svensson"
      appartment="Socialförvaltningen"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
    />

    <Title>Normalt utförande lång appartment namn</Title>
    <CharacterCard
      onCardClick={() => {}}
      title="Clark Kent"
      appartment="Socialförvaltningen i Helsingborg"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
    />

    <Title>Normalt utförande lång jobb titel</Title>
    <CharacterCard
      onCardClick={() => {}}
      title="Wonderwoman"
      appartment="Socialförvaltningen"
      jobTitle="Socialsekreterare med superkrafter"
      icon={icons.ICON_CONTACT_PERSON_1}
    />

    <Title>Valt utförande</Title>
    <CharacterCard
      onCardClick={() => {}}
      title="Bruce Wayne"
      appartment="Socialförvaltningen"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
      selected
    />
  </FlexContainer>
);
