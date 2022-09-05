import StorageService from "../../services/storage/StorageService";

import type {
  DebugInfoCategoryGetter,
  DebugInfoEntry,
} from "./debugInfo.types";

const storageInfo: DebugInfoCategoryGetter = {
  name: "Storage",
  getEntries: async () => {
    const storagePairs = await StorageService.getAll();
    return storagePairs.map<DebugInfoEntry>(([name, value]) => ({
      name,
      value: value ?? "<null>",
    }));
  },
};

export default storageInfo;
