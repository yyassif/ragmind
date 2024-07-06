import { ChevronRight } from "lucide-react";

import { ConnectionIcon } from "@/components/partial/ConnectionIcon/ConnectionIcon";
import { Button } from "@/components/ui/button";

interface ConnectionButtonProps {
  label: string;
  index: number;
  onClick: (id: number) => void;
  submitted?: boolean;
}

export const ConnectionButton = ({
  label,
  index,
  onClick,
  submitted,
}: ConnectionButtonProps): JSX.Element => {
  return (
    <div className="flex justify-between items-center w-full gap-1">
      <div className="flex gap-1 overflow-hidden">
        <ConnectionIcon letter={label[0]} index={index} />
        <span className="text-sm overflow-ellipsis">{label}</span>
      </div>
      <div className="flex gap-1">
        <Button onClick={() => onClick(index)}>
          <span>{submitted ? "Update" : "Use"}</span>
          <ChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};
