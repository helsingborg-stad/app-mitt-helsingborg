import React from "react";

import { Icon, Text } from "../../atoms";

import { Card, CompletionsClarificationOutset } from "./CaseCard.styled";

import type { Props } from "./CaseCard.types";

function CaseCard({
  title,
  subtitle,
  largeSubtitle,
  description,
  icon,
  colorSchema = "red",
  showProgress = false,
  currentStep,
  totalSteps,
  showButton = false,
  showAppealButton = false,
  buttonText,
  buttonIconName,
  showPayments = false,
  approvedAmount,
  declinedAmount,
  givedate,
  buttonColorScheme = "red",
  completions = [],
  completionsClarification = "",
  pin,
  showDownloadPdfButton,
  onCardClick,
  onButtonClick,
  onAppealButtonClick,
  onOpenPdf,
}: Props): JSX.Element {
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

        {showDownloadPdfButton && (
          <Card.Button mt={1} onClick={onOpenPdf} colorSchema="neutral">
            <Text>Visa inskickad ansökan</Text>
            <Icon name="picture-as-pdf" />
          </Card.Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default CaseCard;
