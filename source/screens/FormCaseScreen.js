import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ScreenWrapper } from 'app/components/molecules';
import { Button, Text } from 'app/components/atoms';
import { StatusBar, ActivityIndicator } from 'react-native';
import Form from '../containers/Form/Form';
import AuthContext from '../store/AuthContext';
import FormContext from '../store/FormContext';

import { CaseDispatch, CaseState } from '../store/CaseContext';

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const FormScreenWrapper = styled(ScreenWrapper)`
  padding: 0;
  flex: 1;
`;

const FormCaseScreen = ({ route, navigation, ...props }) => {
  const [form, setForm] = useState(undefined);
  const [initialCase, setInitialCase] = useState(undefined);

  const { caseData, caseId } = route && route.params ? route.params : {};
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const { getCase } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  useEffect(() => {
    if (caseData?.formId) {
      console.log('use effect in formCaseScreen with caseData.formId');
      getForm(caseData.formId).then(form => setForm(form));
      setInitialCase(caseData);
    } else if (caseId) {
      const initCase = getCase(caseId);
      setInitialCase(initCase);
      getForm(initCase.formId).then(form => setForm(form));
    }
  }, [caseData, caseId, getForm, getCase]);

  function handleCloseForm() {
    navigation.navigate('App', { screen: 'Home' });
  }

  const updateCaseContext = (data, status, currentStep) => {
    updateCase(initialCase.id, data, status, currentStep);
  };

  console.log('initial case', initialCase);
  if (initialCase?.formId) console.log('form id', initialCase.formId);
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
      {form?.steps ? (
        <Form
          steps={form.steps}
          startAt={caseData?.currentStep || initialCase?.currentStep || 1}
          firstName={user?.firstName || ''}
          onClose={handleCloseForm}
          onStart={handleStartForm}
          onSubmit={handleSubmitForm}
          initialAnswers={initialCase?.data || caseData.data || {}}
          updateCaseInContext={updateCaseContext}
          {...props}
        />
      ) : (
        <SpinnerContainer>
          <ActivityIndicator size="large" color="slategray" />
          <Button
            onClick={() => {
              navigation.goBack();
            }}
            style={{ marginTop: 100 }}
          >
            <Text>Avbryt</Text>
          </Button>
        </SpinnerContainer>
      )}
    </FormScreenWrapper>
  );
};

FormCaseScreen.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default FormCaseScreen;
