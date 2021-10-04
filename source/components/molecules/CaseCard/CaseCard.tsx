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

interface CaseCardProps {
  title: string;
  subtitle?: string;
  largeSubtitle?: string;
  description?: string;
  icon?: ImageSourcePropType;
  onCardClick?: () => void;
  colorSchema?: string;
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
}

const CaseCard = ({
  colorSchema,
  icon,
  title,
  largeSubtitle,
  subtitle,
  description,
  onCardClick,
  showProgress,
  currentStep,
  totalSteps,
  showButton,
  buttonText,
  buttonIconName,
  onButtonClick,
  showPayments,
  approvedAmount,
  declinedAmount,
  givedate,
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

CaseCard.defaultProps = {
  icon: undefined,
  subtitle: undefined,
  largeSubtitle: undefined,
  description: undefined,
  colorSchema: "red",
  onCardClick: () => true,
  showProgress: false,
  currentStep: undefined,
  totalSteps: undefined,
  showButton: false,
  buttonText: undefined,
  buttonIconName: undefined,
  onButtonClick: () => true,
  showPayments: false,
  approvedAmount: undefined,
  declinedAmount: undefined,
  givedate: undefined,
};

export default CaseCard;
