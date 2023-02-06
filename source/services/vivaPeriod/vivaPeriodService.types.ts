export interface VivaPeriodService {
  getStatusMessage(): Promise<string | null>;
}

export interface VivaPeriodApiResponse {
  message: string | null;
}
