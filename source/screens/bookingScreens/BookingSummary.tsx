import React from "react";
import styled from "styled-components/native";
import icons from "../../helpers/Icons";
import { Text } from "../../components/atoms";
import {
  DateTimeCard,
  AddressCard,
  CharacterCard,
} from "../../components/molecules";

const Container = styled.ScrollView`
  height: 80%;
  margin-top: 0px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${({ theme }) => theme.colors.neutrals[6]};
`;

const Title = styled(Text)`
  margin-top: 50px;
  margin-bottom: 15px;
`;

interface BookingSummaryProps {
  route: any;
}

const BookingSummary = ({ route }: BookingSummaryProps): JSX.Element => {
  const routeName = route?.name;
  const isConfirmation = routeName === "Confirmation";

  const { bookingItem } = route?.params;
  const { administrator } = bookingItem;
  const timeString =
    `${bookingItem.time.startTime.substring(0, 5)} - ` +
    `${bookingItem.time.endTime.substring(0, 5)}`;

  return (
    <Container>
      {isConfirmation && <Title type="h1">Din bokning har skickats</Title>}
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
