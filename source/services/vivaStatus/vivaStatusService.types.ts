import type { AsyncService } from "../asyncService/asyncService.types";

export interface StatusPart {
  code: number;
  message: string;
}

export interface VivaStatusService extends AsyncService {
  fetch(): Promise<void>;
  code: number;
  parts: StatusPart[];
}

export interface VivaStatusApiResponse {
  code: number;
  parts: StatusPart[];
}
