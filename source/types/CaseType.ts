export type CaseStatus = 'ongoing' | 'submitted';
export interface Case {
  createdAt: number;
  updatedAt: number;
  currentStep: number;
  data: Record<string, any>;
  formId: string;
  id: string;
  type: string;
  personalNumber: string;
  status: CaseStatus; // do we have/need other statuses?
}
