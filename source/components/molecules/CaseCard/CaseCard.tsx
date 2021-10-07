import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";
import { Icon, Text } from "../../atoms";
import { Card } from "..";

Card.LargeText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  margin-bottom: 4px;
`;

Card.Meta = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  ${(props) => `color: ${props.theme.colors.neutrals[1]};`}
`;

Card.BookingContainer = styled.View`
  margin-top: 10px;
  border-width: 3px;
  border-radius: 5px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => `background-color: ${props.theme.colors.complementary.red[3]};`}
  ${(props) => `border-color: ${props.theme.colors.complementary.red[2]};`}
`;

Card.BookingTitle = styled.Text`
  font-size: ${(props) => props.theme.fontSizes[2]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  ${(props) => `color: ${props.theme.colors.primary.red[0]};`}
  padding: 5px;
`;

Card.BookingDate = styled.Text`
  font-size: ${(props) => props.theme.fontSizes[6]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  padding: 5px;
`;

Card.BookingTime = styled.Text`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  font-weight: ${(props) => props.theme.fontWeights[0]};
  padding: 5px;
`;

interface CaseCardProps {
  title: string;
  subtitle?: string;
  largeSubtitle?: string;
  description?: string;
  icon?: ImageSourcePropType;
  colorSchema?: string;
  onCardClick?: () => void;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  showButton?: boolean;
  buttonText?: string;
  buttonIconName?: string;
  onButtonClick?: () => void;
  showPayments?: boolean;
  approvedAmount?: string | number;
  declinedAmount?: string | number;
  givedate?: string;
  showBookingDate?: boolean;
  bookingDate?: string;
  bookingTime?: string;
}

const CaseCard = ({
  title,
  subtitle,
  largeSubtitle,
  description,
  icon,
  colorSchema = "red",
  onCardClick,
  showProgress = false,
  currentStep,
  totalSteps,
  showButton = false,
  buttonText,
  buttonIconName,
  onButtonClick,
  showPayments = false,
  approvedAmount,
  declinedAmount,
  givedate,
  showBookingDate = false,
  bookingDate,
  bookingTime,
}: CaseCardProps): JSX.Element => (
  <Card colorSchema={colorSchema}>
    <Card.Body shadow color="neutral" onPress={onCardClick}>
      {icon && <Card.Image source={icon} />}
      <Card.Title colorSchema="neutral">{title}</Card.Title>
      {largeSubtitle && (
        <Card.LargeText mt={0.5}>{largeSubtitle}</Card.LargeText>
      )}
      {subtitle && <Card.SubTitle>{subtitle}</Card.SubTitle>}
      {description && <Card.Text>{description}</Card.Text>}

      {showBookingDate && (
        <Card.BookingContainer>
          <Card.BookingTitle>TID FÖR MÖTE</Card.BookingTitle>
          <Card.BookingDate>{bookingDate}</Card.BookingDate>
          <Card.BookingTime>{bookingTime}</Card.BookingTime>
        </Card.BookingContainer>
      )}

      {showProgress && (
        <Card.Progressbar
          currentStep={currentStep}
          totalStepNumber={totalSteps}
        />
      )}

      {showPayments && approvedAmount && (
        <Card.Text mt={1.5} strong colorSchema="neutral">
          Utbetalning: {approvedAmount}
        </Card.Text>
      )}

      {showPayments && givedate && (
        <Card.Meta colorSchema="neutral">Betalas ut: {givedate}</Card.Meta>
      )}

      {showPayments && declinedAmount && (
        <Card.Text mt={1} strong colorSchema="neutral">
          Avslaget: {declinedAmount}
        </Card.Text>
      )}

      {showButton && (
        <Card.Button onClick={onButtonClick}>
          <Text>{buttonText}</Text>
          <Icon name={buttonIconName || "arrow-forward"} />
        </Card.Button>
      )}
    </Card.Body>
  </Card>
);

export default CaseCard;
