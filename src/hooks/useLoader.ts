import { useState } from "react";

interface ActionOptions {
  onSuccess?: (res: any) => void;
  onError?: (res: any) => void;
}

export default function useLoader() {
  const [isLoading, setIsLoading] = useState(false);

  return {
    isLoading,
    action<T extends unknown[]>(
      this: void,
      action: (...args: [...T]) => Promise<unknown>,
      { onSuccess, onError }: ActionOptions = {},
    ): (...args: [...T]) => void {
      return (...args) => {
        setIsLoading(true);
        action(...args)
          .then(onSuccess)
          .catch(onError)
          .finally(() => setIsLoading(false));
      };
    },
  };
}
