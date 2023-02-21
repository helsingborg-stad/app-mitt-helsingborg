import { useCallback, useState } from "react";
import type { VivaStatusService } from "../services/vivaStatus/vivaStatusService.types";

interface UseVivaStatusService {
  service: VivaStatusService;
}

export default function useVivaStatusService({
  service,
}: UseVivaStatusService): VivaStatusService {
  const [props, setProps] = useState({ ...service });

  const fetch = useCallback(async () => {
    await service.fetch();
    setProps({ ...service });
  }, [service]);

  return {
    ...props,
    fetch,
  };
}
