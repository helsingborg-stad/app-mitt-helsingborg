export interface InputField {
  testId: string;
  label: string;
  placeholder?: string;
  keyboardType?: string;
  value: string;
  maxLength?: number;
  onChange: (value: string) => void;
}

export interface Props {
  fields: InputField[];
}
