import React, { Component } from 'react';

import { View, Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { storiesOf } from '@storybook/react-native';
import Chat from "../organisms/Chat";
import withChatForm from "../organisms/withChatForm";
import ChatForm from "../molecules/ChatForm";
import styled from "styled-components/native/dist/styled-components.native.esm";
import ScreenWrapper from "../molecules/ScreenWrapper";
import ParrotAgent from "./ParrotAgent";
import { Icon } from 'react-native-elements'


// Padding handled by react-navigation.
const ModifiedScreenWrapper = styled(ScreenWrapper)`
   padding: 0px;
`;

class ChatScreen extends Component {
    render() {
        return (
            <ModifiedScreenWrapper>
                <Chat ChatAgent={ParrotAgent} ChatUserInput={withChatForm(ChatForm)}/>
            </ModifiedScreenWrapper>
        );
    }
}

class UserEvents extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Placeholder for events screen</Text>
            </View>
        );
    }
}


class Profile extends Component {
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>Placeholder for profile screen</Text>
            </View>
        );
    }
}

const tabBarIcon = (iconName, colorFocused) => ({focused}) => (
    <Icon name={iconName} color={focused ? colorFocused : 'gray'}/>
);

const TabNavigator = createBottomTabNavigator(
    {
        Chat: {
            screen: ChatScreen,
            navigationOptions: {
                title: 'Prata med oss',
                tabBarIcon: tabBarIcon('message', '#EC6701')
            }
        },
        UserEvents: {
            screen: UserEvents,
            navigationOptions: {
                title: 'Mitt HBG',
                tabBarIcon: tabBarIcon('home', '#A61380')
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                title: 'Profil',
                tabBarIcon: tabBarIcon('contacts', 'blue'),
                tabBarVisible: true,
            }
        }
    }
);

const AppContainer = createAppContainer(TabNavigator);

storiesOf('Chat', module)
    .add('Hide chat tabs V2', () => (
        <AppContainer/>
    ));
