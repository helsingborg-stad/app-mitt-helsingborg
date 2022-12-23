import type { PrimaryColor } from "../../../theme/themeHelpers";

import type { Input, Answer } from "./EditableList.types";

export interface Props {
  input: Input;
  colorSchema: PrimaryColor;
  editable: boolean;
  value: Answer;
  state: Answer;
  onChange: (key: string, text: string | number) => void;
  onInputBlur: () => void;
  onInputFocus: (event: unknown, isSelect: boolean) => void;
  onClose: (event: unknown, isSelect: boolean) => void;
}
