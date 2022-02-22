import { get } from "../helpers/ApiRequest";

import VERSION_STATUS from "../types/VersionStatusTypes";

const defaultResponse = {
  status: VERSION_STATUS.UPDATE_OPTIONAL,
  updateUrl: "",
};

interface GetApplicationVersionStatus {
  status: VERSION_STATUS;
  updateUrl: string;
}
const getApplicationVersionStatus =
  async (): Promise<GetApplicationVersionStatus> => {
    const response = await get("/version");

    if (response.status !== 200) {
      console.error("Failed fetching application version status");
      return defaultResponse;
    }

    return response?.data?.data?.attributes || defaultResponse;
  };

export default getApplicationVersionStatus;
