import PropTypes from 'prop-types';
import { Icon, Text } from 'app/components/atoms';
import { Card, Header, ScreenWrapper } from 'app/components/molecules';
import FormContext from 'app/store/FormContext';
import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { CaseDispatch } from 'app/store/CaseContext';

// TODO: Temp fix, handle this better
const FORM_ID = 'f94790e0-0c86-11eb-bf56-efbb7e9336b3';
const ILLU_WALLET = require('source/assets/images/icons/icn_inkomster_red_1x.png');

const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const WelcomeMessage = styled(Card)`
  margin-top: 32px;
  margin-bottom: 32px;
`;

function ProfileScreen({ navigation }) {
  const { createCase } = useContext(CaseDispatch);
  const { getForm } = useContext(FormContext);

  return (
    <ScreenWrapper>
      <Header title="Mina ärenden" />
      <Container>
        <WelcomeMessage colorSchema="red">
          <Card.Body outlined>
            <Card.Title>Hej!</Card.Title>
            <Card.Text>
              Helsingborgs Stad testar att göra självservice lite mer personlig och i första steget
              så är det just Ekonomiskt Bistånd som står i fokus.
            </Card.Text>
          </Card.Body>
        </WelcomeMessage>

        <Card colorSchema="red">
          <Card.Body shadow color="neutral">
            <Card.Image source={ILLU_WALLET} />
            <Card.Title>Ekonomiskt{'\n'}bistånd</Card.Title>
            <Card.Button
              onClick={async () => {
                const form = await getForm(FORM_ID);
                createCase(
                  form,
                  async newCase => {
                    navigation.navigate('Form', { caseData: newCase });
                  },
                  true
                );
              }}
            >
              <Text>Starta ansökan</Text>
              <Icon name="arrow-forward" />
            </Card.Button>
          </Card.Body>
        </Card>
      </Container>
    </ScreenWrapper>
  );
}

ProfileScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default ProfileScreen;
