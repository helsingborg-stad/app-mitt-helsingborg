import type { PrimaryColor } from "../../../theme/themeHelpers";

export interface Props {
  authenticateOnExternalDevice: boolean;
  colorSchema?: PrimaryColor;
  isLoading?: boolean;
  isResolved?: boolean;
  cancelSignIn: () => void;
}
