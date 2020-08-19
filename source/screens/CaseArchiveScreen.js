import React, { useContext } from 'react';
import { NavItems } from 'app/assets/dashboard';
import { Heading, Text } from 'app/components/atoms';
import { GroupedList, Header, ListItem, ScreenWrapper } from 'app/components/molecules';
import AuthContext from 'app/store/AuthContext';
import FormContext from 'app/store/FormContext';
import CaseContext from 'app/store/CaseContext';
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
  const { user } = useContext(AuthContext);
  const { setCurrentForm } = useContext(FormContext);
  const { cases, getCase, setCurrentCase } = useContext(CaseContext);

  const sortCasesByLastUpdated = list => list.sort((a, b) => b.updatedAt - a.updatedAt);

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
          {cases.length > 0 ? (
            sortCasesByLastUpdated(cases).map(item => (
              <ListItem
                key={item.id}
                highlighted
                title={item.status}
                text={`ID: ${item.id} Type: ${item.type}`}
                iconName={null}
                imageSrc={null}
                onClick={async () => {
                  await setCurrentForm(item.formId);
                  const caseObj = getCase(item.id);
                  await setCurrentCase(caseObj);
                  navigation.navigate('Form');
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
