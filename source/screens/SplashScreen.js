import React, { useEffect, useContext } from 'react';
import env from 'react-native-config';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import AuthContext from '../store/AuthContext';
import StorageService, { SHOW_SPLASH_SCREEN, TOKEN_KEY } from '../services/StorageService';

const SplashContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

function SplashScreen(props) {
  const {
    navigation: { navigate },
  } = props;

  const {
    handleLogin,
    handleLogout,
    handleAddProfile,
    handleRemoveProfile,
    isUserAuthenticated,
  } = useContext(AuthContext);

  useEffect(() => {
    const boostrapAsync = async () => {
      console.log(await StorageService.getData(TOKEN_KEY));
    };

    boostrapAsync();
  }, []);
  /**
   * Returns if onboarding screen is disabled
   */
  const showOnboardingScreen = async () => {
    const value = await StorageService.getData(SHOW_SPLASH_SCREEN);
    return value !== false;
  };

  useEffect(() => {
    const authCheck = async () => {
      if (await isUserAuthenticated()) {
        handleLogin();
        await handleAddProfile();
        navigate('Chat');
      } else {
        await handleLogout();
        handleRemoveProfile();
        const showOnboarding = await showOnboardingScreen();
        navigate(showOnboarding ? 'Onboarding' : 'Login');
      }
    };

    authCheck();
  }, [
    handleAddProfile,
    handleLogin,
    handleLogout,
    handleRemoveProfile,
    isUserAuthenticated,
    navigate,
  ]);

  return (
    <SplashContainer>
      <ActivityIndicator size="large" color="slategray" />
    </SplashContainer>
  );
}

SplashScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SplashScreen;
