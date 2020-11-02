/* eslint-disable react/destructuring-assignment */
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';
import styled from 'styled-components/native';
import { ScreenWrapper } from 'app/components/molecules';
import { View } from 'react-native';
import { Text, Button } from 'app/components/atoms';
import { CaseDispatch } from 'app/store/CaseContext';
import FormList from 'app/components/organisms/FormList/FormList';

import { useNotification } from '../store/NotificationContext';

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
  const [showChat, setShowChat] = useState(false);
  const { createCase } = useContext(CaseDispatch);

  const toggleInput = () => {
    setInputVisible(true);
    showChat(false);
  };

  return (
    <>
      <View style={{ padding: 20, marginTop: 40, height: '73%' }}>
        <FormList
          heading="Ansökningsformulär"
          onClickCallback={async form => {
            createCase(
              form,
              async newCase => {
                navigation.navigate('Form', { caseData: newCase });
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
        {/* <HomeScreenButton
          color="purple"
          block
          onClick={() => {
            createCase(recurringFormId, newCase => {
              navigation.navigate('Form', { caseData: newCase });
            });
          }}
        >
          <Text>Starta ny Ekonomiskt Bistånd ansökan</Text>
        </HomeScreenButton> */}
      </ButtonContainer>
    </>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

export default HomeScreen;
