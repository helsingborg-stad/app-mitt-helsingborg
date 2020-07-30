import React, { useEffect, useContext } from 'react';
import env from 'react-native-config';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import AuthContext from '../store/AuthContext';
import StorageService, { SHOW_SPLASH_SCREEN } from '../services/StorageService';

const SplashContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

function SplashScreen(props) {
  const {
    navigation: { navigate },
  } = props;

  const authContext = useContext(AuthContext);

  /**
   * Returns if onboarding screen is disabled
   */
  const showOnboardingScreen = async () => {
    const value = await StorageService.getData(SHOW_SPLASH_SCREEN);
    return value !== false;
  };

  useEffect(() => {
    const navigateAsync = async () => {
      const showOnboarding = await showOnboardingScreen();
      navigate(showOnboarding ? 'Onboarding' : 'Login');
    };

    const authCheck = async () => {
      if (await authContext.isUserAuthenticated()) {
        authContext.handleLogin();
        await authContext.handleAddProfile();
        navigate('Chat');
      } else {
        await authContext.handleLogout();
        authContext.handleRemoveProfile();
        await navigateAsync();
      }
    };

    authCheck();
  }, [authContext, navigate]);

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
