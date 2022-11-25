import { answersAreEncrypted } from "../services/encryption";
import { ApplicationStatusType } from "../types/Case";

import type { AnsweredForm, Case } from "../types/Case";

const {
  ACTIVE_SIGNATURE_PENDING,
  ACTIVE_ONGOING,
  ACTIVE_ONGOING_NEW_APPLICATION,
} = ApplicationStatusType;

export function canCaseBeRemoved(caseData: Case): boolean {
  return [
    ACTIVE_SIGNATURE_PENDING,
    ACTIVE_ONGOING,
    ACTIVE_ONGOING_NEW_APPLICATION,
  ].includes(caseData.status.type);
}

export function shouldCaseEnterPin(caseData: Case): boolean {
  const currentForm: AnsweredForm = caseData.forms[caseData.currentFormId];
  const isEncrypted = answersAreEncrypted(currentForm.answers);

  const isValidStatus = [
    ACTIVE_SIGNATURE_PENDING,
    ACTIVE_ONGOING,
    ACTIVE_ONGOING_NEW_APPLICATION,
  ].includes(caseData.status.type);

  return isEncrypted && isValidStatus;
}
