import { get } from "../helpers/ApiRequest";

const getApiStatus = async (): Promise<string> => {
  const response = await get("/status");

  if (response.status !== 200) {
    return "Tjänsten är för närvarande otillgänglig. Försök igen senare.";
  }

  return response?.data?.data?.message || "";
};

export default getApiStatus;
