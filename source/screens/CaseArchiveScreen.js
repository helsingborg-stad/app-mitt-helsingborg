import React, { useContext, useState, useEffect } from 'react';
import { NavItems } from 'app/assets/dashboard';
import { Heading, Text } from 'app/components/atoms';
import { GroupedList, Header, ListItem, ScreenWrapper } from 'app/components/molecules';
import { CaseState } from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const CaseArchiveWrapper = styled(ScreenWrapper)`
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
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

const CaseArchiveScreen = ({ navigation }) => {
  const [casesList, setCasesList] = useState([]);
  const { cases } = useContext(CaseState);

  const sortCasesByLastUpdated = list => list.sort((a, b) => b.updatedAt - a.updatedAt);

  useEffect(() => {
    setCasesList(Object.keys(cases).map(key => cases[key]));
  }, [cases]);

  return (
    <CaseArchiveWrapper>
      <Header
        title="Mitt Helsingborg"
        // message={user && user.givenName ? `Hej ${user.givenName}!` : 'Hej!'}
        themeColor="purple"
        navItems={NavItems}
      />
      <Container>
        <List>
          <ListHeading type="h3">Aktiva</ListHeading>
          {casesList.length > 0 ? (
            sortCasesByLastUpdated(casesList).map(item => (
              <ListItem
                key={item.id}
                highlighted
                title={item.status}
                text={`ID: ${item.id} Type: ${item.type}`}
                iconName={null}
                imageSrc={null}
                onClick={() => {
                  navigation.navigate('Form', { caseId: item.id });
                }}
              />
            ))
          ) : (
            <Text style={{ marginLeft: 4 }}>Inga aktiva ärenden..</Text>
          )}
        </List>

        <List>
          <GroupedList heading="Avslutade" items={[]} />
        </List>
      </Container>
    </CaseArchiveWrapper>
  );
};

CaseArchiveScreen.propTypes = {
  navigation: PropTypes.object,
};

export default CaseArchiveScreen;
