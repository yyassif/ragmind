import Image from "next/image";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

interface SiteLogoLogoProps {
  size: number;
  className?: string;
}

export default function SiteLogo({
  size,
  className,
}: SiteLogoLogoProps): JSX.Element {
  return (
    <Fragment>
      <Image
        src="/assets/logo.png"
        alt="RAGMind Logo Light Mode"
        width={size}
        height={size}
        className={cn("dark:hidden", className)}
      />

      <Image
        src="/assets/logo-white.png"
        alt="RAGMind Logo Dark Mode"
        width={size}
        height={size}
        className={cn("hidden dark:block", className)}
      />
    </Fragment>
  );
}
