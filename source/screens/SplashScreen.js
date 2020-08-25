import React, { useContext, useCallback } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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

  const {
    handleLogin,
    handleLogout,
    handleAddProfile,
    handleRemoveProfile,
    isUserAuthenticated,
  } = useContext(AuthContext);

  /**
   * Returns if onboarding screen is disabled
   */
  const showOnboardingScreen = async () => {
    const value = await StorageService.getData(SHOW_SPLASH_SCREEN);
    return value !== false;
  };

  useFocusEffect(
    useCallback(() => {
      const authCheck = async () => {
        if (await isUserAuthenticated()) {
          handleLogin();
          await handleAddProfile();
          navigate('App', { screen: 'Home' });
        } else {
          await handleLogout();
          handleRemoveProfile();
          const showOnboarding = await showOnboardingScreen();
          navigate('Auth', { screen: showOnboarding ? 'Onboarding' : 'Login' });
        }
      };
      authCheck();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

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
