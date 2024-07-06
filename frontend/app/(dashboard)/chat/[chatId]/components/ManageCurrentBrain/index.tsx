"use client";

import { Cog } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ManageCurrentBrainButton({
  pathname,
}: {
  pathname: string;
}): JSX.Element {
  return (
    <Link href={pathname}>
      <Button variant="outline">
        <Cog className="h-4 w-4 mr-2" />
        <span>Manage Current Brain</span>
      </Button>
    </Link>
  );
}
