/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  View,
  TextInput,
  Linking,
} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

import Text from '../atoms/Text';
import Button from '../atoms/Button/Button';

const AuthLoading = props => (
  <AuthLoadingWrapper>
    <AuthLoadingBody>
      <AuthActivityIndicator size="large" color="slategray" />
      {!props.isBankidInstalled && <Text>Väntar på att BankID ska startas på en annan enhet</Text>}
    </AuthLoadingBody>
    <AuthLoadingAction>
      <Button color="purple" onClick={props.cancelLogin} block>
        <Text>Avbryt</Text>
      </Button>
    </AuthLoadingAction>
  </AuthLoadingWrapper>
);

AuthLoading.propTypes = {
  isBankidInstalled: PropTypes.bool.isRequired,
  cancelLogin: PropTypes.func.isRequired,
};

const AuthActivityIndicator = styled.ActivityIndicator`
  margin-bottom: 32px;
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

export default AuthLoading;
