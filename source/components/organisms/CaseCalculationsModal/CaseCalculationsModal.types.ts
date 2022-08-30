import type { Calculation, Note } from "../../../types/Case";

interface Decision {
  explanation: string;
  type: string;
}

export interface Props {
  isVisible: boolean;
  decisions: Decision[];
  calculation: Calculation;
  notes: Note[];
  toggleModal: () => void;
}
