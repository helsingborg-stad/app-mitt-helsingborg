import type { Case } from "../../types/Case";

export interface CasesResponse {
  attributes: {
    cases: Case[];
  };
}

export interface UpdateCaseResponse {
  attributes: Case;
}
