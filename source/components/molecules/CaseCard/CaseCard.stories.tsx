import React from "react";
import { storiesOf } from "@storybook/react-native";
import styled from "styled-components/native";
import { Text } from "../../atoms";
import StoryWrapper from "../StoryWrapper";
import CaseCard from "./CaseCard";
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
    <Title>Öppet</Title>
    <CaseCard
      colorSchema="red"
      title="Ekonomiskt Bistånd"
      subtitle="Öppen"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton
      buttonText="Starta ansökan"
    />

    <Title>Pågående</Title>
    <CaseCard
      colorSchema="red"
      title="Ekonomiskt Bistånd"
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
      colorSchema="red"
      title="Ekonomiskt Bistånd"
      subtitle="Inskickad"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton={false}
    />

    <Title>Utbetald</Title>
    <CaseCard
      colorSchema="red"
      title="Ekonomiskt Bistånd"
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
      colorSchema="red"
      title="Ekonomiskt Bistånd"
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
      colorSchema="red"
      title="Ekonomiskt Bistånd"
      subtitle="Avslagen"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton={false}
      showPayments
      declinedAmount="1234 kr"
    />

    <Title>Pin</Title>
    <CaseCard
      colorSchema="red"
      title="Ekonomiskt Bistånd"
      subtitle="Väntar på signering"
      largeSubtitle="Juni"
      icon={icons.ICON_EKB}
      showButton={false}
      description="Din pinkod är:"
      pin="1234"
    />
  </FlexContainer>
);

const SummaryExamples = () => (
  <FlexContainer>
    <Title>Öppet</Title>
    <CaseCard
      colorSchema="red"
      title="Juni"
      subtitle="Öppen"
      description="Ansökan är öppen. Du kan nu söka ekonomiskt bistånd för perioden."
      showButton
      buttonText="Starta ansökan"
    />

    <Title>Öppet</Title>
    <CaseCard
      colorSchema="red"
      title="Juni"
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
      colorSchema="red"
      title="Juni"
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

const BookingExamples = () => (
  <FlexContainer>
    <Title>Bokning skapad</Title>
    <CaseCard
      colorSchema="red"
      title="Planerad insats:"
      largeSubtitle="Boendestöd med Ditte"
      showBookingDate
      bookingDate="Fredag 4 juni"
      bookingTime="11:15 - 12:00"
      showButton
      buttonText="Boka om eller avboka"
    />
  </FlexContainer>
);

storiesOf("Case Card", module)
  .add("Overview examples", ({ style, kind, name, children }) => (
    <StoryWrapper style={style} kind={kind} name={name}>
      {children}
      <OverviewExamples />
    </StoryWrapper>
  ))
  .add("Summary examples", ({ style, kind, name, children }) => (
    <StoryWrapper style={style} kind={kind} name={name}>
      {children}
      <SummaryExamples />
    </StoryWrapper>
  ))
  .add("Booking examples", ({ style, kind, name, children }) => (
    <StoryWrapper style={style} kind={kind} name={name}>
      {children}
      <BookingExamples />
    </StoryWrapper>
  ));
