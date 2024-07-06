import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
};

export default function Spinner({ className }: SpinnerProps): JSX.Element {
  return <Loader className={cn("animate-spin m-2", className)} />;
}
