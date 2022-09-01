import type {
  DebugInfoCategory,
  DebugInfoCategoryGetter,
} from "./debugInfo.types";
import storageInfo from "./storageInfo";
import systemInfo from "./systemInfo";

const debugInfoCategories: DebugInfoCategoryGetter[] = [
  systemInfo,
  storageInfo,
];

async function getInfo(
  category: DebugInfoCategoryGetter
): Promise<DebugInfoCategory> {
  try {
    const entries = await category.getEntries();
    return {
      name: category.name,
      entries,
    };
  } catch (error) {
    console.error(error);
    return {
      name: category.name,
      errorMessage: (error as Error).toString(),
    };
  }
}

export default function getDebugInfo(): Promise<DebugInfoCategory[]> {
  return Promise.all(debugInfoCategories.map(getInfo));
}
