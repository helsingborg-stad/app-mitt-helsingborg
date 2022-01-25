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

  if (response.status !== 200) {
    return {
      // NOTE: we assume things are kind of great when AWS doesnt respond nice...
      status: VERSION_STATUS.UPDATE_OPTIONAL,
      updateUrl: "",
    };
  }

  return response?.data?.data || {};
};

export default getApplicationVersionStatus;
