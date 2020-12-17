import React, { useContext } from 'react';
import styled from 'styled-components/native';
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  StackRouter,
  DefaultRouterOptions,
} from '@react-navigation/native';
import { Modal } from 'react-native';
import AuthContext from '../store/AuthContext';
import Card from '../components/molecules/Card/Card';
import Text from '../components/atoms/Text/Text';

const FlexWrapper = styled.View`
  flex: 1;
`;
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
  padding: 0px;
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

interface Props {
  initialRouteName: string;
  children: React.ReactNode;
  screenOptions: DefaultRouterOptions;
  contentStyle: any;
}

const CustomStackNavigator = ({
  initialRouteName,
  children,
  screenOptions,
  contentStyle,
}: Props) => {
  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    children,
    screenOptions,
    initialRouteName,
  });
  const {
    panResponder,
    handleLogout,
    handleContinueSession,
    isActive,
    isAuthenticated,
  } = useContext(AuthContext);

  const handleEndUserSession = async () => {
    await handleLogout();
    navigation.navigate('Start');
  };

  const handleContinueUserSession = () => {
    handleContinueSession();
  };

  const NavigatorContextComponent = (
    <NavigationHelpersContext.Provider value={navigation}>
      <FlexWrapper {...panResponder.panHandlers} style={[contentStyle]}>
        {descriptors[state.routes[state.index].key].render()}
      </FlexWrapper>
    </NavigationHelpersContext.Provider>
  );

  const InactivityDialogComponent = (
    <Modal
      visible={!isActive && isAuthenticated}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
    >
      <BackgroundBlur>
        <PopupContainer>
          <ContentContainer>
            <Card colorSchema="neutral">
              <Card.Body>
                <Card.Title>Är du fortfarande där?</Card.Title>
                <Card.Text>
                  Du har varit inaktiv under en längre tid, för att fortsätta använda appen behöver
                  du göra ett aktivt val.
                </Card.Text>
                <Card.Button colorSchema="red" onClick={handleEndUserSession}>
                  <Text>Nej</Text>
                </Card.Button>
                <Card.Button colorSchema="green" onClick={handleContinueUserSession}>
                  <Text>Ja</Text>
                </Card.Button>
              </Card.Body>
            </Card>
          </ContentContainer>
        </PopupContainer>
      </BackgroundBlur>
    </Modal>
  );

  return [NavigatorContextComponent, InactivityDialogComponent];
};

export default CustomStackNavigator;
