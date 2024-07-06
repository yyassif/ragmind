"use client";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GetStartedButton(): JSX.Element {
  return (
    <Link href="/login">
      <Button className={cn(buttonVariants({ size: "lg" }))}>
        Get started
      </Button>
    </Link>
  );
}
