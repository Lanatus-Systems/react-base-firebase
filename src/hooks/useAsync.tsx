import { useState, useEffect } from "react";

interface Iprops<T> {
  fun: () => Promise<T>;
  defaultValue?: T;
}

const useAsync = <T,>({
  fun,
  defaultValue,
}: Iprops<T>): [T | undefined, boolean] => {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  useEffect(() => {
    fun().then(setValue);
    // call on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [value, value !== defaultValue];
};

export default useAsync;
