import type VERSION_STATUS from "../types/VersionStatusTypes";

export interface GetApplicationVersionStatus {
  status: VERSION_STATUS;
  updateUrl: string;
}

export interface GetApplicationVersionStatusResponse {
  attributes: GetApplicationVersionStatus;
}
