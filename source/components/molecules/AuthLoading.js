import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Text from '../atoms/Text';
import Button from '../atoms/Button/Button';

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

const AuthLoading = props => {
  const { isBankidInstalled, cancelLogin } = props;

  return (
    <AuthLoadingWrapper>
      <AuthLoadingBody>
        <AuthActivityIndicator size="large" color="slategray" />
        {!isBankidInstalled && <Text>Väntar på att BankID ska startas på en annan enhet</Text>}
      </AuthLoadingBody>
      <AuthLoadingAction>
        <Button color="purple" onClick={cancelLogin} block>
          <Text>Avbryt</Text>
        </Button>
      </AuthLoadingAction>
    </AuthLoadingWrapper>
  );
};

AuthLoading.propTypes = {
  isBankidInstalled: PropTypes.bool.isRequired,
  cancelLogin: PropTypes.func.isRequired,
};

export default AuthLoading;
