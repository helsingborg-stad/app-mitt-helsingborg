/* eslint-disable no-shadow */
/* eslint-disable import/no-named-as-default */
/* eslint-disable react/prop-types */
/* eslint-disable no-empty */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { NavigationEvents } from 'react-navigation';
import { NavItems, CompletedTasks, ActiveTasks } from '../../assets/dashboard';
import GroupedList from '../molecules/GroupedList/GroupedList';
import Header from '../molecules/Header';
import StorageService, { COMPLETED_FORMS_KEY, USER_KEY } from '../../services/StorageService';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Heading from '../atoms/Heading';
import ListItem from '../molecules/ListItem';
import forms from '../../assets/forms';
import Text from '../atoms/Text';

class TaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      activeTasks: [],
    };
  }

  componentDidMount() {
    this.getUser();
    this.getTasks();
  }

  sortTasksByDate = list => list.sort((a, b) => new Date(b.created) - new Date(a.created));

  getTasks = async () => {
    try {
      const tasks = await StorageService.getData(COMPLETED_FORMS_KEY);
      this.setState({
        activeTasks: Array.isArray(tasks) && tasks.length ? this.sortTasksByDate(tasks) : [],
      });
    } catch (error) {}
  };

  getUser = async () => {
    try {
      const user = await StorageService.getData(USER_KEY);
      this.setState({ user });
    } catch (error) {
      console.log('User not found', error);
    }
  };

  renderTaskItem = item => {
    const { user } = this.state;
    const { navigation } = this.props;

    const form = forms.find(form => form.id === item.formId);
    if (!form) {
      return null;
    }

    return (
      <ListItem
        key={item.id}
        highlighted
        title="Ansökan"
        text={form.name}
        iconName={form.icon || null}
        imageSrc={form.imageIcon || null}
        onClick={() =>
          navigation.navigate('TaskDetails', {
            answers: item.data,
            form,
            user,
          })
        }
      />
    );
  };

  render() {
    const { user, activeTasks } = this.state;

    return (
      <TaskScreenWrapper>
        <NavigationEvents onWillFocus={() => this.getTasks()} />

        <Header
          title="Mitt Helsingborg"
          message={user && user.givenName ? `Hej ${user.givenName}!` : 'Hej!'}
          themeColor="purple"
          navItems={NavItems}
        />
        <Container>
          <List>
            <ListHeading type="h3">Aktiva</ListHeading>
            {activeTasks.length > 0 ? (
              activeTasks.map(this.renderTaskItem)
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
  }
}

export default TaskScreen;

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
