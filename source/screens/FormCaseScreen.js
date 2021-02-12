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
  const [initialCase, setInitialCase] = useState(undefined);

  const { caseData, caseId } = route && route.params ? route.params : {};
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const { getCase, getCasesByFormIds } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  useEffect(() => {
    if (caseData?.currentFormId) {
      getForm(caseData.currentFormId).then((form) => {
        setForm(form);
        setFormQuestions(getFormQuestions(form));
      });
      const answersObject = convertAnswerArrayToObject(caseData.answers);
      caseData.answers = answersObject;
      setInitialCase(caseData);
    } else if (caseId) {
      const initCase = getCase(caseId);
      const answersObject = convertAnswerArrayToObject(initCase.answers);
      initCase.answers = answersObject;
      setInitialCase(initCase);

      getForm(initCase.currentFormId).then(async (form) => {
        setForm(form);
        setFormQuestions(getFormQuestions(form));
      });
    }
  }, [caseData, caseId, getForm, getCase, user, getCasesByFormIds]);

  function handleCloseForm() {
    navigation.popToTop();
  }

  const updateCaseContext = (answerObject, status, currentPosition) => {
    // If the case is submitted, we should not actually update its data...
    if (
      initialCase.status.type.includes('ongoing') ||
      initialCase.status.type.includes('notStarted')
    ) {
      const caseData = {
        caseId: initialCase.id,
        formId: initialCase.currentFormId,
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
  initialPosition =
    initialCase?.forms?.[initialCase.currentFormId]?.currentPosition || defaultInitialPosition;

  return (
    <Form
      steps={form.steps}
      connectivityMatrix={form.connectivityMatrix}
      initialPosition={initialPosition}
      user={user}
      onClose={handleCloseForm}
      onStart={handleStartForm}
      onSubmit={handleSubmitForm}
      initialAnswers={initialCase?.answers || caseData.answers || {}}
      status={initialCase.status || getStatusByType('notStarted')}
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
