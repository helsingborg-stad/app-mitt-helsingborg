import { get } from "../helpers/ApiRequest";

import VERSION_STATUS from "../types/VersionStatusTypes";

import type {
  GetApplicationVersionStatus,
  GetApplicationVersionStatusResponse,
} from "./ApplicationVersionService.types";

const defaultResponse = {
  status: VERSION_STATUS.UPDATE_OPTIONAL,
  updateUrl: "",
};

const getApplicationVersionStatus =
  async (): Promise<GetApplicationVersionStatus> => {
    const response = await get<GetApplicationVersionStatusResponse>("/version");

    if (response.status !== 200) {
      console.error("Failed fetching application version status");
      return defaultResponse;
    }

    return response?.data?.data?.attributes || defaultResponse;
  };

export default getApplicationVersionStatus;
