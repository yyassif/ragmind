import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { ConnectionCards } from "@/components/partial/ConnectionCards/ConnectionCards";
import { Button } from "@/components/ui/button";
import { SyncElement } from "@/lib/api/sync/types";
import { useSync } from "@/lib/api/sync/useSync";

import { FileLine } from "./FileLine/FileLine";
import { FolderLine } from "./FolderLine/FolderLine";
import { useFromConnectionsContext } from "./FromConnectionsProvider/hooks/useFromConnectionContext";

export const FromConnections = (): JSX.Element => {
  const [folderStack, setFolderStack] = useState<(string | null)[]>([]);
  const { currentSyncElements, setCurrentSyncElements, currentSyncId } =
    useFromConnectionsContext();
  const [currentFiles, setCurrentFiles] = useState<SyncElement[]>([]);
  const [currentFolders, setCurrentFolders] = useState<SyncElement[]>([]);
  const { getSyncFiles } = useSync();

  useEffect(() => {
    setCurrentFiles(
      currentSyncElements?.files.filter((file) => !file.is_folder) ?? []
    );
    setCurrentFolders(
      currentSyncElements?.files.filter((file) => file.is_folder) ?? []
    );
  }, [currentSyncElements]);

  const handleGetSyncFiles = async (
    userSyncId: number,
    folderId: string | null
  ) => {
    try {
      let res;
      if (folderId !== null) {
        res = await getSyncFiles(userSyncId, folderId);
      } else {
        res = await getSyncFiles(userSyncId);
      }
      setCurrentSyncElements(res);
    } catch (error) {
      console.error("Failed to get sync files:", error);
    }
  };

  const handleBackClick = async () => {
    if (folderStack.length > 0 && currentSyncId) {
      const newFolderStack = [...folderStack];
      newFolderStack.pop();
      setFolderStack(newFolderStack);
      const parentFolderId = newFolderStack[newFolderStack.length - 1];
      await handleGetSyncFiles(currentSyncId, parentFolderId);
    } else {
      setCurrentSyncElements({ files: [] });
    }
  };

  const handleFolderClick = async (userSyncId: number, folderId: string) => {
    setFolderStack([...folderStack, folderId]);
    await handleGetSyncFiles(userSyncId, folderId);
  };

  return (
    <div className="overflow-auto h-full p-0.5">
      {!currentSyncId ? (
        <ConnectionCards fromAddKnowledge={true} />
      ) : (
        <div className="flex flex-col gap-2 overflow-hidden max-h-full">
          <div className="flex justify-between">
            <Button
              onClick={() => void handleBackClick()}
              disabled={!folderStack.length}
              variant="link"
              className="p-0"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Back</span>
            </Button>
          </div>
          <div className="overflow-x-hidden overflow-y-scroll md:max-h-56 max-h-48 xl:max-h-64">
            {currentFolders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => {
                  void handleFolderClick(currentSyncId, folder.id);
                }}
              >
                <FolderLine
                  name={folder.name ?? ""}
                  selectable={true}
                  id={folder.id}
                />
              </div>
            ))}
            {currentFiles.map((file) => (
              <div key={file.id}>
                <FileLine
                  name={file.name ?? ""}
                  selectable={true}
                  id={file.id}
                />
              </div>
            ))}
            {!currentFiles.length && !currentFolders.length && (
              <span className="italic text-sm">Empty folder</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
