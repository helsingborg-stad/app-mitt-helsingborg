import type { FormPosition } from '../containers/Form/hooks/useForm';

export type CaseStatus = {
  type: string;
  name: string;
  description: string;
};

interface CaseWithoutAnswers {
  createdAt: number;
  updatedAt: number;
  currentStep: FormPosition;
  formId: string;
  id: string;
  type: string;
  personalNumber: string;
  status: CaseStatus;
}

export interface Case extends CaseWithoutAnswers {
  answers: Record<string, any>;
}

export interface CaseWithAnswerArray extends CaseWithoutAnswers {
  answers: Record<string, any>[];
}
