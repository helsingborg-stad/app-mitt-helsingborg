import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Card, Header, ScreenWrapper } from 'app/components/molecules';
import { Button, Text } from 'app/components/atoms';
import { StatusBar, ActivityIndicator } from 'react-native';
import Form from '../containers/Form/Form';
import AuthContext from '../store/AuthContext';
import FormContext from '../store/FormContext';
import { CaseDispatch, CaseState } from '../store/CaseContext';
import { getFormQuestions } from '../helpers/CaseDataConverter';
import generateInitialCaseAnswers from '../store/actions/dynamicFormData';

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
  const [formQuestions, setFormQuestions] = useState(undefined);
  const [initialCase, setInitialCase] = useState(undefined);

  const { caseData, caseId } = route && route.params ? route.params : {};
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const { getCase, getCasesByFormIds } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  useEffect(() => {
    if (caseData?.formId) {
      getForm(caseData.formId).then(form => {
        setForm(form);
        setFormQuestions(getFormQuestions(form));
      });
      setInitialCase(caseData);
    } else if (caseId) {
      const initCase = getCase(caseId);
      getForm(initCase.formId).then(async form => {
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

  return (
    <FormScreenWrapper>
      <StatusBar hidden />
      {form?.steps ? (
        <Form
          navigation={navigation}
          steps={form.steps}
          connectivityMatrix={form.connectivityMatrix}
          initialPosition={caseData?.currentStep || initialCase?.currentStep}
          user={user}
          onClose={handleCloseForm}
          onStart={handleStartForm}
          onSubmit={handleSubmitForm}
          initialAnswers={initialCase?.data || caseData.data || {}}
          status={initialCase.status || 'ongoing'}
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
            style={[{ marginTop: 100 }]}
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
