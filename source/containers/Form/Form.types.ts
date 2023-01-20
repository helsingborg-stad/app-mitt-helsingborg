import type {
  StepperActions,
  Action,
  Step as StepType,
} from "../../types/FormTypes";
import type { Status, Answer, VIVACaseDetails, Person } from "../../types/Case";
import type { User } from "../../types/UserTypes";
import type { FormPosition, FormPeriod } from "./hooks/useForm";

export const enum UPDATE_CASE_STATE {
  IDLE = "idle",
  UPDATING = "updating",
  ERROR = "error",
}

export interface DialogText {
  title: string;
  body: string;
}

export interface FormProps {
  initialPosition?: FormPosition;
  steps: StepType[];
  connectivityMatrix: StepperActions[][];
  user: User;
  initialAnswers: Record<string, unknown>;
  status: Status;
  onClose: () => void;
  onSubmit: () => void;
  onUpdateCase: (
    data: Record<string, Answer>,
    signature: { success: boolean } | undefined,
    currentPosition: FormPosition
  ) => Promise<Action | void>;
  period?: FormPeriod;
  editable: boolean;
  details: VIVACaseDetails;
  persons: Person[];
  encryptionPin: string;
  completionsClarificationMessage: string;
}
