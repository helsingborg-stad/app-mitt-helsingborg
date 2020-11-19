import React, { useContext, useState, useEffect } from 'react';
import { Text, Icon } from 'app/components/atoms';
import { Card, Header, ScreenWrapper } from 'app/components/molecules';
import { CaseDispatch, CaseState, caseStatus, caseTypes } from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import icons from 'source/helpers/Icons';
import { formatUpdatedAt } from '../../helpers/DateHelpers';

const Container = styled.ScrollView`
  flex: 1;
  padding-left: 16px;
  padding-right: 16px;
`;

const ListHeading = styled(Text)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const Message = styled(Card)`
  margin-top: 32px;
  margin-bottom: 32px;
`;

function computeCaseComponent(status, latestCase, form, caseType, navigation, createCase) {
  const updatedAt = latestCase?.updatedAt ? formatUpdatedAt(latestCase.updatedAt) : '';
  const currentStep = latestCase?.currentStep || '';
  const totalSteps = form?.stepStructure ? form.stepStructure.length : 0;

  switch (status) {
    case caseStatus.onlyOldCases:
    case caseStatus.untouched:
      return (
        <Card colorSchema="red">
          <Card.Body shadow color="neutral">
            <Card.Image source={icons[caseType.icon]} />
            <Card.Title>{caseType.name}</Card.Title>
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
              <Card.Image source={icons[caseType.icon]} />
              <Card.Title>{caseType.name}</Card.Title>
              <Card.SubTitle>
                Steg {currentStep} / {totalSteps}
              </Card.SubTitle>
              <Card.Text italic>Senast uppdaterad {updatedAt}</Card.Text>
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
              <Card.Image source={icons[caseType.icon]} />
              <Card.Title>{caseType.name}</Card.Title>
              <Card.SubTitle>Inskickad</Card.SubTitle>
              <Card.Text italic>Skickades in {updatedAt}</Card.Text>
              <Card.Button
                onClick={() => {
                  navigation.navigate('UserEvents', {
                    screen: caseType.navigateTo,
                    params: { name: caseType.name, status, caseData: latestCase, form },
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
      const updateItemsPromises = caseTypes.map(async caseType => {
        const formIds = await getFormIdsByFormTypes(caseType.formTypes);
        const [status, latestCase, relevantCases] = await getCasesByFormIds(formIds);
        const form = await getForm(latestCase?.formId || formIds[0]);
        const component = computeCaseComponent(
          status,
          latestCase,
          form,
          caseType,
          navigation,
          createCase
        );
        return { caseType, status, latestCase, component, cases: relevantCases };
      });

      await Promise.all(updateItemsPromises).then(updatedItems => {
        setCaseItems(updatedItems);
      });
    };
    updateItems();
  }, [createCase, getCasesByFormIds, getForm, getFormIdsByFormTypes, navigation]);

  return (
    <ScreenWrapper>
      <Header title="Mina ärenden" />
      <Container>
        <Message colorSchema="red">
          <Card.Body outlined>
            <Card.Title>Hej!</Card.Title>
            <Card.Text>
              Helsingborgs Stad testar att göra självservice lite mer personlig och i första steget
              så är det just Ekonomiskt Bistånd som står i fokus.
            </Card.Text>
          </Card.Body>
        </Message>
        {caseItems.map(({ component }) => component)}
      </Container>
    </ScreenWrapper>
  );
}

CaseOverview.propTypes = {
  navigation: PropTypes.object,
};

export default CaseOverview;
