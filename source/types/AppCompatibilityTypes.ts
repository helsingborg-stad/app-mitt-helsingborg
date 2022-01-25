import VERSION_STATUS from "./VersionStatusTypes";

export enum APPLICATION_COMPATIBILITY_STATUS {
  COMPATIBLE = "COMPATIBLE",
  INCOMPATIBLE = "INCOMPATIBLE",
  PENDING = "PENDING",
}

export interface ApplicationCompatibilityState {
  status: APPLICATION_COMPATIBILITY_STATUS;
  updateUrl: string;
}
export interface AppCompatibilityVisitor<T> {
  pending: () => T;
  compatible: () => T;
  incompatible: ({ status, updateUrl }: ApplicationCompatibilityState) => T;
}

export interface AppCompatibilityContextType {
  visit: <T>(visitor: Partial<AppCompatibilityVisitor<T>>) => T | undefined;
}
