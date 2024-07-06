import Image from "next/image";
import { Fragment } from "react";

interface SiteLogoLogoProps {
  size: number;
}

export default function SiteLogo({ size }: SiteLogoLogoProps): JSX.Element {
  return (
    <Fragment>
      <Image
        src="/assets/logo.png"
        alt="RAGMind Logo Light Mode"
        width={size}
        height={size}
        className="dark:hidden"
      />

      <Image
        src="/assets/logo-white.png"
        alt="RAGMind Logo Dark Mode"
        width={size}
        height={size}
        className="hidden dark:block"
      />
    </Fragment>
  );
}
