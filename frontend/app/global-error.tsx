"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    if (error.digest) {
      Sentry.captureException(error);
      console.error(`Error: ${error}`);
      console.error(`Error digest: ${error.digest}`);
    }
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <Button onClick={() => reset()}>Try again.</Button>
      </body>
    </html>
  );
}
