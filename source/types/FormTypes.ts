import { PrimaryColor } from "../styles/themeHelpers";
import { ValidationObject } from "./Validation";

export interface Help {
  text?: string;
  heading?: string;
  tagline?: string;
  url?: string;
}
export interface SummaryItem {
  category: string;
  title: string;
  id: string;
  type:
    | "text"
    | "arrayText"
    | "number"
    | "arrayNumber"
    | "date"
    | "arrayDate"
    | "checkbox";
  loadPrevious?: string[];
  validation?: ValidationObject;
}
export interface ListInput {
  type: "text" | "number" | "date";
  key: string;
  id?: string;
  label: string;
  loadPrevious?: string[];
  validation?: ValidationObject;
}

/** Different types for the Input component, corresponding to different keyboard types */
export type InputFieldType =
  | "text"
  | "email"
  | "postalCode"
  | "personalNumber"
  | "phone"
  | "number"
  | "hidden"
  | "date"
  | "card"
  | "editableList"
  | "fileUploaderList"
  | "checkbox"
  | "navigationButtonGroup"
  | "summaryList"
  | "repeaterField"
  | "imageUploader"
  | "imageViewer"
  | "pdfUploader"
  | "pdfViewer"
  | "filePicker"
  | "fileViewer";

export type FormInputType =
  | "text"
  | "number"
  | "hidden"
  | "date"
  | "editableList"
  | "fileUploaderList"
  | "checkbox"
  | "summaryList"
  | "repeaterField"
  | "imageUploader"
  | "bulletList";

export interface Question {
  label: string;
  type: FormInputType;
  id: string;
  description?: string;
  conditionalOn?: string;
  placeholder?: string;
  explainer?: string;
  loadPrevious?: string[];
  items?: SummaryItem[];
  inputs?: ListInput[];
  validation?: ValidationObject;
  help?: Help;
  choices?: { value: string; displayText: string }[];
  text?: string;
  labelLine?: boolean;
  categories?: { category: string; description: string }[];
  components?: Components[];
}

export type ActionType =
  | "start"
  | "next"
  | "submit"
  | "sign"
  | "close"
  | "backToMain"
  | "backToMainAndNext";
export interface Action {
  type: ActionType;
  label: string;
  color?: string;
  hasCondition?: boolean;
  conditionalOn?: string;
  signMessage?: string;
}

export interface Components {
  type: string;
  text: string;
  italic?: boolean;
  closeButtonText?: string;
  heading: string;
  markdownText?: string;
}

export interface Banner {
  iconSrc?: string;
  imageSrc?: string;
  backgroundColor?: string;
}

export type StepperActions = "next" | "back" | "up" | "down" | "none";

export interface Step {
  title: string;
  description: string;
  id?: string;
  group: string;
  questions?: Question[];
  actions?: Action[];
  banner?: Banner;
  colorSchema: PrimaryColor | "";
}

export interface StepStructure {
  id: string;
  text: string;
  children: StepStructure[];
  group: string;
}

export interface Form {
  name: string;
  description: string;
  steps: Step[];
  connectivityMatrix: StepperActions[][];
  id: string;
  updatedAt: number;
  formType?: string;
  provider?: string;
  subform?: boolean;
  stepStructure: StepStructure[];
}
