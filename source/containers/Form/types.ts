export const enum UPDATE_CASE_STATE {
  IDLE = "idle",
  UPDATING = "updating",
  ERROR = "error",
}

export interface DialogText {
  title: string;
  body: string;
}
