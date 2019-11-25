import React, { Component } from 'react';
import styled from 'styled-components/native';
import { NavItems, CompletedTasks, ActiveTasks } from '../../assets/dashboard';
import { NavigationEvents } from 'react-navigation';
import GroupedList from '../molecules/GroupedList';
import Header from '../molecules/Header';
import StorageService, { COMPLETED_FORMS_KEY, USER_KEY } from '../../services/StorageService';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Heading from '../atoms/Heading';
import ListItem from '../molecules/ListItem';
import forms from '../../assets/forms';

class TaskScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            activeTasks: []
        };
    }

    componentDidMount() {
        this.getUser();
        this.getTasks();
    }

    getTasks = async () => {
        try {
            const tasks = await StorageService.getData(COMPLETED_FORMS_KEY);
            this.setState({
                activeTasks: Array.isArray(tasks) && tasks.length ? tasks : []
            });
        } catch (error) {
            return;
        }
    };

    getUser = async () => {
        try {
            const user = await StorageService.getData(USER_KEY);
            this.setState({ user });
        } catch (error) {
            console.log("User not found", error);
        }
    };

    renderTaskItem = (item) => {
        const form = forms.find(form => (form.id === item.formId));
        if (!form) {
            return null;
        }

        return <ListItem
            key={item.id}
            highlighted={true}
            title='Ansökan'
            text={form.name}
            iconName={form.icon || null}
        />;
    }

    render() {
        const { user, activeTasks } = this.state;

        return (
            <TaskScreenWrapper>
                <NavigationEvents onWillFocus={() => this.getTasks() } />

                <Header
                    title="Mitt Helsingborg"
                    message={user && user.givenName ? `Hej ${user.givenName}!` : 'Hej!'}
                    themeColor="purple"
                    navItems={NavItems}
                />
                <Container>

                    {activeTasks.length > 0 &&
                        <List>
                            <ListHeading type="h3">Aktiva</ListHeading>
                            {activeTasks.map(this.renderTaskItem)}
                        </List>
                    }

                    <List>
                        <GroupedList
                            heading="Avslutade"
                            items={CompletedTasks}
                        />
                    </List>

                    {/* TODO: For testing only, remove me later  */}
                    <Heading type="h3" style={{ marginTop: 30 }} onPress={async () => {
                        await StorageService.removeData(COMPLETED_FORMS_KEY);
                        this.getTasks();
                    }}>Clear tasks</Heading>

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
    paddingBottom: 0;
    background-color: #F5F5F5;
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
