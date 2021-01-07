import { PrimaryColor } from '../styles/themeHelpers';
import { ValidationObject } from './Validation';

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
  type: 'text' | 'arrayText' | 'number' | 'arrayNumber' | 'date' | 'arrayDate' | 'checkbox';
  loadPrevious?: string[];
  validation?: ValidationObject;
}
export interface ListInput {
  type: 'text' | 'number' | 'date';
  key: string;
  id?: string;
  label: string;
  loadPrevious?: string[];
  validation?: ValidationObject;
}

export type FormInputType =
  | 'text'
  | 'number'
  | 'date'
  | 'editableList'
  | 'checkbox'
  | 'summaryList'
  | 'repeaterField';

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
}

export type ActionType = 'start' | 'next' | 'submit' | 'sign' | 'close' | 'backToMain';
export interface Action {
  type: ActionType;
  label: string;
  color?: string;
  hasCondition?: boolean;
  conditionalOn?: string;
}

export interface Banner {
  iconSrc?: string;
  imageSrc?: string;
  backgroundColor?: string;
}

export type StepperActions = 'next' | 'back' | 'up' | 'down' | 'none';

export interface Step {
  title: string;
  description: string;
  id?: string;
  group: string;
  questions?: Question[];
  actions?: Action[];
  banner?: Banner;
  colorSchema: PrimaryColor | '';
}

export interface Form {
  name: string;
  description: string;
  steps: Step[];
  connectivityMatrix: StepperActions[][];
  id: string;
  formType?: string;
  provider?: string;
}
