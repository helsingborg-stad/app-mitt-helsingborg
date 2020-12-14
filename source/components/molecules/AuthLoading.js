import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Icon from '../../components/atoms/Icon';
import {Animated, Easing} from 'react-native';
import Text from '../atoms/Text';
import Button from '../atoms/Button/Button';

const Container = styled.View`
  align-items: center;
`;

const AuthActivityIndicator = styled.ActivityIndicator`
  margin-bottom: 24px;
`;

const InfoText = styled(Text)`
  margin-bottom: 24px;
`;

const ResolvedIcon = styled(Icon)`
  color: ${(props) => props.theme.colors.primary[props.colorSchema][0]};
`;

const AuthLoading = (props) => {
  const {isBankidInstalled, cancelSignIn, colorSchema, isResolved} = props;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      easing: Easing.back(),
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  if (isResolved) {
    return (
      <Container as={Animated.View} style={{opacity: fadeAnimation}}>
        <ResolvedIcon size={48} name="check-circle" colorSchema={colorSchema} />
      </Container>
    );
  }

  return (
    <Container as={Animated.View} style={{opacity: fadeAnimation}}>
      <AuthActivityIndicator size="large" color="slategray" />
      {!isBankidInstalled && (
        <InfoText>Väntar på att BankID ska startas på en annan enhet</InfoText>
      )}
      <Button
        z={0}
        colorSchema={colorSchema}
        size="large"
        onClick={cancelSignIn}
        block>
        <Text>Avbryt</Text>
      </Button>
    </Container>
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
