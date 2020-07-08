import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
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

const FormCaseScreen = ({ navigation, ...props }) => {
  const { user } = useContext(AuthContext);
  const { currentCase, createCase, updateCurrentCase } = useContext(CaseContext);
  const { form, getForm } = useContext(FormContext);

  useEffect(() => {
    getForm('4bc10130-af17-11ea-b35b-c9388ccd1548');
  }, [getForm]);

  function handleCloseForm() {
    navigation.navigate('Start');
  }

  /*
   * Function for handling behavior when a form starts
   * TO BE IMPLEMENTED
   * */
  function handleStartForm() {
    return null;
  }

  // TODO: Update case on form submit.
  function handleSubmitForm(data) {
    // This is a temporary fix, since put endpoint in api is not yet implemented.
    // createCase(data);
    // updateCaseInContext(formState.formAnswers, 'submitted');

    updateCurrentCase(data, 'submitted');
    navigation.navigate('Start');
  }

  return (
    <FormScreenWrapper>
      <StatusBar hidden />
      <Form
        steps={form.steps}
        firstName={user.firstName}
        onClose={handleCloseForm}
        onStart={handleStartForm}
        onSubmit={handleSubmitForm}
        initialAnswers={currentCase.attributes.data}
        updateCaseInContext={updateCurrentCase}
        {...props}
      />
    </FormScreenWrapper>
  );
};

FormCaseScreen.propTypes = {
  navigation: PropTypes.object,
};

export default FormCaseScreen;
