import React, { useContext } from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import { ScreenWrapper } from 'app/components/molecules';
import { StatusBar } from 'react-native';
import Form from '../containers/Form/Form';
import AuthContext from '../store/AuthContext';
import CaseContext from '../store/CaseContext';
import FormContext from '../store/FormContext';

const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
`;

const FormCaseScreen = ({ route, navigation, ...props }) => {
  const { caseData, caseId, formId } = route ? route.params : {};

  const { user } = useContext(AuthContext);
  const { currentCase, updateCurrentCase } = useContext(CaseContext);
  const { currentForm } = useContext(FormContext);

  function handleCloseForm() {
    navigation.navigate('App', { screen: 'Home' });
  }

  /*
   * Function for handling behavior when a form starts
   * TO BE IMPLEMENTED
   * */
  function handleStartForm() {
    return null;
  }

  // TODO: Update case on form submit.
  function handleSubmitForm() {
    navigation.navigate('App', { screen: 'Home' });
  }

  return (
    <FormScreenWrapper>
      <StatusBar hidden />
      <Form
        steps={currentForm.steps}
        startAt={currentCase.currentStep || 1}
        firstName={user.firstName}
        onClose={handleCloseForm}
        onStart={handleStartForm}
        onSubmit={handleSubmitForm}
        initialAnswers={currentCase.data}
        updateCaseInContext={updateCurrentCase}
        {...props}
      />
    </FormScreenWrapper>
  );
};

FormCaseScreen.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default FormCaseScreen;
