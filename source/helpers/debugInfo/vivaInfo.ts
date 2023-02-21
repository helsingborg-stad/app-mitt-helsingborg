import type { DebugInfoCategoryGetter } from "./debugInfo.types";
import { ServiceLocator } from "../../services/serviceLocator";

const vivaInfo: DebugInfoCategoryGetter = {
  name: "VIVA",
  getEntries: async () => {
    const vivaStatusService = ServiceLocator.getInstance().get("vivaStatus");
    await vivaStatusService.fetch();

    return [
      {
        name: "Statuskod",
        value: vivaStatusService.code.toString(),
      },
      {
        name: "Delkoder",
        value: vivaStatusService.parts.map((part) => part.code).join(", "),
      },
    ];
  },
};

export default vivaInfo;
