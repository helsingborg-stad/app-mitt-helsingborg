import { ApiRequest } from "../../../../helpers";
import { isRequestError } from "../../../../helpers/ApiRequest";
import type { RemoteUtil } from "../FileStorageService.types";

const apiRemoteUtil: RemoteUtil = {
  async getDownloadUrl(id) {
    const result = await ApiRequest.get<{ fileUrl: string }>(
      `users/me/attachments/${id}`
    );

    if (isRequestError(result)) {
      throw new Error(result.message);
    }

    return result.data.data.fileUrl;
  },
};

export default apiRemoteUtil;
