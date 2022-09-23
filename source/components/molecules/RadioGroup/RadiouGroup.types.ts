export interface ErrorValidation {
  isValid: boolean;
  message: string;
}

export interface Props {
  choices: { displayText: string; value: string }[];
  value?: string;
  onSelect: (value: string) => void;
  colorSchema?: string;
  size?: "small" | "medium" | "large";
  error?: ErrorValidation;
}
