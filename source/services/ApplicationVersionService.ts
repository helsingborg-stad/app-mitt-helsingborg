import { get } from "../helpers/ApiRequest";

import VERSION_STATUS from "../types/VersionStatusTypes";

const getApplicationVersionStatus = async (): Promise<
  | {
      status: VERSION_STATUS;
      updateUrl: string;
    }
  | Record<string, unknown>
> => {
  const response = await get("/version");

  console.log("VERSION RESPONSE: ", response);
  if (response.status !== 200) {
    return {};
  }

  return response?.data?.data || {};
};

export default getApplicationVersionStatus;
