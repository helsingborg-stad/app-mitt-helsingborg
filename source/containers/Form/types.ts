export const enum UPDATE_CASE_STATE {
  PENDING = "pending",
  UPDATING = "updating",
  ERROR = "error",
}

export interface DialogText {
  title: string;
  body: string;
}
