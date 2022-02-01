import { get } from "../helpers/ApiRequest";

import VERSION_STATUS from "../types/VersionStatusTypes";

interface GetApplicationVersionStatus {
  status: VERSION_STATUS;
  updateUrl: string;
}
const getApplicationVersionStatus = async (): Promise<
  GetApplicationVersionStatus | Record<string, unknown>
> => {
  const response = await get("/version");

  if (response.status !== 200) {
    return {
      status: VERSION_STATUS.UPDATE_OPTIONAL,
      updateUrl: "",
    };
  }

  return response?.data?.data.attributes || {};
};

export default getApplicationVersionStatus;
