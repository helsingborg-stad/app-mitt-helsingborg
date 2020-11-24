import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Card } from 'app/components/molecules';
import { Text, Icon } from 'app/components/atoms';
import icons from 'source/helpers/Icons';
import { launchPhone } from 'source/helpers/LaunchExternalApp';

const Container = styled.View`
  padding: 24px;
`;

const CardBody = styled(Card.Body)`
  padding-top: 8px;
  padding-bottom: 8px;
`;

const StepConfirmation = ({ colorSchema }) => (
  <Container>
    <Card colorSchema="neutral">
      <CardBody>
        <Card.Image source={icons.ICON_EKB} />
        <Card.Text>
          Blir din ansökan godkänd får du besked om vilket datum som utbetalningen sker.{' '}
        </Card.Text>
      </CardBody>
    </Card>

    <Card colorSchema="neutral">
      <CardBody>
        <Card.Image source={icons.ICON_EKB} />
        <Card.Text>
          Om din ansökan blir delvis godkänd är det vissa kostnader du inte får ersättning för.{' '}
        </Card.Text>
      </CardBody>
    </Card>

    <Card colorSchema="neutral">
      <CardBody>
        <Card.Image source={icons.ICON_EKB} />
        <Card.Text>
          Blir din ansökan däremot avslagen får du inga pengar. Ett avslag går att överklaga.{' '}
        </Card.Text>
      </CardBody>
    </Card>

    <Card colorSchema={colorSchema}>
      <Card.Body>
        <Card.Text>
          Om du är i akut behov av pengar, eller har några frågor, kan du ringa din handläggare.
        </Card.Text>
        <Card.Text>
          Kontaktuppgifter till din handläggare hittar du på ärendesidan i appen.
        </Card.Text>
      </Card.Body>
    </Card>

    <Card colorSchema={colorSchema}>
      <Card.Body>
        <Card.Image source={icons.ICON_EKB_OUTLINE} />
        <Card.Title>Ekonomiskt{'\n'}bistånd</Card.Title>
        <Card.SubTitle>Inskickad</Card.SubTitle>
        <Card.Button>
          <Text>Öppna</Text>
          <Icon name="arrow-forward" />
        </Card.Button>
      </Card.Body>
    </Card>

    <Card colorSchema={colorSchema}>
      <Card.Body>
        <Card.Text italic>Eller ring stadens kontaktcenter på nummer 042 - 10 50 60</Card.Text>
        <Card.Button onClick={() => launchPhone('042-105060')}>
          <Text>Ring kontaktcenter</Text>
          <Icon name="help-outline" />
        </Card.Button>
      </Card.Body>
    </Card>
  </Container>
);

StepConfirmation.propTypes = {
  /**
   * The color schema for the view,
   */
  colorSchema: PropTypes.oneOf(['blue', 'red', 'purple', 'green']),
};

StepConfirmation.defaultProps = {
  colorSchema: 'blue',
};

export default StepConfirmation;
