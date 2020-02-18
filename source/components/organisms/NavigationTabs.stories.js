/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator, MaterialTopTabBar } from 'react-navigation-tabs';
import { storiesOf } from '@storybook/react-native';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import { Icon } from 'react-native-elements';
import Chat from './Chat';
import withChatForm from './withChatForm';
import ChatForm from '../molecules/ChatForm';
import ScreenWrapper from '../molecules/ScreenWrapper';
import ParrotAgent from './ParrotAgent';
import TaskScreen from '../screens/TaskScreen';
import WatsonAgent from './WatsonAgent';

class ChatScreen extends Component {
  render() {
    return (
      <ModifiedScreenWrapper>
        <Chat ChatAgent={WatsonAgent} ChatUserInput={withChatForm(ChatForm)} />
      </ModifiedScreenWrapper>
    );
  }
}

// Padding handled by react-navigation.
const ModifiedScreenWrapper = styled(ScreenWrapper)`
  padding: 0px;
`;

class Profile extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Placeholder for profile screen</Text>
      </View>
    );
  }
}

class MaterialTopTabBarWrapper extends React.Component {
  render() {
    const { index } = this.props.navigationState;
    const color = index === 0 ? '#EC6701' : index === 1 ? '#A61380' : '#2196f3';

    return (
      <SafeAreaView
        style={{ backgroundColor: '#2196f3' }}
        forceInset={{ top: 'always', horizontal: 'never', bottom: 'never' }}
      >
        <MaterialTopTabBar
          {...this.props}
          activeTintColor={color}
          indicatorStyle={{
            backgroundColor: color,
            position: 0,
          }}
          style={{ backgroundColor: '#fff' }}
          inactiveTintColor="gray"
        />
      </SafeAreaView>
    );
  }
}

const tabBarIcon = (iconName, colorFocused) => ({ focused }) => (
  <Icon name={iconName} color={focused ? colorFocused : 'gray'} />
);

const TabNavigator = createMaterialTopTabNavigator(
  {
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        title: 'Prata med oss',
        tabBarIcon: tabBarIcon('message', '#EC6701'),
      },
    },
    UserEvents: {
      screen: props => (
        <ModifiedScreenWrapper>
          <TaskScreen />
        </ModifiedScreenWrapper>
      ),
      navigationOptions: {
        title: 'Mitt HBG',
        tabBarIcon: tabBarIcon('home', '#A61380'),
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        title: 'Profil',
        tabBarIcon: tabBarIcon('contacts', 'blue'),
        tabBarVisible: true,
      },
    },
  },
  {
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
  }
);

const AppContainer = createAppContainer(TabNavigator);

storiesOf('Chat', module).add('Tab navigation', () => <AppContainer />);
