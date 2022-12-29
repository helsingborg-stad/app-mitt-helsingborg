import React from "react";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";

const SplashContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SplashScreen = (): JSX.Element => (
  <SplashContainer>
    <ActivityIndicator size="large" color="slategray" />
  </SplashContainer>
);

export default SplashScreen;
