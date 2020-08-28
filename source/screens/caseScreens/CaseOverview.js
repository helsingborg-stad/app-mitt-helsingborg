import React, { useContext, useState, useEffect } from 'react';
import { Heading, Text, Button } from 'app/components/atoms';
import { ScreenWrapper } from 'app/components/molecules';
import { CaseState } from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { CaseTypeListItem } from '../../components/molecules/ListItem';
import { caseTypes, Status, getCaseTypeAndLatestCase, getFormattedUpdatedDate } from './CaseLogic';

const CaseOverviewWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 40px;
  padding-bottom: 0;
  background-color: #f5f5f5;
`;

const Container = styled.ScrollView`
  padding-left: 16px;
  padding-right: 16px;
`;
const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  width: 100%;
`;

const List = styled.View`
  margin-top: 24px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const computeCaseComponent = (status, latestCase, navigation) => {
  let updatedAt = '';
  if (latestCase) {
    updatedAt = getFormattedUpdatedDate(latestCase);
  }

  switch (status) {
    case Status.untouched:
      return <Text small>Inga ärenden</Text>;

    case Status.unfinishedNoCompleted:
    case Status.unfinished:
      return (
        <>
          <Text small style={{ color: 'red' }}>
            Påbörjad ansökan, uppdaterad {updatedAt}
          </Text>
          <ButtonContainer>
            <Button
              color="orange"
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
      return <Text small>Inskickad ansökan {updatedAt}</Text>;

    case Status.onlyOldCases:
      return <Text small>Inga aktiva ärenden</Text>;

    default:
      return null;
  }
};

const CaseOverview = ({ navigation }) => {
  const [caseItems, setCaseItems] = useState([]);
  const { cases } = useContext(CaseState);

  useEffect(() => {
    const updatedItems = [];
    caseTypes.forEach(caseType => {
      const [status, latestCase, relevantCases] = getCaseTypeAndLatestCase(
        caseType,
        Object.values(cases)
      );
      const component = computeCaseComponent(status, latestCase, navigation);
      updatedItems.push({ caseType, status, latestCase, component, cases: relevantCases });
    });
    setCaseItems(updatedItems);
  }, [cases, navigation]);

  return (
    <CaseOverviewWrapper>
      <Container>
        <List>
          <ListHeading type="h3">Tjänster</ListHeading>
          {caseItems?.length > 0 &&
            caseItems.map(item => {
              const { caseType, component } = item;
              return (
                <CaseTypeListItem
                  key={`${caseType.name}`}
                  title={caseType.name}
                  icon={caseType.icon}
                  onClick={() => {
                    navigation.navigate('UserEvents', {
                      screen: caseType.navigateTo,
                      params: { caseType },
                    });
                  }}
                >
                  {component}
                </CaseTypeListItem>
              );
            })}
        </List>
      </Container>
    </CaseOverviewWrapper>
  );
};

CaseOverview.propTypes = {
  navigation: PropTypes.object,
};

export default CaseOverview;
