import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import HbgLogo from '../assets/slides/stadsvapen.png';
import AuthContext from '../store/AuthContext';
import StorageService, { SHOW_SPLASH_SCREEN } from '../services/StorageService';

const SplashContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 100px;
`;

function SplashScreen(props) {
  const {
    navigation: { navigate },
  } = props;

  const { isAuthenticated } = useContext(AuthContext);

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

    switch (isAuthenticated) {
      case true:
        navigate('Chat');
        break;
      case false:
        navigateAsync();
        break;
      default:
    }
  }, [isAuthenticated, navigate]);

  return (
    <SplashContainer>
      <Logo source={HbgLogo} resizeMode="contain" />
    </SplashContainer>
  );
}

SplashScreen.propTypes = {
  navigation: PropTypes.object,
};

export default SplashScreen;
