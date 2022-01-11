import { UserInterface } from "../services/encryption/EncryptionHelper";
import { FormPosition, Case, AnsweredForm } from "./Case";
import { EncryptionDetails } from "./Encryption";
import { Form, Question } from "./FormTypes";

export enum ActionTypes {
  UPDATE_CASE = "UPDATE_CASE",
  CREATE_CASE = "CREATE_CASE",
  DELETE_CASE = "DELETE_CASE",
  FETCH_CASES = "FETCH_CASES",
  POLL_CASE = "POLL_CASE",
  API_ERROR = "API_ERROR",
  SET_POLLING_CASES = "SET_POLLING_CASES",
  SET_POLLING_DONE = "SET_POLLING_DONE",
}

export interface State {
  cases: Record<string, Case>;
  error?: unknown;
  isPolling: boolean;
  casesToPoll: Case[];
  getCase: (caseId: string) => Case | undefined;
  getCasesByFormIds?: (formIds: string[]) => Case[];
  fetchCases?: () => Promise<void>;
}

export interface Answer {
  fieldId: string;
  value?: unknown;
}

export interface Signature {
  success: boolean;
}

export interface CaseUpdate {
  user: UserInterface;
  caseId: string;
  formId: string;
  answerObject: Record<string, Answer>;
  signature: Signature;
  currentPosition: FormPosition;
  formQuestions: Question[];
  encryptAnswers: boolean;
  encryption: EncryptionDetails;
}

export interface PolledCaseResult {
  case: Case;
  synced: boolean;
}

export interface UpdateCaseBody extends AnsweredForm {
  currentFormId: string;
  signature?: Signature;
}

export interface Dispatch {
  createCase?: (form: Form, callback: (newCase: Case) => void) => void;
  updateCase: (
    updateData: CaseUpdate,
    callback: (updatedCase: Case) => void
  ) => void;
  deleteCase?: (caseId: string) => void;
}

export interface Action {
  type: ActionTypes;
  payload?:
    | Case
    | Record<string, Case>
    | Case[]
    | PolledCaseResult
    | string
    | Error;
}
