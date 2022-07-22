export interface CollectResponse {
  attributes: { status: string };
  hintCode: string;
}

export interface AuthResponse {
  attributes: { orderRef: string; autoStartToken: string };
}
