import { useContext, useCallback } from "react";

import FormContext from "../../../store/FormContext";

import fileStorageService from "../../../services/storage/fileStorage/FileStorageService";

import type { Answer } from "../../../types/Case";
import { isUploadedAttachment } from "../Form.helpers";

const setUpAttachments = async (answers: Answer[]): Promise<void> => {
  const answerValues = answers
    .flatMap(({ value }) => (Array.isArray(value) && value) || [])
    .filter(isUploadedAttachment);

  await Promise.all(
    answerValues.map(({ id, uploadedId }) =>
      fileStorageService.ensureFile(id, uploadedId)
    )
  );
};

function useSetupForm(): [
  (caseAnswers: Answer[], formId: string) => Promise<void>
] {
  const { getForm } = useContext(FormContext);

  const setUpForm = useCallback(
    async (caseAnswers: Answer[], formId: string) => {
      await getForm(formId);
      await setUpAttachments(caseAnswers);
    },
    [getForm]
  );

  return [setUpForm];
}

export default useSetupForm;
