import React, { useState, useContext, useCallback, useEffect } from 'react';
import { CompletedTasks, NavItems } from 'app/assets/dashboard';
import { Heading, Text } from 'app/components/atoms';
import { GroupedList, Header, ListItem, ScreenWrapper } from 'app/components/molecules';
import AuthContext from 'app/store/AuthContext';
import FormContext from 'app/store/FormContext';
import CaseContext from 'app/store/CaseContext';
import PropTypes from 'prop-types';
import { NavigationEvents } from 'react-navigation';
import styled from 'styled-components/native';
import { get } from 'app/helpers/ApiRequest';

const TaskScreenWrapper = styled(ScreenWrapper)`
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

const TaskScreen = ({ navigation }) => {
  const [activeCases, setActiveCases] = useState([]);
  const { user } = useContext(AuthContext);
  const { setCurrentForm } = useContext(FormContext);
  const { getCase, setCurrentCase } = useContext(CaseContext);

  const sortTasksByDate = list =>
    list.sort((a, b) => new Date(b.attributes.updatedAt) - new Date(a.attributes.updatedAt));

  const getTasks = useCallback(async () => {
    console.log('user', user);

    try {
      const response = await get('/cases', undefined, user.personalNumber);
      console.log(response.data.data);

      setActiveCases(
        Array.isArray(response.data.data) && response.data.data
          ? sortTasksByDate(response.data.data)
          : []
      );
    } catch (error) {
      console.error(`Get cases Error: ${error}`);
    }
  }, [user]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <TaskScreenWrapper>
      <NavigationEvents onWillFocus={() => getTasks()} />

      <Header
        title="Mitt Helsingborg"
        message={user && user.givenName ? `Hej ${user.givenName}!` : 'Hej!'}
        themeColor="purple"
        navItems={NavItems}
      />
      <Container>
        <List>
          <ListHeading type="h3">Aktiva</ListHeading>
          {activeCases.length > 0 ? (
            activeCases.map(item => (
              <ListItem
                key={item.id}
                highlighted
                title="Ansökan"
                text={`${item.attributes.type} - ${item.attributes.status}`}
                iconName={null}
                imageSrc={null}
                onClick={() => {
                  setCurrentForm(item.attributes.formId);
                  const caseObj = getCase(item.id);
                  setCurrentCase({ id: caseObj.id, ...caseObj.attributes });
                  navigation.navigate('Form');
                }}
              />
            ))
          ) : (
            <Text style={{ marginLeft: 4 }}>Inga aktiva ärenden..</Text>
          )}
        </List>

        <List>
          <GroupedList heading="Avslutade" items={CompletedTasks} />
        </List>
      </Container>
    </TaskScreenWrapper>
  );
};

TaskScreen.propTypes = {
  navigation: PropTypes.object,
};

export default TaskScreen;
