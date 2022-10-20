type NavigationActionType =
  | "navigateDown"
  | "navigateUp"
  | "navigateNext"
  | "navigateBack";

interface NavigationAction {
  type: NavigationActionType;
  stepId: string;
}

interface FormNavigation {
  next: () => void;
  back: () => void;
  down: (targetStepId: string) => void;
  up: () => void;
  createSnapshot: () => void;
}

export interface Props {
  iconName?: string;
  text?: string;
  colorSchema?: string;
  navigationType: NavigationAction;
  formNavigation: FormNavigation;
}
