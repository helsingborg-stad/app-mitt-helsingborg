import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createMaterialTopTabNavigator, MaterialTopTabBar} from 'react-navigation-tabs';
import {storiesOf} from '@storybook/react-native';
import Chat from "../organisms/Chat";
import withChatForm from "../organisms/withChatForm";
import ChatForm from "../molecules/ChatForm";
import styled from "styled-components/native/dist/styled-components.native.esm";
import ScreenWrapper from "../molecules/ScreenWrapper";
import {Icon} from 'react-native-elements'
import ParrotAgent from "../organisms/ParrotAgent";

class ChatScreen extends Component {
    render() {
        return (
            <ModifiedScreenWrapper>
                <Chat ChatAgent={ParrotAgent} ChatUserInput={withChatForm(ChatForm)}/>
            </ModifiedScreenWrapper>
        );
    }
}

// Padding handled by react-navigation.
const ModifiedScreenWrapper = styled(ScreenWrapper)`
   padding: 0px;
`;

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

class MaterialTopTabBarWrapper extends React.Component {
    render() {
        const {index} = this.props.navigationState;
        const color =
            index === 0 ? '#EC6701' : index === 1 ? '#A61380' : '#2196f3';

        return (
            <SafeAreaView
                style={{backgroundColor: '#2196f3'}}
                forceInset={{top: 'always', horizontal: 'never', bottom: 'never'}}>
                <MaterialTopTabBar
                    {...this.props}
                    activeTintColor={color}
                    indicatorStyle={{
                        backgroundColor: color,
                        position: 0
                    }}
                    style={{backgroundColor: '#fff'}}
                    inactiveTintColor='gray'
                />
            </SafeAreaView>
        );
    }
}

const tabBarIcon = (iconName, colorFocused) => ({focused}) => (
    <Icon name={iconName} color={focused ? colorFocused : 'gray'}/>
);

const TabNavigator = createMaterialTopTabNavigator({
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
            tabBarVisible: true
        }
    }
}, {
    initialRouteName: 'Chat',
    tabBarPosition: 'bottom',
    keyboardDismissMode: 'on-drag',
    swipeEnabled: false,
    tabBarOptions: {
        upperCaseLabel: false,
        pressOpacity: 1,
        showIcon: true,
    },
    tabBarComponent: MaterialTopTabBarWrapper,
});

const AppContainer = createAppContainer(TabNavigator);

storiesOf('Chat', module)
    .add('Tab navigation', () => (
        <AppContainer/>
    ));
