import React, { useContext, useEffect, useState } from 'react';
import { Heading, Text, Button } from 'app/components/atoms';
import { Header, ListItem, ScreenWrapper } from 'app/components/molecules';
import { CaseDispatch, CaseState } from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Status, getCaseTypeAndLatestCase, getFormattedUpdatedDate } from './CaseLogic';

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

// The id here is temporary.
// We should of course avoid hard-coded ids, but we do need specific references to these forms somehow...
// We could think about setting up a mapping between human-readable identifiers and form-ids somewhere in the backend,
// and then use that to ensure that we get the correct forms, I don't know.
const recurringFormId = 'a3165a20-ca10-11ea-a07a-7f5f78324df2';
const basicApplicationFormId = 'a0feda30-e86c-11ea-b20a-f72e709dacd1';

const sortCasesByLastUpdated = list => list.sort((a, b) => b.updatedAt - a.updatedAt);

const EKBCases = ({ navigation, route }) => {
  const { caseType } = route.params;
  const [status, setStatus] = useState(Status.untouched);
  const [latestCase, setLatestCase] = useState(undefined);
  const [relevantCases, setRelevantCases] = useState([]);
  const [completedCases, setCompletedCases] = useState([]);

  const { createCase } = useContext(CaseDispatch);
  const { cases } = useContext(CaseState);

  useEffect(() => {
    const [st, latest, relCases] = getCaseTypeAndLatestCase(caseType, Object.values(cases));
    setStatus(st);
    setLatestCase(latest);
    setRelevantCases(relCases);
    setCompletedCases(relCases.filter(c => c.status !== 'ongoing'));
    console.log(
      'completed cases:',
      relCases.filter(c => c.status !== 'ongoing')
    );
  }, [caseType, cases]);

  const StatusComponent = () => {
    switch (status) {
      case Status.untouched:
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
      case Status.unfinishedNoCompleted:
      case Status.unfinished:
        return (
          <>
            <Heading type="h3">Status</Heading>
            <Text>
              Du har en påbörjad {latestCase.formId === recurringFormId ? 'löpande ' : 'grund'}
              ansökan, senast uppdaterad {getFormattedUpdatedDate(latestCase)}.
            </Text>
            {latestCase.formId === recurringFormId && (
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
      case Status.recentlyCompleted:
        return (
          <>
            <Heading type="h3">Status</Heading>
            <Text>
              Du har en inskickad {latestCase.formId === recurringFormId ? 'löpande ' : 'grund'}
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

  const CompletedCasesComponent = () => {
    if (completedCases.length > 0) {
      return (
        <List>
          <ListHeading type="h3">Inskickade ärenden</ListHeading>
          {sortCasesByLastUpdated(completedCases).map(item => (
            <ListItem
              key={`${item.id}`}
              highlighted
              title={getFormattedUpdatedDate(item)}
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
        <StatusComponent />
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
