import React, { useContext, useEffect, useState } from 'react';
import { Heading, Text, Button } from 'app/components/atoms';
import { Header, ListItem, ScreenWrapper } from 'app/components/molecules';
import FormContext from 'app/store/FormContext';
import { CaseDispatch, CaseState, caseStatus } from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { formatUpdatedAt } from '../../helpers/DateHelpers';

const CaseArchiveWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  background-color: #f5f5f5;
`;

const Container = styled.ScrollView`
  padding-top: 25px;
  padding-left: 16px;
  padding-right: 16px;
`;

const List = styled.View`
  margin-top: 44px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  margin-bottom: 25px;
  width: 100%;
`;

const sortCasesByLastUpdated = list => list.sort((a, b) => b.updatedAt - a.updatedAt);

const EKBCases = ({ navigation, route }) => {
  const { caseType } = route.params;
  const [status, setStatus] = useState(caseStatus.untouched);
  const [latestCase, setLatestCase] = useState(undefined);
  const [completedCases, setCompletedCases] = useState([]);

  const [recurringFormId, setRecurringFormId] = useState('');
  const [basicApplicationFormId, setBasicApplicationFormId] = useState('');

  const { findFormByType, getFormIdsByFormTypes } = useContext(FormContext);
  const { createCase } = useContext(CaseDispatch);
  const { cases, getCasesByFormIds } = useContext(CaseState);

  useEffect(() => {
    const setState = async () => {
      const recurringForm = await findFormByType('EKB-recurring');
      const newForm = await findFormByType('EKB-new');
      setRecurringFormId(recurringForm.id);
      setBasicApplicationFormId(newForm.id);

      const formIds = await getFormIdsByFormTypes(caseType.formTypes);
      const [newStatus, latest, relCases] = await getCasesByFormIds(formIds);

      // TODO: set status on case in context.
      setStatus(newStatus);
      // TODO: set latest case in context.
      setLatestCase(latest);
      setCompletedCases(relCases.filter(c => c.status !== 'ongoing'));
    };
    setState();
  }, [caseType, cases, findFormByType, getCasesByFormIds, getFormIdsByFormTypes]);

  // TODO: Refactor into a dumb component
  const StatusComponent = () => {
    switch (status) {
      case caseStatus.untouched:
        return (
          <>
            <Heading type="h3">Status</Heading>
            <Text>Du har ingen aktiv grundansökan. </Text>
            <ButtonContainer>
              <Button
                color="green"
                onClick={() => {
                  createCase(basicApplicationFormId, newCase => {
                    navigation.navigate('Form', { caseData: newCase });
                  });
                }}
              >
                <Text>Ansök om ekonomiskt bistånd</Text>
              </Button>
            </ButtonContainer>
          </>
        );
      case caseStatus.unfinishedNoCompleted:
      case caseStatus.unfinished:
        return (
          <>
            <Heading type="h3">Status</Heading>
            <Text>
              Du har en påbörjad {latestCase?.formId === recurringFormId ? 'löpande ' : 'grund'}
              ansökan, senast uppdaterad {formatUpdatedAt(latestCase.updatedAt)}.
            </Text>
            {latestCase?.formId === recurringFormId && (
              <Text>Just nu gäller ansökan perioden XX - YY. Skicka in din ansökan innan ZZ. </Text>
            )}
            <ButtonContainer>
              <Button
                color="blue"
                onClick={() => {
                  navigation.navigate('Form', { caseId: latestCase.id });
                }}
              >
                <Text>Fortsätt ansökan</Text>
              </Button>
            </ButtonContainer>
          </>
        );
      case caseStatus.recentlyCompleted:
        return (
          <>
            <Heading type="h3">Status</Heading>
            <Text>
              Du har en inskickad {latestCase?.formId === recurringFormId ? 'löpande ' : 'grund'}
              ansökan.
            </Text>
            <Text>Just nu gäller ansökan perioden XX - YY. Skicka in din ansökan innan ZZ. </Text>
            <Button
              color="green"
              onClick={() => {
                createCase(recurringFormId, newCase => {
                  navigation.navigate('Form', { caseData: newCase });
                });
              }}
            >
              <Text>Ansök om ekonomiskt bistånd för perioden XX - YY</Text>
            </Button>
          </>
        );
      default:
        break;
    }
  };

  // TODO: refactor into a dumb component
  const ContactInfoComponent = () => {
    if (completedCases.length > 0) {
      return (
        <>
          <Heading type="h3">Kontaktinformation</Heading>
          <Text>
            Om du har frågor eller behöver hjälp med något som gäller ansökan om ekonomiskt bistånd,
            kan du ta kontakt med din handläggare.
          </Text>
          <Text>Vi behöver få in den information någonstans...</Text>
        </>
      );
    }
    return null;
  };

  // TODO: Refactor into a dumb
  const CompletedCasesComponent = () => {
    if (completedCases.length > 0) {
      return (
        <List>
          <ListHeading type="h3">Inskickade ärenden</ListHeading>
          {sortCasesByLastUpdated(completedCases).map(item => (
            <ListItem
              key={`${item.id}`}
              highlighted
              title={formatUpdatedAt(item.updatedAt)}
              text="Perioden XX - YY"
              iconName={null}
              imageSrc={null}
              onClick={() => {
                navigation.navigate('Form', { caseId: item.id });
              }}
            />
          ))}
        </List>
      );
    }
    return null;
  };

  return (
    <CaseArchiveWrapper>
      <Header title="Ekonomiskt bistånd" themeColor="purple" />
      <Container>
        {latestCase && <StatusComponent />}
        <ContactInfoComponent />
        <CompletedCasesComponent />
      </Container>
    </CaseArchiveWrapper>
  );
};

EKBCases.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default EKBCases;
