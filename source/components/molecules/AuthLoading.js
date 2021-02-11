import { BlurView } from '@react-native-community/blur';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import styled from 'styled-components/native';
import theme from '../../styles/theme';
import Button from '../atoms/Button/Button';
import Icon from '../atoms/Icon';
import Text from '../atoms/Text';
import { Modal } from './Modal';

const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Box = styled.View`
  width: 70%;
  height: auto;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.neutrals[6]};
  padding: 16px;
  elevation: 2;
  shadow-offset: 0px 2px;
  shadow-color: black;
  shadow-opacity: 0.3;
  shadow-radius: 2px;
`;

const AuthActivityIndicator = styled.ActivityIndicator`
  margin-top: 12px;
  margin-bottom: 24px;
`;

const InfoText = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes[3]}px;
  margin-bottom: 24px;
  text-align: center;
  color: ${(props) => props.theme.colors.neutrals[1]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const AbortButton = styled(Button)`
  background: #e5e5e5;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.theme.colors.neutrals[1]};
  font-weight: ${(props) => props.theme.fontWeights[1]};
`;

const BlurredBackground = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const SuccessIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.primary[props.colorSchema][0]};
`;

const AuthLoading = (props) => {
  const { isBankidInstalled, cancelSignIn, colorSchema, isLoading, isResolved } = props;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(),
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  return (
    <>
      {isResolved && (
        <Container as={Animated.View} style={{ opacity: fadeAnimation }}>
          <SuccessIcon size={48} name="check-circle" colorSchema={colorSchema} />
        </Container>
      )}

      <Modal
        statusBarTranslucent
        animationType="fade"
        transparent
        presentationStyle="overFullScreen"
        visible={isLoading}
      >
        <Container>
          <Box>
            <AuthActivityIndicator size="large" color={theme.colors.primary[colorSchema][1]} />
            {!isBankidInstalled ? (
              <InfoText>Väntar på att BankID ska startas på en annan enhet</InfoText>
            ) : (
              <InfoText>Väntar på mobilt BankID</InfoText>
            )}
            <AbortButton z={0} colorSchema="neutral" size="large" onClick={cancelSignIn} block>
              <ButtonText>Avbryt</ButtonText>
            </AbortButton>
          </Box>
          <BlurredBackground
            blurType="light"
            blurAmount={15}
            reducedTransparencyFallbackColor="white"
          />
        </Container>
      </Modal>
    </>
  );
};

AuthLoading.propTypes = {
  isBankidInstalled: PropTypes.bool.isRequired,
  cancelSignIn: PropTypes.func.isRequired,
  isResolved: PropTypes.bool,
  isLoading: PropTypes.bool,
  /**
   * The color schema of the component. colors is defined in the application theme.
   */
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
};

AuthLoading.defaultProps = {
  colorSchema: 'neutral',
  isResolved: false,
  isLoading: false,
};

export default AuthLoading;
