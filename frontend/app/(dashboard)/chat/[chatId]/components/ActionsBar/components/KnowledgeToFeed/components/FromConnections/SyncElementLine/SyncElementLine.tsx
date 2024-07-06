import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/lib/components/ui/Icon/Icon";
import { cn } from "@/lib/utils";

import { useFromConnectionsContext } from "../FromConnectionsProvider/hooks/useFromConnectionContext";

interface SyncElementLineProps {
  name: string;
  selectable: boolean;
  id: string;
  isFolder: boolean;
}

export const SyncElementLine = ({
  name,
  selectable,
  id,
  isFolder,
}: SyncElementLineProps): JSX.Element => {
  const [isCheckboxHovered, setIsCheckboxHovered] = useState(false);
  const { currentSyncId, openedConnections, setOpenedConnections } =
    useFromConnectionsContext();

  const initialChecked = (): boolean => {
    const currentConnection = openedConnections.find(
      (connection) => connection.user_sync_id === currentSyncId
    );

    return currentConnection
      ? currentConnection.selectedFiles.files.some((file) => file.id === id)
      : false;
  };

  const [checked, setChecked] = useState<boolean>(initialChecked);

  const handleSetChecked = () => {
    setOpenedConnections((prevState) => {
      return prevState.map((connection) => {
        if (connection.user_sync_id === currentSyncId) {
          const isFileSelected = connection.selectedFiles.files.some(
            (file) => file.id === id
          );
          const updatedFiles = isFileSelected
            ? connection.selectedFiles.files.filter((file) => file.id !== id)
            : [
                ...connection.selectedFiles.files,
                { id, name, is_folder: isFolder },
              ];

          return {
            ...connection,
            selectedFiles: {
              files: updatedFiles,
            },
          };
        }

        return connection;
      });
    });
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <div
      className={cn(
        "flex gap-1 p-1 border-t items-center cursor-pointer font-semibold hover:bg-slate-400 dark:bg-slate-600",
        (isCheckboxHovered || !isFolder || checked) && "cursor-default"
      )}
      onClick={(event) => {
        if (isFolder && checked) {
          event.stopPropagation();
        }
      }}
    >
      <div
        onMouseEnter={() => setIsCheckboxHovered(true)}
        onMouseLeave={() => setIsCheckboxHovered(false)}
        style={{ pointerEvents: "auto" }}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={handleSetChecked}
          disabled={!selectable}
        />
      </div>
      <Icon name={isFolder ? "folder" : "file"} color="black" size="normal" />
      <span className="text-sm">{name}</span>
    </div>
  );
};
