import { get } from "../helpers/ApiRequest";

const getApplicationVersionStatus = async (): Promise<string> => {
  const response = await get("/version");

  return response?.data?.data?.versionStatus || "";
};

export default getApplicationVersionStatus;
