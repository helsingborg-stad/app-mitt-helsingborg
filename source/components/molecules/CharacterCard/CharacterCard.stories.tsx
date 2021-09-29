import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import { Text } from "../../atoms";
import StoryWrapper from "../StoryWrapper";
import CharacterCard from "./CharacterCard";
import icons from "../../../helpers/Icons";

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

const OverviewExamples = () => (
  <FlexContainer>
    <Title>Normalt utförande</Title>
    <CharacterCard
      onCardClick={() => true}
      title="Arnold Schwarzenegger"
      department="Socialförvaltningen"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
      selected={false}
    />

    <Title>Normalt utförande lång titel</Title>
    <CharacterCard
      onCardClick={() => true}
      title="Captain America Svensson"
      department="Socialförvaltningen"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
      selected={false}
    />

    <Title>Normalt utförande lång department namn</Title>
    <CharacterCard
      onCardClick={() => true}
      title="Clark Kent"
      department="Socialförvaltningen i Helsingborg"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
      selected={false}
    />

    <Title>Normalt utförande lång jobb titel</Title>
    <CharacterCard
      onCardClick={() => true}
      title="Wonderwoman"
      department="Socialförvaltningen"
      jobTitle="Socialsekreterare med superkrafter"
      icon={icons.ICON_CONTACT_PERSON_1}
      selected={false}
    />

    <Title>Valt utförande</Title>
    <CharacterCard
      onCardClick={() => true}
      title="Bruce Wayne"
      department="Socialförvaltningen"
      jobTitle="Socialsekreterare"
      icon={icons.ICON_CONTACT_PERSON_1}
      selected
    />
  </FlexContainer>
);

storiesOf("Character card", module).add(
  "Overview examples",
  ({ style, kind, name, children }) => (
    <StoryWrapper style={style} kind={kind} name={name}>
      {children}
      <OverviewExamples />
    </StoryWrapper>
  )
);
