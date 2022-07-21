import type { AddCoApplicantParameters } from "../../../types/CaseContext";

export interface Props {
  visible: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onAddCoApplicant: (parameters: AddCoApplicantParameters) => Promise<void>;
}

export enum InputField {
  personalNumber = "personalNumber",
  fistName = "firstName",
  lastName = "lastName",
}
