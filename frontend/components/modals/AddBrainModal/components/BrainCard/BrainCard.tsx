import { capitalCase } from "change-case";
import Image from "next/image";

import { Tag } from "@/lib/components/ui/Tag/Tag";
import Tooltip from "@/lib/components/ui/Tooltip/Tooltip";
import { cn } from "@/lib/utils";

interface BrainCardProps {
  tooltip: string;
  selected?: boolean;
  imageUrl: string;
  brainName: string;
  tags: string[];
  callback: () => void;
  cardKey: string;
  disabled?: boolean;
}

export const BrainCard = ({
  tooltip,
  selected,
  imageUrl,
  brainName,
  tags,
  callback,
  cardKey,
  disabled,
}: BrainCardProps): JSX.Element => {
  return (
    <div
      key={cardKey}
      className={cn(
        "flex flex-col gap-1",
        disabled && "opacity-10 pointer-events-none"
      )}
      onClick={() => {
        callback();
      }}
    >
      <Tooltip tooltip={tooltip}>
        <div
          className={cn(
            "flex flex-col items-center rounded-md gap-2 p-3 cursor-pointer w-32 hover:bg-indigo-100",
            selected && "border border-indigo-600 bg-indigo-300"
          )}
        >
          <Image src={imageUrl} alt={brainName} width={50} height={50} />

          <span
            className={cn(
              "font-medium text-base",
              selected && "text-indigo-600"
            )}
          >
            {brainName}
          </span>
          <div className="h-8">
            {tags[0] && <Tag color="primary" name={capitalCase(tags[0])} />}
          </div>
        </div>
      </Tooltip>
    </div>
  );
};
