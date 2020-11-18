import React, { useContext, useState, useEffect } from 'react';
import { Heading, Text, Button, Icon } from 'app/components/atoms';
import { Card, Header, ScreenWrapper } from 'app/components/molecules';
import { CaseDispatch, CaseState, caseStatus, caseTypes } from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { CaseTypeListItem } from '../../components/molecules/ListItem';
import { formatUpdatedAt } from '../../helpers/DateHelpers';

// TODO: Temp fix, handle this better
const FORM_ID = 'f94790e0-0c86-11eb-bf56-efbb7e9336b3';
const ILLU_WALLET = require('source/assets/images/icons/icn_inkomster_red_1x.png');

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const ListHeading = styled(Text)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const WelcomeMessage = styled(Card)`
  margin-top: 32px;
  margin-bottom: 32px;
`;

const caseType = caseTypes[0];

const computeCaseComponent = (status, latestCase, navigation, form, createCase) => {
  console.log('status', status);

  let updatedAt = '';
  if (latestCase) {
    updatedAt = formatUpdatedAt(latestCase.updatedAt);
  }

  switch (status) {
    case caseStatus.untouched:
      return (
        <Card colorSchema="red">
          <Card.Body shadow color="neutral">
            <Card.Image source={ILLU_WALLET} />
            <Card.Title>Ekonomiskt{'\n'}bistånd</Card.Title>
            <Card.Button
              onClick={async () => {
                createCase(
                  form,
                  async newCase => {
                    navigation.navigate('Form', { caseData: newCase });
                  },
                  true
                );
              }}
            >
              <Text>Sök ekonomiskt bistånd</Text>
              <Icon name="arrow-forward" />
            </Card.Button>
          </Card.Body>
        </Card>
      );

    case caseStatus.unfinishedNoCompleted:
    case caseStatus.unfinished:
      return (
        <>
          <ListHeading type="h5">Aktiva</ListHeading>

          <Card colorSchema="red">
            <Card.Body shadow color="neutral">
              <Card.Image source={ILLU_WALLET} />
              <Card.Title>Ekonomiskt{'\n'}bistånd</Card.Title>
              <Card.Text>Påbörjad ansökan, uppdaterad {updatedAt}</Card.Text>
              <Card.Button
                onClick={() => {
                  navigation.navigate('Form', { caseId: latestCase.id });
                }}
              >
                <Text>Fortsätt ansökan</Text>
                <Icon name="arrow-forward" />
              </Card.Button>
            </Card.Body>
          </Card>
        </>
      );

    case caseStatus.recentlyCompleted:
      return (
        <>
          <ListHeading type="h5">Aktiva</ListHeading>

          <Card colorSchema="red">
            <Card.Body shadow color="neutral">
              <Card.Image source={ILLU_WALLET} />
              <Card.Title>Ekonomiskt{'\n'}bistånd</Card.Title>
              <Card.Text>Inskickad ansökan {updatedAt}</Card.Text>
              <Card.Button
                onClick={() => {
                  navigation.navigate('UserEvents', {
                    screen: caseType.navigateTo,
                    params: { caseType },
                  });
                }}
              >
                <Text>Visa ansökan</Text>
                <Icon name="arrow-forward" />
              </Card.Button>
            </Card.Body>
          </Card>
        </>
      );

    case caseStatus.onlyOldCases:
      return <Text small>Inga aktiva ärenden</Text>;

    default:
      return null;
  }
};

const CaseOverview = ({ navigation }) => {
  const [caseItem, setCaseItem] = useState({});
  const { getCasesByFormIds } = useContext(CaseState);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);
  const { createCase } = useContext(CaseDispatch);

  console.log('caseTypes', caseTypes);

  useEffect(() => {
    const updateItems = async () => {
      const [status, latestCase, relevantCases] = await getCasesByFormIds([FORM_ID]);
      const form = await getForm(FORM_ID);
      console.log('relevantCases', relevantCases);
      setCaseItem({
        status,
        item: latestCase,
        component: computeCaseComponent(status, latestCase, navigation, form, createCase),
      });
    };

    updateItems();
  }, [createCase, getCasesByFormIds, getForm, getFormIdsByFormTypes, navigation]);

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

        {caseItem.component}
      </Container>
    </ScreenWrapper>
  );
};

CaseOverview.propTypes = {
  navigation: PropTypes.object,
};

export default CaseOverview;
