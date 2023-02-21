import { ServiceLocator } from "../serviceLocator";
import { isRequestError } from "../../helpers/ApiRequest";
import type {
  StatusPart,
  VivaStatusApiResponse,
  VivaStatusService,
} from "./vivaStatusService.types";
import type { AsyncState } from "../asyncService/asyncService.types";

export default class DefaultVivaStatusService implements VivaStatusService {
  state: AsyncState = "idle";

  error: Error | null = null;

  code = -1;

  parts: StatusPart[] = [];

  async fetch(): Promise<void> {
    const apiService = ServiceLocator.getInstance().get("api");

    this.state = "loading";

    const response = await apiService.get<VivaStatusApiResponse>(
      "/viva-status"
    );

    if (isRequestError(response)) {
      console.error(`VivaStatusService fetch error:`, response);
      this.error = new Error(response.message);
      this.state = "error";
      return;
    }

    this.error = null;

    const { code, parts } = response.data.data;
    this.code = code;
    this.parts = parts;
    this.state = "loaded";
  }
}
