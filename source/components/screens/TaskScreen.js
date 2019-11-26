import React, { Component } from 'react';
import styled from 'styled-components/native';
import { NavItems, CompletedTasks, ActiveTasks } from '../../assets/dashboard';
import GroupedList from '../molecules/GroupedList';
import Header from '../molecules/Header';
import StorageService, { USER_KEY } from '../../services/StorageService';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Heading from '../atoms/Heading';
import ListItem from '../molecules/ListItem'

class TaskScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        this.getUser();
    }

    getUser = async () => {
        try {
            const user = await StorageService.getData(USER_KEY);
            this.setState({ user });
        } catch (error) {
            console.log("User not found", error);
        }
    };

    render() {
        const { user } = this.state;
        return (
            <TaskScreenWrapper>
                <Header
                    title="Mitt Helsingborg"
                    message={user && user.givenName ? `Hej ${user.givenName}!` : 'Hej!'}
                    themeColor="purple"
                    navItems={NavItems}
                />
                <Container>
                    <List>
                        <ListHeading type="h3">Aktiva</ListHeading>
                        {ActiveTasks.map(item =>
                            <ListItem
                                key={item.id}
                                {...item}
                            />
                        )}
                    </List>
                    <List>
                        <GroupedList
                            heading="Avslutade"
                            items={CompletedTasks}
                        />
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
    paddingBottom: 0;
    background-color: #FCFCFC;
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
