import Spinner from "@/components/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MinimalBrainForUser } from "@/lib/context/BrainProvider/types";

import BrainItem from "../BrainItem";

type BrainsListProps = {
  brains: MinimalBrainForUser[];
  isFetchingBrains: boolean;
};

export default function BrainsList({
  brains,
  isFetchingBrains,
}: BrainsListProps): JSX.Element {
  return isFetchingBrains && brains.length === 0 ? (
    <div className="flex w-full h-full justify-center items-center">
      <Spinner />
    </div>
  ) : (
    <ScrollArea className="flex-1 h-full">
      <div className="flex flex-col gap-4 p-4 pt-0">
        {brains.map((item) => (
          <BrainItem key={item.id} brain={item} />
        ))}
      </div>
    </ScrollArea>
  );
}
