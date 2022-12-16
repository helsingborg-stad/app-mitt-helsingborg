import React, { useContext, useEffect, useState, useMemo } from "react";
import { ActivityIndicator } from "react-native";

import Form, { defaultInitialStatus } from "../../containers/Form/Form";

import { CaseDispatch, CaseState } from "../../store/CaseContext";
import AuthContext from "../../store/AuthContext";
import FormContext from "../../store/FormContext";

import {
  getFormQuestions,
  convertAnswerArrayToObject,
} from "../../helpers/CaseDataConverter";
import { to } from "../../helpers/Misc";

import { getPasswordForForm } from "../../services/encryption/CaseEncryptionHelper";
import { wrappedDefaultStorage } from "../../services/storage/StorageService";

import type { CaseUpdate, Signature, Action } from "../../types/CaseContext";
import { ApplicationStatusType } from "../../types/Case";
import type { Props } from "./FormCaseScreen.types";
import type { User } from "../../types/UserTypes";
import type {
  Case,
  FormPosition,
  AnsweredForm,
  Answer,
} from "../../types/Case";

const FROM_LOADING_TO_FORM_DELAY = 500;

const FormCaseScreen = ({ route, navigation }: Props): JSX.Element => {
  const [encryptionPin, setEncryptionPin] = useState("");
  const [loadingEncryptionPin, setLoadingEncryptionPin] = useState(true);

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
          user as User,
          wrappedDefaultStorage
        )
      );

      const pinCodeToUse = (pinCode ?? "") as string;

      setEncryptionPin(pinCodeToUse);
      setTimeout(
        () => setLoadingEncryptionPin(false),
        FROM_LOADING_TO_FORM_DELAY
      );
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

  if (loadingEncryptionPin) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center" }}
        size="large"
      />
    );
  }

  return (
    <Form
      steps={form.steps}
      connectivityMatrix={form.connectivityMatrix}
      initialPosition={initialPosition}
      user={user as User}
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
    />
  );
};

export default FormCaseScreen;
