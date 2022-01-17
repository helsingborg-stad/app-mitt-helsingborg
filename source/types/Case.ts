import { EncryptionDetails } from "./Encryption";

export enum ApplicationStatusType {
  ONGOING = "ongoing",
  ACTIVE_ONGOING = "active:ongoing",
  ACTIVE_PROCESSING = "active:processing",
  ACTIVE_SIGNATURE_COMPLETED = "active:signature:completed",
  ACTIVE_SIGNATURE_PENDING = "active:signature:pending",
  ACTIVE_SUBMITTED = "active:submitted",
  CLOSED = "closed",
  SIGNED = "signed",
  ACTIVE = "active",
  NOT_STARTED = "notStarted",
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA = "active:randomCheckRequired:viva",
  ACTIVE_COMPLETION_REQUIRED_VIVA = "active:completionRequired:viva",
  CLOSED_APPROVED_VIVA = "closed:approved:viva",
  CLOSED_COMPLETION_REJECTED_VIVA = "closed:completionRejected:viva",
  CLOSED_PARTIALLY_APPROVED_VIVA = "closed:partiallyApproved:viva",
  CLOSED_REJECTED_VIVA = "closed:rejected:viva",
  NOT_STARTED_VIVA = "notStarted:viva",
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
  randomCheck: boolean;
  completed: boolean;
}

export interface Period {
  endDate: number;
  startDate: number;
}

export interface Application {
  periodstartdate: string;
  completionduedate: string;
}

export interface Workflow {
  application: Application;
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
