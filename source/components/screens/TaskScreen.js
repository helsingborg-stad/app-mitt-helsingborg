import React, { Component } from 'react';
import styled from 'styled-components/native';
import { FlatList, ScrollView, View } from 'react-native';
import GroupedList from '../molecules/GroupedList';
import Header from '../molecules/Header';
import StorageService, { USER_KEY } from '../../services/StorageService';
import ScreenWrapper from '../molecules/ScreenWrapper';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import Heading from '../atoms/Heading';

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
                        <FlatList
                            ListHeaderComponent={<ListHeading type="h3">Aktiva</ListHeading>}
                            data={ACTIVE_TASKS}
                            scrollEnabled={false}
                            renderItem={item => <ListButton color={'light'} />}
                            keyExtractor={item => item.id}
                        />
                    </List>
                    <List>
                        <GroupedList
                            heading="Avslutade"
                            icon="chevron-right"
                            iconPosition="right"
                            items={COMPLETED_TASKS}
                        />
                    </List>
                </Container>
            </TaskScreenWrapper>
        );
    }
}

export default TaskScreen;


const ListButton = ({ }) => {
    return (
        <TaskButton color={'light'} block>
            <LeftIconWrapper>
                <LeftIcon name="message" />
            </LeftIconWrapper>

            <ButtonContent>
                <Text small>Ansökan</Text>
                <Text>Borgerlig vigsel</Text>
            </ButtonContent>

            <RightIcon name="chevron-right" />
        </TaskButton>
    );
}

const TaskButton = styled(Button)`
    padding: 0px;
    margin-bottom: 12px;
    justify-content: space-between;
    background-color: white;
`;

const LeftIconWrapper = styled(View)`
    background: #F8F8F8;
    padding: 16px;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 12.5px;
    border-bottom-left-radius: 12.5px;
`;

const ButtonContent = styled(View)`
    flex: 1;
    padding-left: 16px;
`;

const LeftIcon = styled(Icon)`
    color: #565656;
`;

const RightIcon = styled(Icon)`
    color: #A3A3A3;
    margin-right: 16px;
`;



const TaskScreenWrapper = styled(ScreenWrapper)`
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
`;

const Container = styled(ScrollView)`
    padding: 16px;
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
        id: '3ac68afc',
        title: 'Översikt',
        route: '',
        active: false
    },
    {
        id: 'bd7acbea',
        title: 'Ärenden',
        route: '',
        active: true
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
    },
    {
        id: '3ac68afc',
        title: 'Lorem',
        text: 'Something foo bar',
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
