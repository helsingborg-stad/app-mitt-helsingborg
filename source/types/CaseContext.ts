import { UserInterface } from "../services/encryption/CaseEncryptionHelper";
import { FormPosition, Case, AnsweredForm } from "./Case";
import { EncryptionDetails } from "./Encryption";
import { Form, Question } from "./FormTypes";

export enum ActionTypes {
  UPDATE_CASE = "UPDATE_CASE",
  CREATE_CASE = "CREATE_CASE",
  DELETE_CASE = "DELETE_CASE",
  FETCH_CASES = "FETCH_CASES",
  API_ERROR = "API_ERROR",
  RESET = "RESET",
}

export interface State {
  cases: Record<string, Case>;
  error?: unknown;
  getCase: (caseId: string) => Case | undefined;
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

export interface UpdateCaseBody extends AnsweredForm {
  currentFormId: string;
  signature?: Signature;
}

export interface Dispatch {
  createCase?: (form: Form, callback: (newCase: Case) => void) => void;
  updateCase: (
    updateData: CaseUpdate,
    callback: (updatedCase: Case) => Promise<void>
  ) => Promise<Action>;
  deleteCase?: (caseId: string) => void;
  providePinForCase: (caseData: Case, pin: string) => Promise<void>;
}

export interface Action {
  type: ActionTypes;
  payload?: Case | Record<string, Case> | Case[] | string | boolean | Error;
}
