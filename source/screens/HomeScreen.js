/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { Component, useState, useContext } from 'react';
import styled from 'styled-components/native';
import { WatsonAgent, Chat } from 'app/components/organisms';
import { ScreenWrapper } from 'app/components/molecules';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'app/components/atoms';
import CaseContext from 'app/store/CaseContext';

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

const HomeScreen = ({ navigation }) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [isChatButton, setChatButton] = useState(true);

  const { updateCases } = useContext(CaseContext);

  const navigationOptions = ({ navigation }) => ({
    tabBarVisible: navigation.state.params.tabBarVisible,
  });

  const toggleTabs = () => {
    navigation.setParams({
      tabBarVisible: navigation.getParam('tabBarVisible') !== true,
    });
  };

  const toggleInput = () => {
    setInputVisible(true);
    setChatButton(false);
  };

  const openEkonomiBistånd = () => {};

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
          isInputVisible={isInputVisible}
        />
        <View style={styles.buttonContainer}>
          {isChatButton ? (
            <Button color="purpleLight" style={styles.button} onClick={() => toggleInput()} block>
              <Text>Ställ en fråga</Text>
            </Button>
          ) : null}
          <Button
            color="purple"
            block
            style={styles.button}
            onClick={() => {
              updateCases(() => navigation.navigate('Form'));
            }}
          >
            <Text>Sök Ekonomiskt Bistånd</Text>
          </Button>
        </View>
      </ChatScreenWrapper>
    </>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
