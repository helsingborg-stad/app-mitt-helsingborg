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
    isAccessTokenValid,
    isRejected,
    user,
  } = useContext(AuthContext);

  /**
   * Returns if onboarding screen is disabled
   */
  const showOnboardingScreen = async () => {
    const value = await StorageService.getData(SHOW_SPLASH_SCREEN);
    return value !== false;
  };

  /**
   * Starts to fetch user object if access token is valid
   */
  useFocusEffect(
    useCallback(() => {
      const authCheck = async () => {
        if (await isAccessTokenValid()) {
          handleAddProfile();
          return;
        }

        handleLogout();
      };

      authCheck();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  /**
   * Logs in user when user object exists and token is valid
   */
  useFocusEffect(
    useCallback(() => {
      const tryLogin = async () => {
        if ((await isAccessTokenValid()) && user) {
          handleLogin();
          navigate('App', { screen: 'UserEvents' });
        }
      };

      tryLogin();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])
  );

  /**
   * Logs out user if authentication is rejected
   */
  useFocusEffect(
    useCallback(() => {
      const logOut = async () => {
        handleLogout();
        handleRemoveProfile();
        const showOnboarding = await showOnboardingScreen();
        navigate('Auth', { screen: showOnboarding ? 'Onboarding' : 'Login' });
      };

      if (isRejected) {
        logOut();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRejected])
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
