import React, { Component } from 'react';
import styled from 'styled-components/native';
import { View, ScrollView } from 'react-native';
import GroupedList from '../molecules/GroupedList';
import Header from '../molecules/Header';
import StorageService, { USER_KEY } from '../../services/StorageService';

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
        const { givenName } = this.state.user;

        return (
            <View>
                <Header
                    title="Mitt Helsingborg"
                    message={givenName ? `Hej ${givenName}!` : 'Hej!'}
                    themeColor="purple"
                />
                <Container>
                    <GroupedList
                        heading="Avslutade"
                        icon="chevron-right"
                        iconPosition="right"
                        items={COMPLETED_TASKS}
                    />
                </Container>
            </View>
        );
    }
}

export default TaskScreen;

const Container = styled(ScrollView)`
    padding: 16px;
`;

const COMPLETED_TASKS = [
    {
        heading: 'TISDAG 3 NOVEMBER',
        data: [
            {
                id: 'bd7acbea',
                title: 'Skolskjuts',
                text: 'Skolskjuts beställd',
            }
        ]
    },
    {
        heading: 'FREDAG 10 NOVEMBER',
        data: [
            {
                id: '3ac68afc',
                title: 'Avfallshämtning',
                text: 'Avfallshämtning beställd',
            },
            {
                id: '58694a0f',
                title: 'Bygglov',
                text: 'Bygglov godkänt',
            },
        ]
    },
];
