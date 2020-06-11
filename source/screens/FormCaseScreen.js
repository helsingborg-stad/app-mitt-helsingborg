import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ScreenWrapper } from 'app/components/molecules';
import { StatusBar } from 'react-native';
import Form from '../containers/Form/Form';
import formEkbMockData from '../assets/mock/form-case-ekb';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
`;

const FormCaseScreen = ({ navigation, ...props }) => {
  function handleCloseForm() {
    navigation.navigate('Start');
  }

  return (
    <FormScreenWrapper>
      <StatusBar hidden />
      <Form steps={formEkbMockData.steps} onClose={handleCloseForm} {...props} />
    </FormScreenWrapper>
  );
};

FormCaseScreen.propTypes = {
  navigation: PropTypes.object,
};

export default FormCaseScreen;
