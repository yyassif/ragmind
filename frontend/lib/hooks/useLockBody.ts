import * as React from "react";

// @see https://usehooks.com/useLockBodyScroll.

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useLockBody() {
  React.useLayoutEffect((): (() => void) => {
    const originalStyle: string = window.getComputedStyle(
      document.body
    ).overflow;
    document.body.style.overflow = "hidden";

    return () => (document.body.style.overflow = originalStyle);
  }, []);
}
