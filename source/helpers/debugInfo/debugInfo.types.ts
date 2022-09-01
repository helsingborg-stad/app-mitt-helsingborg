export interface DebugInfoEntry {
  name: string;
  value: string;
}

export interface DebugInfoCategory {
  name: string;
  entries?: DebugInfoEntry[];
  errorMessage?: string;
}

export interface DebugInfoCategoryGetter {
  name: string;
  getEntries(): Promise<DebugInfoEntry[]>;
}
