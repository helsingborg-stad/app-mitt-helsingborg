export interface SummaryListItem {
  category: string;
  type: string;
  title: string;
  id: string;
  inputId?: string;
}
export interface RepeaterInputItems {
  title: string;
  type: string;
  id: string;
}
export interface ListInput {
  type: 'text' | 'number';
  key: string;
  label: string;
  loadPrevious?: string[];
}
export interface Question {
  label: string;
  type: string;
  id: string;
  description?: string;
  conditionalOn?: string;
  placeholder?: string;
  explainer?: string;
  loadPrevious?: string[];
  items?: SummaryListItem[];
  inputs?: ListInput[] | RepeaterInputItems[];
}

export interface Action {
  type: string;
  label: string;
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
}

export interface Form {
  name: string;
  description: string;
  steps?: Step[];
  connectivityMatrix: StepperActions[][];
  id: string;
  subform?: boolean;
  formType?: string;
  provider?: string;
}
