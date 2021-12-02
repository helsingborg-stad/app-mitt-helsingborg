import React from "react";
import styled from "styled-components/native";
import { BookingItem } from "../../../types/BookingTypes";
import icons from "../../../helpers/Icons";
import { Text } from "../../../components/atoms";
import {
  DateTimeCard,
  AddressCard,
  CharacterCard,
} from "../../../components/molecules";

const Container = styled.ScrollView`
  height: 80%;
  margin-top: 0px;
  padding-top: 0px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${({ theme }) => theme.colors.neutrals[6]};
`;

const TitleWrapper = styled.View`
  margin-bottom: 15px;
`;

const Title = styled(Text)`
  margin: 15px 0px;
`;

interface BookingSummaryProps {
  route: any;
}

const BookingSummary = ({ route }: BookingSummaryProps): JSX.Element => {
  const bookingItem = route?.params?.bookingItem as BookingItem;
  const isConfirmation = route?.params?.isConfirmation;
  const { administrator } = bookingItem;
  const timeString =
    `${bookingItem.time.startTime.substring(0, 5)} - ` +
    `${bookingItem.time.endTime.substring(0, 5)}`;

  return (
    <Container>
      {isConfirmation && (
        <TitleWrapper>
          <Title type="h1" strong>
            Din bokning har skickats
          </Title>
          <Text type="h6">
            Om några förändringar sker med mötet kommer du bli meddelad.
          </Text>
        </TitleWrapper>
      )}
      <Title type="h2">Bokad tid</Title>
      <DateTimeCard date={bookingItem.date} time={timeString} />
      <Title type="h2">Du kommer träffa</Title>
      <CharacterCard
        onCardClick={() => true}
        title={administrator.title}
        department={administrator.department}
        jobTitle={administrator.jobTitle}
        email={administrator.email}
        phone={administrator.phone}
        icon={icons.ICON_CONTACT_PERSON_1}
        selected={false}
        showCheckbox={false}
      />
      <Title type="h2">Plats för mötet</Title>
      <AddressCard addressLines={bookingItem.addressLines} />
    </Container>
  );
};

export default BookingSummary;
