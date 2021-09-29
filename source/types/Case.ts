import { EncryptionDetails } from "./Encryption";

export enum ApplicationStatusType {
  ActiveOngoing = "active:ongoing",
  ActiveProcessing = "active:processing",
  ActiveSignatureCompleted = "active:signature:completed",
  ActiveSignaturePending = "active:signature:pending",
  ActiveSubmitted = "active:submitted",
  Closed = "closed",
  NotStarted = "notStarted",
  ActiveSubmittedViva = "active:submitted:viva",
  ActiveCompletionRequiredViva = "active:completionRequired:viva",
  ClosedApprovedViva = "closed:approved:viva",
  ClosedCompletionRejectedViva = "closed:completionRejected:viva",
  ClosedPartiallyApprovedViva = "closed:partiallyApproved:viva",
  ClosedRejectedViva = "closed:rejected:viva",
  NotStartedViva = "notStarted:viva",
}

export type PersonRole = "applicant" | "coApplicant" | "children";

export interface Administrator {
  email: string;
  name: string;
  phone?: string;
  title: string;
}

export interface Period {
  endDate: number;
  startDate: number;
}

export interface VIVACaseDetails {
  administrators: Administrator[];
  period: Period;
  workflowId: string;
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
  answers: Answer[] | EncryptedAnswersWrapper;
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
