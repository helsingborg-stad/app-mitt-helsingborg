/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { WatsonAgent, Chat } from 'app/components/organisms';
import { ScreenWrapper } from 'app/components/molecules';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'app/components/atoms';

const styles = StyleSheet.create({
  button: {
    alignContent: 'center',
    padding: 10,
    margin: 15,
    maxWidth: '90%',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    bottom: 0,
  },
});
const ChatScreenWrapper = styled(ScreenWrapper)`
  padding-top: 0px;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0px;
`;
// padding-bottom: 0px;
class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    tabBarVisible: navigation.state.params.tabBarVisible,
  });

  state = {
    isInputVisible: false,
    isChatButton: true,
  };

  toggleTabs = () => {
    const { navigation } = this.props;
    navigation.setParams({
      tabBarVisible: navigation.getParam('tabBarVisible') !== true,
    });
  };

  toggleInput = () => {
    this.setState({ isInputVisible: true, isChatButton: false });
  };

  openEkonomiBistånd = () => {};

  render() {
    return (
      <>
        <ChatScreenWrapper>
          <Chat
            ChatAgent={props => <WatsonAgent {...props} initialMessages="remote" />}
            inputComponents={{
              type: 'text',
              placeholder: 'Skriv något...',
              autoFocus: false,
              display: 'none',
            }}
            // onUserLogin={this.toggleTabs} />)}
            ChatUserInput={false}
            keyboardVerticalOffset={0}
            isInputVisible={this.state.isInputVisible}
          />
          <View style={styles.buttonContainer}>
            {this.state.isChatButton ? (
              <Button
                color="purpleLight"
                style={styles.button}
                onClick={() => this.toggleInput()}
                block
              >
                <Text>Ställ en fråga</Text>
              </Button>
            ) : null}
            <Button
              color="purple"
              block
              style={styles.button}
              onClick={() => {
                this.props.navigation.navigate('Form');
              }}
            >
              <Text>Sök Ekonomiskt Bistånd</Text>
            </Button>
          </View>
        </ChatScreenWrapper>
      </>
    );
  }
}

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
