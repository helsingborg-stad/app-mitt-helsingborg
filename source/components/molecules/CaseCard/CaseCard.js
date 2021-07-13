import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Text } from '../../atoms';
import { Card } from '..';

Card.LargeText = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[4]}px;
  font-weight: ${(props) => props.theme.fontWeights[1]};
  margin-bottom: 4px;
`;

Card.Meta = styled(Card.Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  ${(props) => `color: ${props.theme.colors.neutrals[1]};`}
`;

const CaseCard = ({
  colorSchema,
  icon,
  name,
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
}) => (
  <Card colorSchema={colorSchema}>
    <Card.Body shadow color="neutral" onPress={onCardClick}>
      {icon && <Card.Image source={icon} />}
      <Card.Title colorSchema="neutral">{name}</Card.Title>
      {largeSubtitle && <Card.LargeText mt={0.5}>{largeSubtitle}</Card.LargeText>}
      <Card.SubTitle>{subtitle}</Card.SubTitle>
      {description && <Card.Text>{description}</Card.Text>}

      {showProgress && <Card.Progressbar currentStep={currentStep} totalStepNumber={totalSteps} />}

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
          <Icon name={buttonIconName || 'arrow-forward'} />
        </Card.Button>
      )}
    </Card.Body>
  </Card>
);

CaseCard.propTypes = {
  colorSchema: PropTypes.string,
  icon: PropTypes.any,
  name: PropTypes.string,
  largeSubtitle: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  onCardClick: PropTypes.func,
  showProgress: PropTypes.bool,
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  showButton: PropTypes.bool,
  buttonText: PropTypes.string,
  buttonIconName: PropTypes.string,
  onButtonClick: PropTypes.func,
  showPayments: PropTypes.bool,
  approvedAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  declinedAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  givedate: PropTypes.string,
};

export default CaseCard;
