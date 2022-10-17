import type { PrimaryColor } from "../../../theme/themeHelpers";
import type { Help } from "../../../types/FormTypes";

export interface Props {
  legend: string;
  colorSchema?: PrimaryColor;
  empty?: boolean;
  help?: Help;
  renderHeaderActions?: () => void;
}
