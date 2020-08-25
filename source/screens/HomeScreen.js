/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components/native';
import { WatsonAgent, Chat } from 'app/components/organisms';
import { ScreenWrapper } from 'app/components/molecules';
import { View } from 'react-native';
import { Text, Button } from 'app/components/atoms';
import CaseContext from 'app/store/CaseContext';
import FormContext from 'app/store/FormContext';
import FormList from 'app/components/organisms/FormList/FormList';

const ButtonContainer = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  bottom: 0;
`;

const HomeScreenButton = styled(Button)`
  align-content: center;
  padding: 10px;
  margin: 15px;
  max-width: 90%;
`;

const ChatScreenWrapper = styled(ScreenWrapper)`
  padding-top: 0px;
  padding-left: 0;
  padding-right: 0;
  padding-bottom: 0px;
`;

const HomeScreen = ({ navigation }) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [showChat] = useState(false);

  const { createCase, currentCase } = useContext(CaseContext);
  const { setCurrentForm, currentForm } = useContext(FormContext);

  /**
   * This side effect sets the currentForm when the currentCase is updated.
   */
  useEffect(() => {
    if (currentCase && currentCase.formId) {
      setCurrentForm(currentCase.formId);
    }
  }, [currentCase, setCurrentForm]);

  const toggleInput = () => {
    setInputVisible(true);
    showChat(false);
  };

  const recurringFormId = 'a3165a20-ca10-11ea-a07a-7f5f78324df2';

  return (
    <>
      <ChatScreenWrapper>
        {showChat && (
          <Chat
            ChatAgent={props => <WatsonAgent {...props} initialMessages="remote" />}
            inputComponents={{
              type: 'text',
              placeholder: 'Skriv något...',
              autoFocus: false,
              display: 'none',
            }}
            ChatUserInput={false}
            keyboardVerticalOffset={0}
            isInputVisible={isInputVisible}
          />
        )}

        <View style={{ padding: 20, marginTop: 40, height: '73%' }}>
          <FormList
            heading="Ansökningsformulär"
            onClickCallback={async id => {
              createCase(
                {},
                id,
                async () => {
                  await setCurrentForm(id);
                  navigation.navigate('Form');
                },
                true
              );
            }}
          />
        </View>

        <ButtonContainer>
          {showChat ? (
            <HomeScreenButton color="purpleLight" onClick={() => toggleInput()} block>
              <Text>Ställ en fråga</Text>
            </HomeScreenButton>
          ) : null}
          <HomeScreenButton
            disabled={!currentForm.steps}
            color="purple"
            block
            onClick={() => {
              createCase(
                {},
                recurringFormId,
                async () => {
                  await setCurrentForm(recurringFormId);
                  navigation.navigate('Form');
                },
                true
              );
            }}
          >
            <Text>Starta ny Ekonomiskt Bistånd ansökan</Text>
          </HomeScreenButton>
          <HomeScreenButton
            disabled={!currentForm.steps}
            color="purple"
            block
            onClick={() => navigation.navigate('Form')}
          >
            <Text>Fortsätt senaste ansökan</Text>
          </HomeScreenButton>
        </ButtonContainer>
      </ChatScreenWrapper>
    </>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
