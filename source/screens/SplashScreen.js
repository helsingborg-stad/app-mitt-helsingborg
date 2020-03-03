import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
import HbgLogo from '../assets/slides/stadsvapen.png';
import AuthContext from '../store/AuthContext';

const SplashContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.Image`
  width: 100px;
`;

function SplashScreen(props) {
  const { isAuthenticatedLOL } = useContext(AuthContext);
  console.log("isAuthenticated in OUTISDE'", isAuthenticatedLOL);

  const {
    navigation: { navigate },
  } = props;

  useEffect(() => {
    console.log("isAuthenticated in use effect'", isAuthenticatedLOL);
    // TODO: wait for response before navigating
    navigate(isAuthenticatedLOL ? 'Chat' : 'Onboarding');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticatedLOL]);

  return (
    <SplashContainer>
      <Logo source={HbgLogo} resizeMode="contain" />
    </SplashContainer>
  );
}

export default SplashScreen;
