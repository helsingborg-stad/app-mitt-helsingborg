import type { PrimaryColor } from "../../../theme/themeHelpers";

export type Size = "small" | "medium" | "large";

export interface Props {
  selected: boolean;
  colorSchema?: PrimaryColor;
  size?: Size;
  onSelect: () => void;
}
