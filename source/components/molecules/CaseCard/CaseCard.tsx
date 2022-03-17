import React from "react";
import { ImageSourcePropType } from "react-native";
import styled from "styled-components/native";
import { Icon, Text } from "../../atoms";
import { Card, DateTimeCard } from "..";

Card.LargeText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  margin-bottom: 4px;
`;

Card.Meta = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  ${(props) => `color: ${props.theme.colors.neutrals[1]};`}
`;

Card.PinText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[9]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  line-height: 0px;
  margin-top: 12px;
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
  dateTimeCardSize?: "large" | "small";
  buttonColorScheme?: string;
  completions?: string[];
  completionDuedate: string;
  pin?: string;
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
  dateTimeCardSize = "large",
  buttonColorScheme = "red",
  completions = [],
  completionDuedate,
  pin,
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
      {pin && <Card.PinText>{pin}</Card.PinText>}

      {showBookingDate && (
        <DateTimeCard
          date={bookingDate}
          time={bookingTime}
          size={dateTimeCardSize}
        />
      )}

      {showProgress && (
        <Card.Progressbar
          currentStep={currentStep}
          totalStepNumber={totalSteps}
          mt={1}
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

      {completions.length > 0 && <Card.BulletList values={completions} />}

      {completionDuedate && (
        <Card.Text mt={1} colorSchema="neutral" fontSize={12}>
          Skicka in senast: <Text type="a">{completionDuedate}</Text>
        </Card.Text>
      )}

      {showButton && (
        <Card.Button
          mt={1}
          onClick={onButtonClick}
          colorSchema={buttonColorScheme}
        >
          <Text>{buttonText}</Text>
          <Icon name={buttonIconName || "arrow-forward"} />
        </Card.Button>
      )}
    </Card.Body>
  </Card>
);

export default CaseCard;
