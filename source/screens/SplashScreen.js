import React from 'react';
import styled from 'styled-components';
import HbgLogo from '../assets/slides/stadsvapen.png';

const SplashContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 100px;
`;

const SplashScreen = () => (
  <SplashContainer>
    <Logo source={HbgLogo} resizeMode="contain" />
  </SplashContainer>
);

export default SplashScreen;
