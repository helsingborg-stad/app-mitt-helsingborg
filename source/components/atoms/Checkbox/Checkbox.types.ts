import type { PrimaryColor } from "../../../theme/themeHelpers";

type Size = "small" | "medium" | "large";

export interface Props {
  checked?: boolean;
  onChange: () => void;
  disabled?: boolean;
  invertColors?: boolean;
  size?: Size;
  colorSchema: PrimaryColor;
}
