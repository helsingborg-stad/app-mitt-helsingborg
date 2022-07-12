import { Animated } from "react-native";
import styled from "styled-components/native";

import { Button, Text } from "../../components/atoms";

const OnboardingContainer = styled.View`
  flex: 1;
`;

const AnimatedScrollContainer = styled(Animated.View)`
  flex: 6;
`;

const FooterContainer = styled.View`
  height: 90px;
`;

const AnimatedFooterBackground = styled(Animated.View)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const FooterContent = styled.View`
  flex: 1;
  flex-direction: row;
  padding-top: 10px;
`;

const FooterPagination = styled.View`
  padding-top: 10px;
  padding-left: 40px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const SliderContinueButtonContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  padding-right: 24px;
`;

const SkipButtonContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  align-self: flex-end;
  height: 64px;
  margin-top: 16px;
  margin-bottom: -16px;
  margin-right: 16px;
  z-index: 10;
`;

const ContinueButton = styled(Button)`
  background-color: transparent;
`;

const ContinueButtonText = styled(Text)`
  color: ${(props) => props.theme.colors.primary[props.colorSchema][0]};
  font-size: ${(props) => props.theme.fontSizes[3]}px;
`;

export {
  OnboardingContainer,
  AnimatedScrollContainer,
  FooterContainer,
  AnimatedFooterBackground,
  FooterContent,
  FooterPagination,
  SliderContinueButtonContainer,
  SkipButtonContainer,
  ContinueButton,
  ContinueButtonText,
};
