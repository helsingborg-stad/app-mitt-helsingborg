export interface Case {
    createdAt: string;
    updatedAt: string;
    currentStep: number;
    data: Record<string, any>;
    formId: string;
    id: string;
    type: string;
    personalNumber: string;
    status: 'ongoing' | 'submitted'; // do we have/need other statuses?
}