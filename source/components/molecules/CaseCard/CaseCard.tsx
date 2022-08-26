import React from "react";
import type { ImageSourcePropType } from "react-native";
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

Card.PinText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[9]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  line-height: ${(props) => props.theme.lineHeights[8]}px;
  margin-top: 12px;
`;

const CompletionsClarificationOutset = styled.View`
  padding-top: 8px;
  padding-bottom: 8px;
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
  showAppealButton?: boolean;
  buttonText?: string;
  buttonIconName?: string;
  onButtonClick?: () => void;
  onAppealButtonClick?: () => void;
  showPayments?: boolean;
  approvedAmount?: string | number;
  declinedAmount?: string | number;
  givedate?: string;
  buttonColorScheme?: string;
  completions?: string[];
  completionsClarification?: string;
  pin?: string;
}

function CaseCard({
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
  showAppealButton = false,
  buttonText,
  buttonIconName,
  onButtonClick,
  onAppealButtonClick,
  showPayments = false,
  approvedAmount,
  declinedAmount,
  givedate,
  buttonColorScheme = "red",
  completions = [],
  completionsClarification = "",
  pin,
}: CaseCardProps): JSX.Element {
  return (
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

        {completionsClarification && (
          <CompletionsClarificationOutset>
            <Card.Text strong italic colorSchema="neutral">
              {completionsClarification}
            </Card.Text>
          </CompletionsClarificationOutset>
        )}
        {completions.length > 0 && <Card.BulletList values={completions} />}

        {showAppealButton && (
          <Card.Button
            mt={1}
            onClick={onAppealButtonClick}
            colorSchema="neutral"
          >
            <Text>Så här gör du om du vill överklaga beslutet</Text>
            <Icon name={buttonIconName || "arrow-forward"} />
          </Card.Button>
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
}

export default CaseCard;
