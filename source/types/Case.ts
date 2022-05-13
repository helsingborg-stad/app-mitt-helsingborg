import { EncryptionDetails } from "./Encryption";

export enum ApplicationStatusType {
  ACTIVE_ONGOING = "active:ongoing",
  ACTIVE_SIGNATURE_COMPLETED = "active:signature:completed",
  ACTIVE_SIGNATURE_PENDING = "active:signature:pending",
  ACTIVE_COMPLETION_SUBMITTED = "active:completion:submitted",
  CLOSED = "closed",
  SIGNED = "signed",
  ACTIVE = "active",
  NOT_STARTED = "notStarted",
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA = "active:randomCheckRequired:viva",
  ACTIVE_ONGOING_RANDOM_CHECK = "active:ongoing:randomCheck",
  ACTIVE_COMPLETION_REQUIRED_VIVA = "active:completionRequired:viva",
  ACTIVE_ONGOING_COMPLETION = "active:ongoing:completion",
  CLOSED_PARTIALLY_APPROVED_VIVA = "closed:partiallyApproved:viva",
  CLOSED_REJECTED_VIVA = "closed:rejected:viva",
  NEW_APPLICATION = "newApplication",
  ACTIVE_ONGOING_NEW_APPLICATION = "active:ongoing:newApplication",
  ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA = "active:submitted:randomCheck:viva",
  ACTIVE_SUBMITTED_COMPLETION = "active:submitted:completion",
}

export type PersonRole = "applicant" | "coApplicant" | "children";
export type PossiblyEncryptedAnswers = Answer[] | EncryptedAnswersWrapper;

export interface Administrator {
  email: string;
  name: string;
  phone?: string;
  title: string;
}

export interface RequestedCompletions {
  description: string;
  received: boolean;
}

export interface Completions {
  requested: RequestedCompletions[];
  attachmentUploaded: string[];
  randomCheck: boolean;
  completed: boolean;
  dueDate: number;
}

export interface Period {
  endDate: number;
  startDate: number;
}

export interface Application {
  periodstartdate: string;
}

export interface Calculation {
  periodstartdate: string;
  periodenddate: string;
  incomesum: string;
  costsum: string;
  normsubtotal: string;
  reductionsum: string;
  calculationsum: string;
}

export interface Note {
  label: string;
  text: string;
}
export interface Journal {
  journal: {
    notes: {
      note: Note[];
    };
  };
}

export interface Decision {
  decisions: {
    decision: Record<string, string>;
  };
}

export interface Workflow {
  application: Application;
  calculations: Record<string, Calculation>;
  journals: Journal;
  decision: Decision;
}

export interface VIVACaseDetails {
  administrators: Administrator[];
  completions: Completions;
  period: Period;
  workflowId: string;
  workflow: Workflow;
}

export interface AnswerField {
  id: string;
  tags?: string[];
}

export interface Answer {
  field: AnswerField;
  value: string | boolean;
}

export interface EncryptedAnswersWrapper {
  encryptedAnswers: string;
}

export interface FormPosition {
  currentMainStep: number;
  currentMainStepIndex: number;
  index: number;
  level: number;
}

export interface AnsweredForm {
  answers: PossiblyEncryptedAnswers;
  currentPosition: FormPosition;
  encryption: EncryptionDetails;
}

export interface Person {
  firstName: string;
  hasSigned?: boolean;
  lastName: string;
  personalNumber: string;
  role: PersonRole;
}

export interface Status {
  description: string;
  name: string;
  type: ApplicationStatusType;
}

export interface Case {
  createdAt: number;
  currentFormId: string;
  details: VIVACaseDetails;
  expirationTime: number;
  forms: {
    [formId: string]: AnsweredForm;
  };
  id: string;
  pdf?: Buffer;
  pdfGenerated?: boolean;
  persons: Person[];
  PK: string;
  SK: string;
  GSI1?: string;
  provider: string;
  status: Status;
  updatedAt: number;
}
