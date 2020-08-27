import React, { useContext, useState, useEffect } from 'react';
import { Heading, Text, Button } from 'app/components/atoms';
import { ScreenWrapper } from 'app/components/molecules';
import { CaseState } from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { CaseTypeListItem } from '../../components/molecules/ListItem';

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

const List = styled.View`
  margin-top: 24px;
`;

const ListHeading = styled(Heading)`
  margin-left: 4px;
  margin-bottom: 8px;
`;

const caseTypes = [
  {
    name: 'Ekonomiskt Bistånd',
    forms: ['a3165a20-ca10-11ea-a07a-7f5f78324df2'],
    icon: 'ICON_EKB',
    navigateTo: '',
  },
  {
    name: 'Borgerlig Vigsel',
    forms: [],
    icon: '',
    navigateTo: '',
  },
];

const Status = {
  unfinished: 'UNFINISHED',
  recentlyCompleted: 'RECENTLY_COMPLETED',
  untouched: 'UNTOUCHED',
  onlyOldCases: 'OLD_CASES',
};
const oldCase = 4 * 30 * 24 * 60 * 60 * 1000; // cases older than 4 months are classified as old.

const statusOrder = [
  Status.unfinished,
  Status.recentlyCompleted,
  Status.onlyOldCases,
  Status.untouched,
];

const getCaseTypeAndLatestCase = (caseType, cases) => {
  let latestUpdated = 0;
  let latestCase;
  cases.forEach(c => {
    if (caseType.forms.includes(c.formId)) {
      if (c.updatedAt > latestUpdated) {
        latestUpdated = c.updatedAt;
        latestCase = c;
      }
    }
  });
  if (latestUpdated === 0) {
    return [Status.untouched, undefined];
  }
  if (latestCase.status === 'ongoing') {
    return [Status.unfinished, latestCase];
  }
  if (latestCase.status === 'submitted') {
    if (Date.now() - latestUpdated > oldCase) {
      return [Status.onlyOldCases, latestUpdated];
    }
    return [Status.recentlyCompleted, latestUpdated];
  }
};

const computeCaseComponent = (caseType, cases) => {
  const [status, latestCase] = getCaseTypeAndLatestCase(caseType, cases);
  let updatedAt = '';
  if (latestCase) {
    const date = new Date(latestCase.updatedAt);
    updatedAt = `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`;
  }

  switch (status) {
    case Status.untouched:
      return <Text small>Inga ärenden</Text>;

    case Status.unfinished:
      return (
        <>
          <Text small style={{ color: 'red' }}>
            Påbörjad ansökan, uppdaterad {updatedAt}
          </Text>
          <Button>
            <Text>Fortsätt ansökan</Text>
          </Button>
        </>
      );

    case Status.recentlyCompleted:
      return <Text small>Inskickad ansökan {updatedAt}</Text>;

    case Status.onlyOldCases:
      return <Text small>Inga aktiva ärenden</Text>;

    default:
      break;
  }

  return {};
};

const CaseOverview = ({ navigation }) => {
  const [caseItems, setCaseItems] = useState([]);
  const { cases } = useContext(CaseState);

  useEffect(() => {
    const updatedItems = [];
    caseTypes.forEach(caseType => {
      updatedItems.push([caseType, computeCaseComponent(caseType, Object.values(cases))]);
    });
    setCaseItems(updatedItems);
  }, [cases]);

  return (
    <CaseOverviewWrapper>
      <Container>
        <List>
          <ListHeading type="h3">Tjänster</ListHeading>
          {caseItems?.length > 0 &&
            caseItems.map(item => {
              const [caseType, component] = item;
              return (
                <CaseTypeListItem
                  key={`${caseType.name}`}
                  highlighted
                  title={caseType.name}
                  icon={caseType.icon}
                  onClick={() => {}}
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

export default CaseOverview;
