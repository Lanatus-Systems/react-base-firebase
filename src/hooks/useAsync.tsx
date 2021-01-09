import { useState, useCallback } from "react";

type TasyncFunction<T, R> = (req: T) => Promise<R>;

const useAsync = <T, R>(
  asyncFunction: TasyncFunction<T, R>
): [TasyncFunction<T, R>, boolean, Error | undefined] => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const wrapper = useCallback(
    (req: T) => {
      setLoading(true);
      return asyncFunction(req)
        .catch((err: Error) => {
          console.log({err})
          setError(err);
          throw err;
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [asyncFunction]
  );
  return [wrapper, loading, error];
};

export default useAsync;
