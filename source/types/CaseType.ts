export type CaseStatus = 'ongoing' | 'submitted';

interface CaseWithoutAnswers {
  createdAt: number;
  updatedAt: number;
  currentStep: number;
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
