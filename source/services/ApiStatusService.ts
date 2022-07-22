import { get } from "../helpers/ApiRequest";

import type { ApiStatusResponse } from "./ApiStatusService.types";

const getApiStatus = async (): Promise<string> => {
  const response = await get<ApiStatusResponse>("/status");

  if (response.status !== 200) {
    return "Tjänsten är för närvarande otillgänglig. Försök igen senare.";
  }

  return response?.data?.data?.message || "";
};

export default getApiStatus;
