import type { Case } from "../types/Case";
import { ApplicationStatusType } from "../types/Case";

const {
  ACTIVE_SIGNATURE_PENDING,
  ACTIVE_ONGOING,
  ACTIVE_ONGOING_NEW_APPLICATION,
} = ApplicationStatusType;

// eslint-disable-next-line import/prefer-default-export
export function canCaseBeRemoved(caseData: Case): boolean {
  return [
    ACTIVE_SIGNATURE_PENDING,
    ACTIVE_ONGOING,
    ACTIVE_ONGOING_NEW_APPLICATION,
  ].includes(caseData.status.type);
}
