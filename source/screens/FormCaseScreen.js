import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import Form, { defaultInitialPosition } from '../containers/Form/Form';
import { getFormQuestions, convertAnswerArrayToObject } from '../helpers/CaseDataConverter';
import AuthContext from '../store/AuthContext';
import FormContext from '../store/FormContext';
import { CaseDispatch, CaseState } from '../store/CaseContext';
import { getStatusByType } from '../assets/mock/caseStatuses';

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const FormCaseScreen = ({ route, navigation, ...props }) => {
  const [form, setForm] = useState(undefined);
  const [formQuestions, setFormQuestions] = useState(undefined);

  const { caseId } = route && route.params ? route.params : {};
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const { cases } = useContext(CaseState);
  const { updateCase, getCase } = useContext(CaseDispatch);

  const currentCase = getCase(caseId);

  useEffect(() => {
    getForm(currentCase.currentFormId).then((form) => {
      setForm(form);
      setFormQuestions(getFormQuestions(form));
    });
  }, []);

  function handleCloseForm() {
    navigation.popToTop();
  }

  const updateCaseContext = (answerObject, status, currentPosition) => {
    // If the case is submitted, we should not actually update its data...
    if (!currentCase.status.type.includes('submitted')) {
      const caseData = {
        caseId: currentCase.id,
        formId: currentCase.currentFormId,
        answerObject,
        status,
        currentPosition,
        formQuestions,
      };
      updateCase(caseData);
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
    navigation.popToTop();
  }

  if (!form?.steps) {
    return (
      <SpinnerContainer>
        <ActivityIndicator size="large" color="slategray" />
      </SpinnerContainer>
    );
  }
  const initialPosition =
    currentCase?.forms?.[currentCase.currentFormId]?.currentPosition || defaultInitialPosition;
  const initialAnswers = currentCase?.forms?.[currentCase.currentFormId]?.answers || {};

  return (
    <Form
      steps={form.steps}
      connectivityMatrix={form.connectivityMatrix}
      initialPosition={initialPosition}
      user={user}
      onClose={handleCloseForm}
      onStart={handleStartForm}
      onSubmit={handleSubmitForm}
      initialAnswers={initialAnswers}
      status={currentCase.status}
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
