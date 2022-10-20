import type { Props as Button } from "../NavigationButtonField/NavigationButtonField.types";
import type { PrimaryColor } from "../../../theme/themeHelpers";

interface FormNavigation {
  next: () => void;
  back: () => void;
  down: (targetStepId: string) => void;
  up: () => void;
}

export interface Props {
  buttons: Button[];
  horizontal: boolean;
  formNavigation: FormNavigation;
  colorSchema?: PrimaryColor;
}
