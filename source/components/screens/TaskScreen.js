import React, { Component } from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
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
        const { givenName } = this.state.user;
        return (
            <TaskScreenWrapper>
                <Header
                    title="Mitt Helsingborg"
                    message={givenName ? `Hej ${givenName}!` : 'Hej!'}
                    themeColor="purple"
                    navItems={NAV_ITEMS}
                />
                <Container>
                    <List>
                        <ListHeading type="h3">Aktiva</ListHeading>
                        {ACTIVE_TASKS.map(item =>
                            <ListItem
                                key={item.id}
                                {...item}
                            />
                        )}
                    </List>
                    <List>
                        <GroupedList
                            heading="Avslutade"
                            items={COMPLETED_TASKS}
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
    background-color: ${props => (props.theme.background.lightest)};
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

const NAV_ITEMS = [
    {
        id: 'bd7acbea',
        title: 'Ärenden',
        route: '',
        active: true
    },
    {
        id: '3ac68afc',
        title: 'Översikt',
        route: '',
        active: false
    },
    {
        id: '58694a0f',
        title: 'Händelser',
        route: '',
        active: false
    },
]

const ACTIVE_TASKS = [
    {
        id: 'bd7acbea',
        title: 'Ansökan',
        text: 'Borgerlig vigsel',
        iconName: 'wc',
        highlighted: true
    },
];

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
