import { useSync } from "@/lib/api/sync/useSync";
import { cn } from "@/lib/utils";

import { ConnectionSection } from "./ConnectionSection/ConnectionSection";

interface ConnectionCardsProps {
  fromAddKnowledge?: boolean;
}

export const ConnectionCards = ({
  fromAddKnowledge,
}: ConnectionCardsProps): JSX.Element => {
  const { syncGoogleDrive, syncSharepoint } = useSync();

  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 w-full",
        fromAddKnowledge && "justify-between"
      )}
    >
      <ConnectionSection
        label="Google Drive"
        provider="Google"
        callback={(name) => syncGoogleDrive(name)}
        fromAddKnowledge={fromAddKnowledge}
      />
      <ConnectionSection
        label="Sharepoint"
        provider="Azure"
        callback={(name) => syncSharepoint(name)}
        fromAddKnowledge={fromAddKnowledge}
      />
    </div>
  );
};
