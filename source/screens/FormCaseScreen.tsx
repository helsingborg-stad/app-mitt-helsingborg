import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import Form, {
  defaultInitialPosition,
  defaultInitialStatus,
} from "../containers/Form/Form";
import {
  getFormQuestions,
  convertAnswerArrayToObject,
} from "../helpers/CaseDataConverter";
import AuthContext from "../store/AuthContext";
import FormContext from "../store/FormContext";
import { CaseDispatch, CaseState } from "../store/CaseContext";
import { Case, FormPosition, ApplicationStatusType } from "../types/Case";
import { Form as FormType, Question } from "../types/FormTypes";
import { CaseUpdate, Answer, Signature } from "../types/CaseContext";

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

interface FormCaseScreenProps {
  route: { params: { caseData: Case; caseId: string; isSignMode: boolean } };
  navigation: any;
}
const FormCaseScreen = ({
  route,
  navigation,
  ...props
}: FormCaseScreenProps): JSX.Element => {
  const [form, setForm] = useState<FormType | undefined | null>(undefined);
  const [formQuestions, setFormQuestions] = useState<Question[] | undefined>(
    undefined
  );
  const [initialCase, setInitialCase] = useState<Case | undefined>(undefined);
  const { caseData, caseId, isSignMode } = route?.params || {};
  const { user } = useContext(AuthContext);
  const { getForm } = useContext(FormContext);
  const { getCase } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  const initialPosition =
    initialCase?.forms?.[initialCase.currentFormId]?.currentPosition ||
    defaultInitialPosition;
  const initialAnswers =
    initialCase?.forms?.[initialCase.currentFormId]?.answers || {};

  useEffect(() => {
    if (caseData?.currentFormId) {
      void getForm(caseData.currentFormId).then((fetchedForm) => {
        setForm(fetchedForm);
        setFormQuestions(getFormQuestions(fetchedForm));
      });
      const answerArray =
        caseData?.forms?.[caseData.currentFormId]?.answers || [];
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
        const answerArray =
          initCase?.forms?.[initCase.currentFormId]?.answers || [];
        const answersObject = convertAnswerArrayToObject(answerArray);
        initCase.forms = {
          ...initCase.forms,
          [initCase.currentFormId]: {
            ...initCase.forms[initCase.currentFormId],
            answers: answersObject,
          },
        };

        setInitialCase(initCase);

        void getForm(initCase.currentFormId).then(async (fetchedForm) => {
          setForm(fetchedForm);
          setFormQuestions(getFormQuestions(fetchedForm));
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseData, getForm]);

  const handleCloseForm = () => {
    navigation.popToTop();
  };

  const updateCaseContext = (
    answerObject: Record<string, Answer>,
    signature: Signature,
    currentPosition: FormPosition
  ) => {
    // If the case is submitted, we should not actually update its data...
    if (
      initialCase !== undefined &&
      !initialCase.status.type.includes(ApplicationStatusType.ACTIVE_SUBMITTED)
    ) {
      const updatedCase: CaseUpdate = {
        user,
        caseId: initialCase.id,
        formId: initialCase.currentFormId,
        answerObject,
        signature,
        currentPosition,
        formQuestions: formQuestions || [],
        encryption: initialCase.forms[initialCase.currentFormId].encryption,
        encryptAnswers: true,
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

      const callback = (putResponse: Case) => {
        if (
          putResponse?.status?.type?.includes(
            ApplicationStatusType.ACTIVE_SIGNATURE_COMPLETED
          )
        ) {
          updatedCase.encryptAnswers = false;
          updateCase(updatedCase, () => true);
        }
      };

      updateCase(updatedCase, callback);
    }
  };

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
      onSubmit={handleSubmitForm}
      initialAnswers={initialAnswers}
      persons={initialCase?.persons}
      status={initialCase.status || defaultInitialStatus}
      period={initialCase.details.period}
      completions={initialCase?.details?.completions?.requested || []}
      updateCaseInContext={updateCaseContext}
      editable={!isSignMode}
      {...props}
    />
  );
};

export default FormCaseScreen;
