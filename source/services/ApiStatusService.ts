import { get } from "../helpers/ApiRequest";

const getApiStatus = async (): Promise<string> => {
  const response = await get("/status");

  if (response.status !== 200) {
    return "Just nu har vi tekniska problem i appen. Vi jobbar på att lösa dessa. Kom tillbaka om en liten stund och testa igen.";
  }

  return response?.data?.data?.attributes?.message || "";
};

export default getApiStatus;
