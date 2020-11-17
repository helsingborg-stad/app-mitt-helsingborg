import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { Button, Text, Heading, Box, Icon } from 'app/components/atoms';
import { ScreenWrapper, Header, Card } from 'app/components/molecules';
import AuthContext from 'app/store/AuthContext';
import PropTypes from 'prop-types';

const ILLU_WALLET = require('source/assets/images/icons/icn_inkomster_red_1x.png');

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const CaseHeading = styled(Text)`
  margin-bottom: 12px;
`;

function ProfileScreen(props) {
  const {
    navigation: { navigate },
  } = props;

  return (
    <ScreenWrapper>
      <Header title="Dina ärenden" />
      <Container>
        <Card colorSchema="red">
          <Card.Body outlined>
            <Card.Title>Hej!</Card.Title>
            <Card.Text>
              Helsingborgs Stad testar att göra självservice lite mer personlig och i första steget
              så är det just Ekonomiskt Bistånd som står i fokus.
            </Card.Text>
          </Card.Body>
        </Card>

        <Card colorSchema="red">
          <Card.Body shadow color="neutral">
            <Card.Image source={ILLU_WALLET} />
            <Card.Title>Ekonomiskt{'\n'}bistånd</Card.Title>
            <Card.Button>
              <Text>Starta ansökan</Text>
              <Icon name="arrow-forward" />
            </Card.Button>
          </Card.Body>
        </Card>

        <CaseHeading type="h5" strong>
          Aktiva
        </CaseHeading>
        <Card colorSchema="red">
          <Card.Body shadow color="neutral">
            <Card.Image source={ILLU_WALLET} />
            <Card.Title>Ekonomiskt{'\n'}bistånd</Card.Title>
            <Card.SubTitle>Steg 3 / 8</Card.SubTitle>
            <Card.Button>
              <Text>Fortsätt ansökan</Text>
              <Icon name="arrow-forward" />
            </Card.Button>
          </Card.Body>
        </Card>
      </Container>
    </ScreenWrapper>
  );
}

export default ProfileScreen;
