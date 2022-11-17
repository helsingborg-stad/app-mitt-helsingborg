import React, { useContext, useEffect, useState, useMemo } from "react";

import Form, { defaultInitialStatus } from "../containers/Form/Form";

import AuthContext from "../store/AuthContext";
import FormContext from "../store/FormContext";
import { CaseDispatch, CaseState } from "../store/CaseContext";

import {
  getFormQuestions,
  convertAnswerArrayToObject,
} from "../helpers/CaseDataConverter";
import { getPasswordForForm } from "../services/encryption/CaseEncryptionHelper";
import { wrappedDefaultStorage } from "../services/storage/StorageService";
import { to } from "../helpers/Misc";

import type { Case, FormPosition, AnsweredForm, Answer } from "../types/Case";
import { ApplicationStatusType } from "../types/Case";
import type { CaseUpdate, Signature, Action } from "../types/CaseContext";

interface FormCaseScreenProps {
  route: { params: { caseId: string; isSignMode: boolean } };
  navigation: any;
}
const FormCaseScreen = ({
  route,
  navigation,
  ...props
}: FormCaseScreenProps): JSX.Element => {
  const [encryptionPin, setEncryptionPin] = useState("");
  const { caseId, isSignMode } = route?.params || {};
  const { user } = useContext(AuthContext);
  const { forms } = useContext(FormContext);
  const { cases } = useContext(CaseState);
  const { updateCase } = useContext(CaseDispatch);

  const initialCase = useMemo(() => cases[caseId] || {}, [cases, caseId]);
  const form = forms[initialCase?.currentFormId] || {};

  const initialAnswers = useMemo(() => {
    const answers = initialCase?.forms?.[initialCase?.currentFormId]?.answers;

    if (Array.isArray(answers)) {
      return convertAnswerArrayToObject(answers);
    }

    return answers;
  }, [initialCase]);

  const formQuestions = Object.keys(form)?.length
    ? getFormQuestions(form)
    : undefined;

  const initialPosition = {
    ...initialCase?.forms?.[initialCase.currentFormId]?.currentPosition,
    numberOfMainSteps: form?.stepStructure?.length ?? 0,
  };

  useEffect(() => {
    const setupEncryptionPin = async () => {
      const encryption =
        initialCase?.forms?.[initialCase?.currentFormId].encryption ?? {};

      const [, pinCode] = await to(
        getPasswordForForm(
          { encryption } as AnsweredForm,
          user,
          wrappedDefaultStorage
        )
      );

      const pinCodeToUse = (pinCode ?? "") as string;

      setEncryptionPin(pinCodeToUse);
    };

    void setupEncryptionPin();
  }, [initialCase, user]);

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
      completionsClarificationMessage={
        initialCase.details.completions?.description
      }
      {...props}
    />
  );
};

export default FormCaseScreen;
