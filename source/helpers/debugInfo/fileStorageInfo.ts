import defaultFileStorageService from "../../services/storage/fileStorage/FileStorageService";
import { splitFilePath } from "../FileUpload";
import type { DebugInfoCategoryGetter } from "./debugInfo.types";

const fileStorageInfo: DebugInfoCategoryGetter = {
  name: "Files",
  async getEntries() {
    const list = await defaultFileStorageService.getFileList();
    const splitList = list.map(splitFilePath);
    const groupedByDir = splitList.reduce(
      (acc, path) => ({
        ...acc,
        [path.dir]: [...(acc[path.dir] ?? []), path.nameWithExt],
      }),
      {} as Record<string, string[]>
    );

    return Object.entries(groupedByDir).map(([name, values]) => ({
      name,
      value: values.join(",\n"),
    }));
  },
};

export default fileStorageInfo;
