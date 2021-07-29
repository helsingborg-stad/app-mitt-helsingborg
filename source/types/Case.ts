import { EncryptionDetails } from "./Encryption";

export type ApplicationStatusType =
  /** Application has been started by applicant, with possibly partial (and encrypted) answers. */
  | "active:ongoing"
  /** Application has been received by the provider and is being processed by a case worker. */
  | "active:processing"
  /** Application is fully signed by all applicant and is ready to send in. */
  | "active:signature:completed"
  /** Application is not fully signed. One or more applicants need to sign this application. */
  | "active:signature:pending"
  /** Application has been submitted to the provider and is awaiting processing. */
  | "active:submitted"
  /** Application is closed. */
  | "closed"
  /** Application has not yet been started by the applicant. */
  | "notStarted"

  /** VIVA */
  /** Application has been sent to VIVA and is awaiting action from a case worker. */
  | "active:submitted:viva"
  /** Completion ("stickprovskontroll") is required. */
  | "active:completionRequired:viva"
  /** Application is fully approved. Calculation/payment info is available. */
  | "closed:approved:viva"
  /** Completion ("stickprovskontroll") has been rejected. */
  | "closed:completionRejected:viva"
  /** Application is partially approved. Calcuation/payment info is available. */
  | "closed:partiallyApproved:viva"
  /** Application has been processed by a case worker and has been rejected. Rejection info is available. */
  | "closed:rejected:viva"
  /** Application has not yet been started by the applicant (VIVA-specific). */
  | "notStarted:viva";

/**
 * Possible roles for a person on a case.
 */
export type PersonRole = "applicant" | "coApplicant" | "children";

/**
 * Administrator (case worker).
 */
export interface Administrator {
  email: string;
  name: string;
  phone?: string;
  title: string;
}

/**
 * Represents a time period (with a start and end timestamp).
 */
export interface Period {
  /**
   * Unix timestamp in milliseconds for when this period ends.
   */
  endDate: number;

  /**
   * Unix timestamp in milliseconds for when this period starts.
   */
  startDate: number;
}

/**
 * Details of a case as retrieved from VIVA.
 */
export interface VIVACaseDetails {
  /**
   * List of case workers associated with this case.
   */
  administrators: Administrator[];

  /**
   * The period this case pertains to.
   */
  period: Period;

  /**
   * Unique ID associated with this case in VIVA.
   */
  workflowId: string;
}

export interface AnswerField {
  /**
   * Unique ID for this field in the form.
   */
  id: string;

  /**
   * List of tags with generic use.
   *
   * For VIVA this is used to connect and transform answers to VIVA properties in VADA.
   */
  tags: string[];
}

export interface Answer {
  /**
   * Details of the field for this answer.
   */
  field: AnswerField;

  /**
   * The actual value of this answer.
   */
  value: string | boolean;
}

export interface EncryptedAnswersWrapper {
  /**
   * Encrypted string output of the answers object.
   */
  encryptedAnswers: string;
}

export interface FormPosition {
  currentMainStep: number;
  currentMainStepIndex: number;
  index: number;
  level: number;
}

export interface AnsweredForm {
  /**
   * Answers for this form.
   *
   * If encrypted then this is an object, otherwise this is an array.
   */
  answers: Answer[] | EncryptedAnswersWrapper;

  /**
   * Last saved position of this form. Used to return to the same page when resuming a form.
   */
  currentPosition: FormPosition;

  /**
   * Details of the encryption used for this form.
   *
   * If unencrypted, `encryption.type` is set to `decrypted`.
   */
  encryption: EncryptionDetails;
}

export interface Person {
  /**
   * First name of this person.
   */
  firstName: string;

  /**
   * `true` if this person has signed the case, or `false` if they have yet to sign.
   */
  hasSigned?: boolean;

  /**
   * Last name of this person.
   */
  lastName: string;

  /**
   * Swedish personal identity number (personnummer) of this person.
   */
  personalNumber: string;

  /**
   * Role of this person in relation to the case.
   */
  role: PersonRole;
}

export interface Status {
  /**
   * User-friendly description of this status.
   */
  description: string;

  /**
   * User-friendly name of this status.
   */
  name: string;

  /**
   * Unique identifier of this status.
   */
  type: ApplicationStatusType;
}

export interface Case {
  /**
   * Unix timestamp in milliseconds for when this case object was first created.
   */
  createdAt: number;

  /**
   * Form UUID for the currently active form in `forms`.
   */
  currentFormId: string;

  /**
   * 3rd party provider details for this case.
   */
  details: VIVACaseDetails;

  /**
   * Unix timestamp in seconds for when this case expires and will be removed from the database.
   */
  expirationTime: number;

  /**
   * Map of forms connected to this case.
   */
  forms: {
    [formId: string]: AnsweredForm;
  };

  /**
   * UUID of this case.
   */
  id: string;

  /**
   * Binary PDF data of the PDF generated from this case.
   */
  pdf?: Buffer;

  /**
   * `true` if pdf has been generated.
   */
  pdfGenerated?: boolean;

  /**
   * List of persons connected to this case.
   */
  persons: Person[];

  /**
   * Primary key; usually "USER#[applicant pno]"
   */
  PK: string;

  /**
   * Secondary key; usually "CASE#[case id]"
   */
  SK: string;

  /**
   * First Global Secondary Index; usually "USER#[co-applicant pno]" when co-applicant is available.
   */
  GSI1?: string;

  /**
   * 3rd party provider linked to this case.
   */
  provider: string;

  /**
   * Current status of this case.
   */
  status: Status;

  /**
   * Unix timestamp in milliseconds for when this case object was last updated.
   */
  updatedAt: number;
}
