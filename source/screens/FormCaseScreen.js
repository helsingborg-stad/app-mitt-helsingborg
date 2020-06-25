import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ScreenWrapper } from 'app/components/molecules';
import { StatusBar } from 'react-native';
import CaseContext from 'app/store/CaseContext';
import Form from '../containers/Form/Form';
import formEkbMockData from '../assets/mock/form-case-ekb';
import AuthContext from '../store/AuthContext';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
`;

const FormCaseScreen = ({ navigation, ...props }) => {
  const { user } = useContext(AuthContext);
  const { createCase } = useContext(CaseContext);

  function handleCloseForm() {
    navigation.navigate('Start');
  }

  return (
    <FormScreenWrapper>
      <StatusBar hidden />
      <Form
        steps={formEkbMockData.steps}
        firstName={user.givenName}
        onClose={handleCloseForm}
        onStart={createCase}
        {...props}
      />
    </FormScreenWrapper>
  );
};

FormCaseScreen.propTypes = {
  navigation: PropTypes.object,
};

export default FormCaseScreen;
