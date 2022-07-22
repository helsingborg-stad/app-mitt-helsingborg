import type { User } from "../types/UserTypes";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokenResponse {
  attributes: AuthTokens;
  message?: string;
}

export interface GetUserProfileResponse {
  attributes: { item: User };
}
