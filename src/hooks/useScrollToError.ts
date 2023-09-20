import { ReactNode, RefObject } from "react";

export interface InputRefAndError {
  error?: ReactNode;
  ref: RefObject<HTMLElement>;
}

export default function useScrollToError(items?: InputRefAndError[]) {
  const scrollToError = () => {
    const errorItem = items?.find(({ error }) => error);
    if (errorItem) {
      errorItem.ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  return scrollToError;
}
