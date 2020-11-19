import React, { useContext, useState, useEffect } from 'react';
import { Text, Icon } from 'app/components/atoms';
import { Card, Header, ScreenWrapper } from 'app/components/molecules';
import { CaseDispatch, CaseState, caseStatus, caseTypes } from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { formatUpdatedAt } from '../../helpers/DateHelpers';

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const SummaryHeading = styled(Text)`
  margin-left: 4px;
  margin-top: 30px;
  margin-bottom: 16px;
`;

const CaseSummary = ({ navigation, route }) => {
  const colorSchema = 'red';

  return (
    <ScreenWrapper>
      <Container>
        <SummaryHeading type="h5">Aktuell period</SummaryHeading>
        <Card colorSchema={colorSchema}>
          <Card.Body shadow color="neutral">
            <Card.Title>Oktober</Card.Title>
            <Card.SubTitle>Ansökan inlämnad</Card.SubTitle>
            <Card.Text>Vi har mottagit din ansökan för perioden 1-31 oktober.</Card.Text>
            <Card.Text italic>Vi skickar ut en notis när status för din ansökan ändras.</Card.Text>
          </Card.Body>
        </Card>

        <SummaryHeading type="h5">Nästa period</SummaryHeading>
        <Card>
          <Card.Text italic>Du kan ansöka om nästa period från den 10 oktober.</Card.Text>
        </Card>

        <SummaryHeading type="h5">Mina kontaktpersoner</SummaryHeading>
        <Card colorSchema={colorSchema}>
          <Card.Body shadow color="neutral">
            <Card.Title>Anna Andersson</Card.Title>
            <Card.SubTitle>Socialsekreterare</Card.SubTitle>
            <Card.Text>042 - 52 52 52</Card.Text>
          </Card.Body>
        </Card>
        <Card colorSchema={colorSchema}>
          <Card.Body shadow color="neutral">
            <Card.Title>Anna Andersson</Card.Title>
            <Card.SubTitle>Socialsekreterare</Card.SubTitle>
            <Card.Text>042 - 52 52 52</Card.Text>
          </Card.Body>
        </Card>

        <SummaryHeading type="h5">Tidigare ansökningar</SummaryHeading>
        <Card colorSchema={colorSchema}>
          <Card.Text italic>Här kan du titta på dina tidigare ansökningar.</Card.Text>
          <Card.Button>
            <Text>1-30 september</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
          <Card.Button>
            <Text>1-31 augusti</Text>
            <Icon name="arrow-forward" />
          </Card.Button>
        </Card>
      </Container>
    </ScreenWrapper>
  );
};

CaseSummary.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default CaseSummary;
