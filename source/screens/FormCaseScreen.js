import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import Form, { defaultInitialPosition, defaultInitialStatus } from '../containers/Form/Form';
import { getFormQuestions, convertAnswerArrayToObject } from '../helpers/CaseDataConverter';
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
  const { caseData, caseId, isSignMode } = route && route.params ? route.params : {};
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const { getCase } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  const initialPosition =
    initialCase?.forms?.[initialCase.currentFormId]?.currentPosition || defaultInitialPosition;
  const initialAnswers = initialCase?.forms?.[initialCase.currentFormId]?.answers || {};

  useEffect(() => {
    if (caseData?.currentFormId) {
      getForm(caseData.currentFormId).then((form) => {
        setForm(form);
        setFormQuestions(getFormQuestions(form));
      });
      const answerArray = caseData?.forms?.[caseData.currentFormId]?.answers || [];
      const answersObject = convertAnswerArrayToObject(answerArray);
      caseData.forms = {
        ...caseData.forms,
        [caseData.currentFormId]: {
          ...caseData.forms[caseData.currentFormId],
          answers: answersObject,
        },
      };
      setInitialCase(caseData);
    } else if (caseId) {
      const initCase = getCase(caseId);
      // Beware, dragons! Since we pass by reference, it seems like the answers
      // can be converted to object form already, thus we do this check.
      if (Array.isArray(initCase?.forms?.[initCase.currentFormId]?.answers)) {
        const answerArray = initCase?.forms?.[initCase.currentFormId]?.answers || [];
        const answersObject = convertAnswerArrayToObject(answerArray);
        initCase.forms = {
          ...initCase.forms,
          [initCase.currentFormId]: {
            ...initCase.forms[initCase.currentFormId],
            answers: answersObject,
          },
        };
        setInitialCase(initCase);

        getForm(initCase.currentFormId).then(async (form) => {
          setForm(form);
          setFormQuestions(getFormQuestions(form));
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseData, getForm]);

  const handleCloseForm = () => {
    navigation.popToTop();
  };

  const updateCaseContext = (answerObject, signature, currentPosition) => {
    // If the case is submitted, we should not actually update its data...
    if (!initialCase.status.type.includes('submitted')) {
      const caseData = {
        caseId: initialCase.id,
        formId: initialCase.currentFormId,
        answerObject,
        signature,
        currentPosition,
        formQuestions,
      };

      // We set the initial case to prevent desync issues with the above logic.
      // If we don't, the case will be updated all the time, because the initialCase
      //    still has the "not started" status.
      setInitialCase({
        ...initialCase,
        forms: {
          ...initialCase.forms,
          [initialCase.currentFormId]: {
            ...initialCase.forms[initialCase.currentFormId],
            answers: {
              ...initialCase.forms[initialCase.currentFormId].answers,
              ...answerObject,
            },
            currentPosition: {
              ...initialCase.forms[initialCase.currentFormId].currentPosition,
              ...currentPosition,
            },
          },
        },
      });

      const callback = (putResponse) => {
        if (putResponse?.status?.type?.includes('signature:completed')) {
          caseData.encryptAnswers = false;
          updateCase(caseData);
        }
      };

      updateCase(caseData, callback);
    }
  };

  /*
   * Function for handling behavior when a form starts
   * TO BE IMPLEMENTED
   * */
  const handleStartForm = () => null;

  // TODO: Update case on form submit.
  const handleSubmitForm = () => {
    navigation.popToTop();
  };

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
      initialPosition={initialPosition}
      user={user}
      onClose={handleCloseForm}
      onStart={handleStartForm}
      onSubmit={handleSubmitForm}
      initialAnswers={initialAnswers}
      status={initialCase.status || defaultInitialStatus}
      period={initialCase.details.period}
      updateCaseInContext={updateCaseContext}
      editable={!isSignMode}
      {...props}
    />
  );
};

FormCaseScreen.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default FormCaseScreen;
