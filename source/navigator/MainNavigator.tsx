import React, { useContext } from "react";
import env from "react-native-config";
import styled from "styled-components/native";
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  StackRouter,
  DefaultRouterOptions,
  createNavigatorFactory,
} from "@react-navigation/native";
import { Modal } from "react-native";
import AuthContext from "../store/AuthContext";
import Card from "../components/molecules/Card/Card";
import Text from "../components/atoms/Text/Text";
import { BackgroundBlurWrapper } from "../components/atoms/BackgroundBlur";
import useTouchActivity, {
  UseTouchParameters,
} from "../hooks/useTouchActivity";

import AuthStack from "./AuthStack";
import BottomBarNavigator from "./BottomBarNavigator";
import { SplashScreen, FormCaseScreen, DevFeaturesScreen } from "../screens";

import USER_AUTH_STATE from "../types/UserAuthTypes";

interface ForFade {
  current: {
    progress: number;
  };
}
const forFade = ({ current }: ForFade) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const FlexWrapper = styled.View`
  flex: 1;
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
}

const CustomNavigator = ({
  initialRouteName,
  children,
  screenOptions,
}: Props): JSX.Element => {
  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    children,
    screenOptions,
    initialRouteName,
  });
  const { handleLogout, userAuthState, handleRefreshSession } =
    useContext(AuthContext);

  const handleEndUserSession = async () => {
    if (userAuthState === USER_AUTH_STATE.SIGNED_IN) {
      await handleLogout();
    }
  };

  const touchParameters: UseTouchParameters = {
    inactivityTime: parseInt(env.INACTIVITY_TIME, 10),
    intervalDelay: 5000,
    logoutDelay: 60000,
    logOut: handleEndUserSession,
    refreshInterval: 60000 * 10,
    refreshSession: handleRefreshSession,
  };
  const {
    isActive,
    panResponder,
    updateIsActive,
    updateLatestTouchTime,
    updateLatestRefreshTime,
  } = useTouchActivity(touchParameters);

  const handleContinueUserSession = () => {
    updateIsActive(true);
    updateLatestTouchTime();

    handleRefreshSession();
    updateLatestRefreshTime();
  };

  const NavigatorContextComponent = (
    <NavigationHelpersContext.Provider
      key="navigationHelpersContext"
      value={navigation}
    >
      <FlexWrapper {...panResponder.panHandlers}>
        {descriptors[state.routes[state.index].key].render()}
      </FlexWrapper>
    </NavigationHelpersContext.Provider>
  );

  const isUserInactiveAndSignedIn =
    !isActive && userAuthState === USER_AUTH_STATE.SIGNED_IN;

  const InactivityDialogComponent = (
    <Modal
      key="inactivityDialogComponent"
      visible={isUserInactiveAndSignedIn}
      transparent
      presentationStyle="overFullScreen"
      animationType="fade"
    >
      <BackgroundBlurWrapper>
        <PopupContainer>
          <ContentContainer>
            <Card colorSchema="neutral">
              <Card.Body>
                <Card.Title>Är du fortfarande där?</Card.Title>
                <Card.Text>
                  Du har varit inaktiv under en längre tid, för att fortsätta
                  använda appen behöver du göra ett aktivt val.
                </Card.Text>
                <Card.Button colorSchema="red" onClick={handleEndUserSession}>
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
      </BackgroundBlurWrapper>
    </Modal>
  );

  return [NavigatorContextComponent, InactivityDialogComponent];
};

const createCustomNavigator = createNavigatorFactory(CustomNavigator);
const MainCustomNavigator = createCustomNavigator();

const MainNavigator = (): JSX.Element => {
  const { userAuthState } = useContext(AuthContext);

  return (
    <MainCustomNavigator.Navigator screenOptions={{ headerShown: false }}>
      <>
        {userAuthState === USER_AUTH_STATE.PENDING && (
          <MainCustomNavigator.Screen name="Start" component={SplashScreen} />
        )}

        {userAuthState === USER_AUTH_STATE.SIGNED_OUT && (
          <MainCustomNavigator.Screen
            name="Auth"
            component={AuthStack}
            options={{ cardStyleInterpolator: forFade }}
          />
        )}

        {userAuthState === USER_AUTH_STATE.SIGNED_IN && (
          <>
            <MainCustomNavigator.Screen
              name="App"
              component={BottomBarNavigator}
              options={{
                cardStyleInterpolator: forFade,
                gestureEnabled: false,
              }}
            />
            <MainCustomNavigator.Screen
              name="Form"
              component={FormCaseScreen}
              options={{
                gestureEnabled: false,
              }}
            />
            <MainCustomNavigator.Screen
              name="DevFeatures"
              component={DevFeaturesScreen}
              options={{
                gestureEnabled: false,
              }}
            />
          </>
        )}
      </>
    </MainCustomNavigator.Navigator>
  );
};

export default MainNavigator;
