import React, { useContext, useState, useEffect } from 'react';
import { Text, Icon } from 'app/components/atoms';
import { Card, Header, ScreenWrapper } from 'app/components/molecules';
import { CaseDispatch, CaseState, caseStatus, caseTypes } from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { formatUpdatedAt } from '../../helpers/DateHelpers';

const ILLU_WALLET = require('source/assets/images/icons/icn_inkomster_red_1x.png');
// TODO: Handle hardcoded form data
const EKB = {
  name: 'Ekonomiskt bistånd',
  formId: 'f94790e0-0c86-11eb-bf56-efbb7e9336b3',
  icon: ILLU_WALLET,
};

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

function computeCaseComponent(status, caseItem, form, navigation, createCase) {
  const updatedAt = caseItem?.updatedAt ? formatUpdatedAt(caseItem.updatedAt) : '';
  const currentStep = caseItem?.currentStep || '';
  const totalSteps = form?.stepStructure ? form.stepStructure.length : 0;

  switch (status) {
    case caseStatus.untouched:
      return (
        <Card colorSchema="red">
          <Card.Body shadow color="neutral">
            <Card.Image source={EKB.icon} />
            <Card.Title>{EKB.name}</Card.Title>
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
              <Card.Image source={EKB.icon} />
              <Card.Title>{EKB.name}</Card.Title>
              <Card.SubTitle>
                Steg {currentStep} / {totalSteps}
              </Card.SubTitle>
              <Card.Text italic>Senast uppdaterad {updatedAt}</Card.Text>
              <Card.Button
                onClick={() => {
                  navigation.navigate('Form', { caseId: caseItem.id });
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
              <Card.Image source={EKB.icon} />
              <Card.Title>{EKB.name}</Card.Title>
              <Card.SubTitle>Inskickad</Card.SubTitle>
              <Card.Text italic>Skickades in {updatedAt}</Card.Text>
              <Card.Button
                onClick={() => {
                  navigation.navigate('UserEvents', {
                    screen: 'CaseSummary',
                    params: { name: EKB.name, status, caseItem, form },
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
}

function CaseOverview({ navigation }) {
  const [caseItems, setCaseItems] = useState([]);
  const { getCasesByFormIds } = useContext(CaseState);
  const { getForm, getFormIdsByFormTypes } = useContext(FormContext);
  const { createCase } = useContext(CaseDispatch);

  useEffect(() => {
    const updateItems = async () => {
      // Using hardcoded form id and only the latest EKB case for now
      const form = await getForm(EKB.formId);
      const [status, latestCase, relevantCases] = await getCasesByFormIds([form.id]);
      console.log('latestCase', latestCase);
      console.log('relevantCases', relevantCases);
      const component = computeCaseComponent(status, latestCase, form, navigation, createCase);
      const updatedCase = { component, status, form, item: latestCase };
      setCaseItems([updatedCase]);
    };

    updateItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCasesByFormIds, getFormIdsByFormTypes, getForm, navigation]);

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
        {caseItems.map(({ component }) => component)}
      </Container>
    </ScreenWrapper>
  );
}

CaseOverview.propTypes = {
  navigation: PropTypes.object,
};

export default CaseOverview;
