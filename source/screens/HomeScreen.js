/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components/native';
import { WatsonAgent, Chat } from 'app/components/organisms';
import { ScreenWrapper } from 'app/components/molecules';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'app/components/atoms';
import CaseContext from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';

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

const HomeScreen = ({ navigation }) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [isChatButton, setChatButton] = useState(true);

  const { updateCases, createCase } = useContext(CaseContext);
  const { getForm, form } = useContext(FormContext);

  // TODO: Remove static formId. Should be fetched or defined as env variable.
  const formId = 'e7801ac0-c4f7-11ea-9198-757c76f2706c';

  useEffect(() => {
    getForm(formId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            disabled={!form.steps}
            color="purple"
            block
            style={styles.button}
            onClick={() => {
              createCase({}, form.id, () => navigation.navigate('Form'), true);
            }}
          >
            <Text>Starta ny Ekonomiskt Bistånd ansökan</Text>
          </Button>
          <Button
            disabled={!form.steps}
            color="purple"
            block
            style={styles.button}
            onClick={() => {
              updateCases(() => navigation.navigate('Form'));
            }}
          >
            <Text>Fortsätt senaste ansökan</Text>
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
