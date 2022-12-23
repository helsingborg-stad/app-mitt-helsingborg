import type { PrimaryColor } from "../../../theme/themeHelpers";
import type { InputType } from "../../atoms/Input/Input";
import type { Help } from "../../../types/FormTypes";

export interface SummaryListItem {
  title: string;
  id: string;
  type:
    | "number"
    | "text"
    | "date"
    | "checkbox"
    | "arrayNumber"
    | "arrayText"
    | "arrayDate"
    | "editableListText"
    | "editableListNumber"
    | "editableListDate"
    | "spacer";
  category?: string;
  inputId?: string;
  inputSelectValue?: InputType;
  fieldStyle?: string;
}

export interface SummaryListCategory {
  category: string;
  description: string;
  sortField?: string;
}

export interface Props {
  heading: string;
  items: SummaryListItem[];
  categories?: SummaryListCategory[];
  onChange: (
    answers: Record<string, any> | string | number | boolean,
    fieldId: string
  ) => void;
  onBlur: (
    answers: Record<string, any> | string | number | boolean,
    fieldId: string
  ) => void;
  colorSchema: PrimaryColor;
  answers: Record<string, any>;
  validationErrors?: Record<
    string,
    | { isValid: boolean; message: string }
    | Record<string, { isValid: boolean; message: string }>[]
  >;
  showSum: boolean;
  startEditable?: boolean;
  help?: Help;
  editable?: boolean;
}

export type Answer = {
  otherassetDescription?: string;
  text?: string;
  description?: string;
} & Record<string, string | boolean | number>;

export interface List {
  items: SummaryListItem[];
  answers: Answer[] | string | number | boolean;
}

export type Item = {
  item: SummaryListItem;
  value?: string | boolean | number;
  index: number;
  otherassetDescription?: string;
  text?: string;
  description?: string;
} & Record<string, unknown>;
