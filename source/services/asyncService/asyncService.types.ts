export type AsyncState = "idle" | "loading" | "loaded" | "error";

export interface AsyncService {
  state: AsyncState;
  error: Error | null;
}
