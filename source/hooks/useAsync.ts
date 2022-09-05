import { useState, useEffect } from "react";
import { to } from "../helpers/Misc";

export default function useAsync<T>(
  asyncFunction: () => Promise<T>
): [boolean, T | undefined, Error | undefined] {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setData(undefined);
      setError(undefined);

      const [functionError, newData] = await to(asyncFunction());

      setData(newData);
      setError(functionError);
      setIsLoading(false);
    })();
  }, [asyncFunction]);

  return [isLoading, data, error];
}
