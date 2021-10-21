import { UserInterface } from "../services/encryption/EncryptionHelper";
import { FormPosition, Case, AnsweredForm } from "./Case";
import { EncryptionDetails } from "./Encryption";
import { Form, Question } from "./FormTypes";

export interface Action {
  type: string;
  payload: Case | Record<string, Case> | string | Error;
}

export interface State {
  cases: Record<string, Case>;
  error?: unknown;
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

export interface ProvidedState extends State {
  getCase: (caseId: string) => Case | undefined;
  getCasesByFormIds: (formIds: string[]) => Case[];
  fetchCases: () => Promise<void>;
}

export interface Dispatch {
  createCase?: (form: Form, callback: (newCase: Case) => void) => void;
  updateCase?: (
    updateData: CaseUpdate,
    callback: (updatedCase: Case) => void
  ) => void;
  deleteCase?: (caseId: string) => void;
}
