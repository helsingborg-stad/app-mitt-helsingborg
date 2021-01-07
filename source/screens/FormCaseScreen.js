import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import Form from '../containers/Form/Form';
import { getFormQuestions } from '../helpers/CaseDataConverter';
import generateInitialCaseAnswers from '../store/actions/dynamicFormData';
import AuthContext from '../store/AuthContext';
import FormContext from '../store/FormContext';
import { CaseDispatch, CaseState } from '../store/CaseContext';

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FormCaseScreen = ({ route, navigation, ...props }) => {
  const [form, setForm] = useState(undefined);
  const [formQuestions, setFormQuestions] = useState(undefined);
  const [initialCase, setInitialCase] = useState(undefined);

  const { caseData, caseId } = route && route.params ? route.params : {};
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const { getCase, getCasesByFormIds } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  useEffect(() => {
    if (caseData?.formId) {
      getForm(caseData.formId).then((form) => {
        setForm(form);
        setFormQuestions(getFormQuestions(form));
      });
      setInitialCase(caseData);
    } else if (caseId) {
      const initCase = getCase(caseId);
      getForm(initCase.formId).then(async (form) => {
        const [status, latestCase, relevantCases] = await getCasesByFormIds([form.id]);
        const initialAnswersObject = generateInitialCaseAnswers(form, user, relevantCases);
        initCase.data = initialAnswersObject;
        setInitialCase(initCase);

        setForm(form);
        setFormQuestions(getFormQuestions(form));
      });
    }
  }, [caseData, caseId, getForm, getCase, user, getCasesByFormIds]);

  function handleCloseForm() {
    navigation.navigate('UserEvents', { screen: 'CaseOverview' });
  }

  const updateCaseContext = (data, status, currentPosition) => {
    // If the case is submitted, we should not actually update its data...
    if (initialCase.status === 'ongoing') {
      updateCase(initialCase.id, data, status, currentPosition, formQuestions);
    }
  };
  /*
   * Function for handling behavior when a form starts
   * TO BE IMPLEMENTED
   * */
  function handleStartForm() {
    return null;
  }

  // TODO: Update case on form submit.
  function handleSubmitForm() {
    navigation.navigate('App', { screen: 'UserEvents' });
  }

  if (!form?.steps) {
    return (
      <SpinnerContainer>
        <ActivityIndicator size="large" color="slategray" />
      </SpinnerContainer>
    );
  }

  return (
    <Form
      steps={form.steps}
      connectivityMatrix={form.connectivityMatrix}
      initialPosition={caseData?.currentPosition || initialCase?.currentPosition}
      user={user}
      onClose={handleCloseForm}
      onStart={handleStartForm}
      onSubmit={handleSubmitForm}
      initialAnswers={initialCase?.data || caseData.data || {}}
      status={initialCase.status || 'ongoing'}
      updateCaseInContext={updateCaseContext}
      {...props}
    />
  );
};

FormCaseScreen.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default FormCaseScreen;
