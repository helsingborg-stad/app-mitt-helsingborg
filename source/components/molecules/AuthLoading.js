import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Icon from 'app/components/atoms/Icon';
import { Animated, Easing } from 'react-native';
import Text from '../atoms/Text';
import Button from '../atoms/Button/Button';

const AuthActivityIndicator = styled.ActivityIndicator`
  margin-bottom: 24px;
`;

const AuthLoadingWrapper = styled.View`
  flex: 1;
`;

const AuthLoadingBody = styled.View`
  flex: 1;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const AuthLoadingAction = styled.View`
  flex-grow: 0;
  justify-content: flex-end;
`;

const AuthResolvedIcon = styled(Icon)`
  color: ${props => props.theme.colors.primary[props.colorSchema][0]};
  align-self: center;
`;

const AuthLoading = props => {
  const { isBankidInstalled, cancelSignIn, colorSchema, isResolved } = props;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(),
      duration: 250,
    }).start();
  }, [fadeAnimation]);

  if (isResolved) {
    return (
      <AuthLoadingWrapper as={Animated.View} style={{ opacity: fadeAnimation }}>
        <AuthResolvedIcon size={48} name="check-circle" colorSchema={colorSchema} />
      </AuthLoadingWrapper>
    );
  }

  return (
    <AuthLoadingWrapper as={Animated.View} style={{ opacity: fadeAnimation }}>
      <AuthLoadingBody>
        <AuthActivityIndicator size="large" color="slategray" />
        {!isBankidInstalled && <Text>Väntar på att BankID ska startas på en annan enhet</Text>}
      </AuthLoadingBody>
      <AuthLoadingAction>
        <Button colorSchema={colorSchema} size="large" onClick={cancelSignIn} block>
          <Text>Avbryt</Text>
        </Button>
      </AuthLoadingAction>
    </AuthLoadingWrapper>
  );
};

AuthLoading.propTypes = {
  isBankidInstalled: PropTypes.bool.isRequired,
  cancelSignIn: PropTypes.func.isRequired,
  isResolved: PropTypes.bool,
  /**
   * The color schema of the component. colors is defined in the application theme.
   */
  colorSchema: PropTypes.oneOf(['neutral', 'blue', 'red', 'purple', 'green']),
};

AuthLoading.defaultProps = {
  colorSchema: 'neutral',
  isResolved: false,
};

export default AuthLoading;
