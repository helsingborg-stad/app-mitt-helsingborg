import type { File } from "../components/molecules/FilePicker/FilePicker.types";
import type { EncryptionDetails } from "./Encryption";

export enum ApplicationStatusType {
  ACTIVE_ONGOING = "active:ongoing",
  ACTIVE_SIGNATURE_COMPLETED = "active:signature:completed",
  ACTIVE_SIGNATURE_PENDING = "active:signature:pending",
  CLOSED = "closed",
  SIGNED = "signed",
  ACTIVE = "active",
  NOT_STARTED = "notStarted",
  APPROVED = "approved",
  ACTIVE_RANDOM_CHECK_REQUIRED_VIVA = "active:randomCheckRequired:viva",
  ACTIVE_ONGOING_RANDOM_CHECK = "active:ongoing:randomCheck",
  ACTIVE_COMPLETION_REQUIRED_VIVA = "active:completionRequired:viva",
  ACTIVE_ONGOING_COMPLETION = "active:ongoing:completion",
  CLOSED_PARTIALLY_APPROVED_VIVA = "closed:partiallyApproved:viva",
  CLOSED_REJECTED_VIVA = "closed:rejected:viva",
  NEW_APPLICATION = "newApplication:viva",
  ACTIVE_ONGOING_NEW_APPLICATION = "active:ongoing:newApplication",
  ACTIVE_SUBMITTED_RANDOM_CHECK_VIVA = "active:submitted:randomCheck:viva",
  ACTIVE_SUBMITTED_COMPLETION = "active:submitted:completion:viva",
}

type PersonRole = "applicant" | "coApplicant" | "children";
export type PossiblyEncryptedAnswers = Answer[] | EncryptedAnswersWrapper;

interface Administrator {
  email: string;
  name: string;
  phone?: string;
  title: string;
}

export interface RequestedCompletions {
  readonly description: string;
  readonly received: boolean;
}

interface Completions {
  readonly requested: RequestedCompletions[];
  readonly description: string;
  readonly attachmentUploaded: string[];
  readonly randomCheck: boolean;
  readonly completed: boolean;
  readonly dueDate: number;
}

export interface Period {
  endDate: number;
  startDate: number;
}

interface Application {
  periodstartdate: string;
}

interface CalculationNormpart {
  type: string;
  amount: string;
}

interface CalculationNorm {
  normpart: CalculationNormpart[];
}

interface CalculationPerson {
  name: string | null;
  pnumber: string | null;
  norm: string | null;
  days: string | null;
  home: string | null;
  daycare: string | null;
}

interface CalculationPersons {
  calculationperson: CalculationPerson[] | CalculationPerson;
}

interface Cost {
  type: string | null;
  actual: string | null;
  approved: string | null;
  note: string | null;
}

interface Costs {
  cost: Cost | Cost[];
}

interface Income {
  type: string;
  amount: string;
  note: Note;
}

interface Incomes {
  income: Income | Income[];
}

interface Reduction {
  type: string;
  days: string;
  note: Note;
  amount: string;
}

interface Reductions {
  reduction: Reduction | Reduction[];
}

export interface Calculation {
  periodstartdate: string;
  periodenddate: string;
  incomesum: string;
  costsum: string;
  normsubtotal: string;
  reductionsum: string;
  calculationsum: string;
  norm: CalculationNorm;
  calculationpersons: CalculationPersons;
  costs: Costs;
  incomes: Incomes;
  reductions: Reductions;
}

export interface Calculations {
  calculation: Calculation;
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
  calculations: Calculations;
  journals: Journal;
  decision: Decision;
}

export interface VIVACaseDetails {
  administrators: Administrator[];
  readonly completions: Completions;
  period: Period;
  workflowId: string;
  workflow: Workflow;
}

interface AnswerField {
  id: string;
  tags?: string[];
}

export interface Answer {
  field: AnswerField;
  value: string | boolean | File[];
}

export interface EncryptedAnswersWrapper {
  encryptedAnswers: string;
}

export interface FormPosition {
  currentMainStep: number;
  currentMainStepIndex: number;
  index: number;
  level: number;
  numberOfMainSteps: number;
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
  detailedDescription?: string;
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
