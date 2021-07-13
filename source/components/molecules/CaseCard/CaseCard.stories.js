import React from 'react';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native';
import { Text, Icon } from '../../atoms';
import StoryWrapper from '../StoryWrapper';
import CaseCard from './CaseCard';
import icons from '../../../helpers/Icons';

import ICON_INCOME from '../../../assets/images/icons/icn_inkomster_1x.png';
import ICON_CONTACT from '../../../assets/images/icons/icn_contact_person_1x.png';

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

const Prop = styled(Text)`
  font-size: 14px;
  margin-bottom: 6px;
`;

storiesOf('Case Card', module)
  .add('Overview examples', (props) => (
    <StoryWrapper {...props}>
      <OverviewExamples />
    </StoryWrapper>
  ))
  .add('Summary examples', (props) => (
    <StoryWrapper {...props}>
      <SummaryExamples />
    </StoryWrapper>
  ));

const OverviewExamples = () => (
  <FlexContainer>
    <Title>Öppet</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Ekonomiskt Bistånd"
      subtitle="Öppen"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton
      buttonText="Starta ansökan"
    />

    <Title>Pågående</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Ekonomiskt Bistånd"
      subtitle="Pågående"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton
      buttonText="Fortsätt"
      showProgress
      currentStep={5}
      totalSteps={10}
    />

    <Title>Inskickad</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Ekonomiskt Bistånd"
      subtitle="Inskickad"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton={false}
    />

    <Title>Utbetald</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Ekonomiskt Bistånd"
      subtitle="Godkänd"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton={false}
      showPayments
      givedate="2021-08-01"
      approvedAmount="12345 kr"
    />

    <Title>Delvis Godkänd</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Ekonomiskt Bistånd"
      subtitle="Delvis godkänd"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton={false}
      showPayments
      givedate="2021-08-01"
      approvedAmount="12345 kr"
      declinedAmount="1234 kr"
    />

    <Title>Avslagen</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Ekonomiskt Bistånd"
      subtitle="Avslagen"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton={false}
      showPayments
      declinedAmount="1234 kr"
    />
  </FlexContainer>
);

const SummaryExamples = () => (
  <FlexContainer>
    <Title>Öppet</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Juni"
      subtitle="Öppen"
      description="Ansökan är öppen. Du kan nu söka ekonomiskt bistånd för perioden."
      showButton
      buttonText="Starta ansökan"
    />

    <Title>Öppet</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Juni"
      subtitle="Pågåenden"
      description="Ansökan är öppen. Du kan nu söka ekonomiskt bistånd för perioden."
      showButton
      buttonText="Fortsätt"
      showProgress
      currentStep={5}
      totalSteps={10}
    />

    <Title>Delvis Godkänd</Title>
    <CaseCard
      onCardClick={() => {}}
      colorSchema="red"
      name="Juni"
      subtitle="Pågåenden"
      description="Ansökan är öppen. Du kan nu söka ekonomiskt bistånd för perioden."
      showButton
      buttonText="Visa beslut"
      buttonIconName="remove-red-eye"
      showPayments
      givedate="2021-08-01"
      approvedAmount="12345 kr"
      declinedAmount="1234 kr"
    />
  </FlexContainer>
);
