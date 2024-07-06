import * as React from "react";

import ModeToggle from "@/components/layout/mode-toggle";
import { siteConfig } from "@/config/site";
import SiteLogo from "@/lib/assets/SiteLogo";
import { cn } from "@/lib/utils";

export default function SiteFooter({
  className,
}: React.HTMLAttributes<HTMLElement>): JSX.Element {
  return (
    <footer className={cn(className, "border-t")}>
      <div className="container flex h-12 flex-row items-center justify-between gap-4">
        <div className="flex flex-row items-center gap-4 md:gap-2 md:px-0">
          <SiteLogo size={16} />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              RAGMind
            </a>
            . Open source for{" "}
            <a
              href="https://github.com/yyassif/ragmind"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              everyone
            </a>
          </p>
        </div>
        <ModeToggle />
      </div>
    </footer>
  );
}
