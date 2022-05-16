import React, { useContext, useEffect, useState, useMemo } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

import Form, {
  defaultInitialPosition,
  defaultInitialStatus,
} from "../containers/Form/Form";

import AuthContext from "../store/AuthContext";
import FormContext from "../store/FormContext";
import { CaseDispatch, CaseState } from "../store/CaseContext";

import {
  getFormQuestions,
  convertAnswerArrayToObject,
} from "../helpers/CaseDataConverter";
import { getPasswordForForm } from "../services/encryption/CaseEncryptionHelper";
import { to } from "../helpers/Misc";

import {
  Case,
  FormPosition,
  ApplicationStatusType,
  AnsweredForm,
} from "../types/Case";
import { CaseUpdate, Answer, Signature, Action } from "../types/CaseContext";

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

interface FormCaseScreenProps {
  route: { params: { caseId: string; isSignMode: boolean } };
  navigation: any;
}
const FormCaseScreen = ({
  route,
  navigation,
  ...props
}: FormCaseScreenProps): JSX.Element => {
  const [currentFormId, setCurrentFormId] = useState("");
  const [encryptionPin, setEncryptionPin] = useState("");
  const { caseId, isSignMode } = route?.params || {};
  const { user } = useContext(AuthContext);
  const { getForm, forms } = useContext(FormContext);
  const { cases } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  const initialCase = useMemo(() => cases[caseId] || {}, [cases, caseId]);
  const form = useMemo(
    () => forms[currentFormId] || {},
    [forms, currentFormId]
  );
  const formQuestions = useMemo(
    () => (Object.keys(form).length > 0 ? getFormQuestions(form) : undefined),
    [form]
  );

  const initialPosition =
    initialCase?.forms?.[initialCase.currentFormId]?.currentPosition ||
    defaultInitialPosition;
  const initialAnswers =
    initialCase?.forms?.[initialCase.currentFormId]?.answers || {};

  useEffect(() => {
    const setInitialCase = async () => {
      if (caseId) {
        const initCase = cases[caseId];

        if (initCase !== undefined) {
          // Beware, dragons! Since we pass by reference, it seems like the answers
          // can be converted to object form already, thus we do this check.
          if (
            Array.isArray(initCase?.forms?.[initCase.currentFormId]?.answers)
          ) {
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
          }

          const encryption =
            initCase?.forms?.[initCase.currentFormId].encryption ?? {};

          const [, pinCode] = await to(
            getPasswordForForm({ encryption } as AnsweredForm, user)
          );

          const pinCodeToUse = (pinCode ?? "") as string;

          setEncryptionPin(pinCodeToUse);
          void getForm(initCase.currentFormId);
          setCurrentFormId(initCase.currentFormId);
        }
      }
    };

    void setInitialCase();
  }, [getForm, caseId, cases, user]);

  const handleCloseForm = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "App" }],
    });
  };

  const handleUpdateCase = async (
    answerObject: Record<string, Answer>,
    signature: Signature | undefined,
    currentPosition: FormPosition
  ): Promise<Action | void> => {
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

    const callback = async (putResponse: Case) => {
      if (
        putResponse?.status?.type?.includes(
          ApplicationStatusType.ACTIVE_SIGNATURE_COMPLETED
        )
      ) {
        updatedCase.encryptAnswers = false;
        await updateCase(updatedCase, () => Promise.resolve());
      }
    };

    return updateCase(updatedCase, callback);
  };

  // TODO: Update case on form submit.
  const handleSubmitForm = () => {
    handleCloseForm();
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
      status={initialCase?.status || defaultInitialStatus}
      period={initialCase?.details?.period}
      details={initialCase?.details ?? {}}
      onUpdateCase={handleUpdateCase}
      editable={!isSignMode}
      encryptionPin={encryptionPin}
      {...props}
    />
  );
};

export default FormCaseScreen;
