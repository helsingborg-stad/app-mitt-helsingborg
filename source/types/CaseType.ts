export interface Case {
  createdAt: number;
  updatedAt: number;
  currentStep: number;
  data: Record<string, any>;
  formId: string;
  id: string;
  type: string;
  personalNumber: string;
  status: 'ongoing' | 'submitted'; // do we have/need other statuses?
}
