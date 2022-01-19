import { get } from "../helpers/ApiRequest";

const getApiStatus = async (): Promise<string> => {
  const response = await get("/status");

  if (response.status !== 200) {
    return "Tjänsten är för nuvarande otillgänglig. Försök igen senare.";
  }

  return response?.data?.data?.attributes?.message || "";
};

export default getApiStatus;
