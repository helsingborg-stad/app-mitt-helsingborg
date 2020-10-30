export type ValidatorMethod =
  | 'isEmpty'
  | 'isEmail'
  | 'isUrl'
  | 'isPostalCode'
  | 'isNumeric'
  | 'isAfter'
  | 'isBefore'
  | 'isBoolean'
  | 'isMobilePhone'
  | 'isPhone'
  | 'isLength'
  | 'isInt';

export interface ValidationRule {
  method: ValidatorMethod;
  validWhen: boolean;
  args?: {
    options?: Record<string, string | boolean | number>;
    locale?: string;
  };
  message: string;
}

export interface ValidationObject {
  isRequired: boolean;
  rules: ValidationRule[];
}
