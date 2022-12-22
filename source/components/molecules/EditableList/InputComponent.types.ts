import type { PrimaryColor } from "../../../theme/themeHelpers";

import type { Input, Answer } from "./EditableList.types";

export interface Props {
  input: Input;
  colorSchema: PrimaryColor;
  editable: boolean;
  value: Answer;
  state: Answer;
  onChange: (key: string, text: string) => void;
  onInputBlur: () => void;
  onInputFocus: () => void;
  onClose: () => void;
}

// onInputFocus={(event, isSelect: boolean) =>
//   onInputFocus(event, index, isSelect)
// }
// onClose={(isSelect: boolean) =>
//   onInputScrollTo(index, isSelect)
// }
