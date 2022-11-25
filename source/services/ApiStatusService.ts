import { get, isRequestError } from "../helpers/ApiRequest";
import type { Messages } from "../types/StatusMessages";

interface StatusMessagesResponse {
  messages: Messages[];
}

async function getApiStatus(): Promise<Messages[]> {
  const response = await get<StatusMessagesResponse>("/status/messages");

  if (isRequestError(response)) {
    throw new Error(response.message);
  }

  if (!response) {
    return [
      {
        message: {
          title: "Hoppsan!",
          text: "Tjänsten är för närvarande otillgänglig. Försök igen senare.",
        },
        type: "info",
      },
    ];
  }

  return response?.data?.data?.messages ?? [];
}

export default getApiStatus;
