import { ApiRequest } from "../../helpers";
import { isRequestError } from "../../helpers/ApiRequest";
import type {
  VivaPeriodApiResponse,
  VivaPeriodService,
} from "./vivaPeriodService.types";

const vivaPeriodService: VivaPeriodService = {
  async getStatusMessage() {
    const response = await ApiRequest.get<VivaPeriodApiResponse>(
      "viva/period/status"
    );

    if (isRequestError(response)) {
      throw new Error(response.message);
    }

    return response.data.data.message;
  },
};

export default vivaPeriodService;
