import type { PrimaryColor } from "../../../theme/themeHelpers";

export interface Props {
  currentStep: number;
  totalStepNumber: number;
  rounded?: boolean;
  colorSchema?: PrimaryColor;
}
