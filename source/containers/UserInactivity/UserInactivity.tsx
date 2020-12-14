import React, { useContext, useCallback, useState } from 'react'
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import AuthContext from '../../store/AuthContext';
import ScreenWrapper from '../../components/molecules/ScreenWrapper';
import Card from '../../components/molecules/Card/Card';
import Text from '../../components/atoms/Text/Text';
import { useNavigation } from '@react-navigation/native';

const BackgroundBlur = styled.View`
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
  background-color: rgba(0, 0, 0, 0.35);
  margin: 0;
`;

const PopupContainer = styled.View`
  position: absolute;
  z-index: 1000;
  top: 33%;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0px;
  max-height: 50%;
  width: 100%;
`;

const ContentContainer = styled.View`
  padding: 0px;
  padding-bottom: 0px;
  flex-direction: column;
  justify-content: space-between;
  flex: 10;
  margin: 20px;
`;

function UserInactivity({children, ...rest}) {
  const navigation = useNavigation();
  const { panResponder, handleLogout, handleContinueSession,
  isActive } = useContext(AuthContext);

  const handleEndUserSession = async () => {
    await handleLogout();
    navigation.navigate('Start');
  }

  const handleContinueUserSession = () => {
    handleContinueSession();
  }

  return(
    <ScreenWrapper {...panResponder.panHandlers} {...rest}>
      {children}
      <Modal visible={!isActive}
transparent presentationStyle="overFullScreen" animationType="fade" style={{margin: 0, backgroundColor: "rgba(0, 0, 0, 0.35)"}}>
        <PopupContainer>
          <ContentContainer>
            <Card colorSchema="neutral">
              <Card.Body>
                <Card.Title>Är du fortfarande där?</Card.Title>
                <Card.Text>
                  Du har varit inaktiv under en längre tid, för att fortsätta använda appen behöver du göra ett aktivt val.
                </Card.Text>
                <Card.Button
                  colorSchema="red"
                  onClick={handleEndUserSession}
                >
                  <Text>Nej</Text>
                </Card.Button>
                <Card.Button
                  colorSchema="green"
                  onClick={handleContinueUserSession}
                >
                  <Text>Ja</Text>
                </Card.Button>
                </Card.Body>
            </Card>
          </ContentContainer>
        </PopupContainer>
      </Modal>
    </ScreenWrapper>
  )
}

export default UserInactivity

