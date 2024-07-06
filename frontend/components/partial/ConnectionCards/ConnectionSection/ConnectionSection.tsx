import Image from "next/image";
import { useEffect, useState } from "react";

import { useFromConnectionsContext } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import { ConnectionIcon } from "@/components/partial/ConnectionIcon/ConnectionIcon";
import { Button } from "@/components/ui/button";
import { OpenedConnection, Provider, Sync } from "@/lib/api/sync/types";
import { useSync } from "@/lib/api/sync/useSync";
import { Icon } from "@/lib/components/ui/Icon/Icon";

import { ConnectionButton } from "./ConnectionButton/ConnectionButton";
import { ConnectionLine } from "./ConnectionLine/ConnectionLine";

interface ConnectionSectionProps {
  label: string;
  provider: Provider;
  callback: (name: string) => Promise<{ authorization_url: string }>;
  fromAddKnowledge?: boolean;
}

const renderConnectionLines = (
  existingConnections: Sync[],
  folded: boolean
) => {
  if (!folded) {
    return existingConnections.map((connection, index) => (
      <div key={index}>
        <ConnectionLine
          label={connection.email}
          index={index}
          id={connection.id}
        />
      </div>
    ));
  } else {
    return (
      <div className="flex pl-2">
        {existingConnections.map((connection, index) => (
          <div className="-ml-2" key={index}>
            <ConnectionIcon letter={connection.email[0]} index={index} />
          </div>
        ))}
      </div>
    );
  }
};

const renderExistingConnections = ({
  existingConnections,
  folded,
  setFolded,
  fromAddKnowledge,
  handleGetSyncFiles,
  openedConnections,
}: {
  existingConnections: Sync[];
  folded: boolean;
  setFolded: (folded: boolean) => void;
  fromAddKnowledge: boolean;
  handleGetSyncFiles: (
    userSyncId: number,
    currentProvider: Provider
  ) => Promise<void>;
  openedConnections: OpenedConnection[];
}) => {
  if (!!existingConnections.length && !fromAddKnowledge) {
    return (
      <div className="flex flex-col gap-2 w-full pt-4 font-medium text-sm">
        <div className="flex justify-between items-center font-medium text-sm">
          <span className="font-medium text-sm leading-4">
            Connected accounts
          </span>
          <Icon
            name="settings"
            size="normal"
            color="black"
            handleHover={true}
            onClick={() => setFolded(!folded)}
          />
        </div>
        {renderConnectionLines(existingConnections, folded)}
      </div>
    );
  } else if (existingConnections.length > 0 && fromAddKnowledge) {
    return (
      <div className="flex flex-col gap-2 w-full pt-4 font-medium text-sm">
        {existingConnections.map((connection, index) => (
          <div key={index}>
            <ConnectionButton
              label={connection.email}
              index={index}
              submitted={openedConnections.some((openedConnection) => {
                return (
                  openedConnection.name === connection.name &&
                  openedConnection.submitted
                );
              })}
              onClick={() =>
                void handleGetSyncFiles(connection.id, connection.provider)
              }
            />
          </div>
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export const ConnectionSection = ({
  label,
  provider,
  fromAddKnowledge,
  callback,
}: ConnectionSectionProps): JSX.Element => {
  const { iconUrls, getUserSyncs, getSyncFiles } = useSync();
  const {
    setCurrentSyncElements,
    setCurrentSyncId,
    setOpenedConnections,
    openedConnections,
    hasToReload,
    setHasToReload,
  } = useFromConnectionsContext();
  const [existingConnections, setExistingConnections] = useState<Sync[]>([]);
  const [folded, setFolded] = useState<boolean>(!fromAddKnowledge);

  const fetchUserSyncs = async () => {
    try {
      const res: Sync[] = await getUserSyncs();
      setExistingConnections(
        res.filter(
          (sync) =>
            Object.keys(sync.credentials).length !== 0 &&
            sync.provider === provider
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void fetchUserSyncs();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !document.hidden) {
        void fetchUserSyncs();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (hasToReload) {
      void fetchUserSyncs();
      setHasToReload(false);
    }
  }, [hasToReload]);

  const handleOpenedConnections = (userSyncId: number) => {
    const existingConnection = openedConnections.find(
      (connection) => connection.user_sync_id === userSyncId
    );

    if (!existingConnection) {
      const newConnection: OpenedConnection = {
        name:
          existingConnections.find((connection) => connection.id === userSyncId)
            ?.name ?? "",
        user_sync_id: userSyncId,
        id: undefined,
        provider: provider,
        submitted: false,
        selectedFiles: { files: [] },
        last_synced: "",
      };

      setOpenedConnections([...openedConnections, newConnection]);
    }
  };

  const handleGetSyncFiles = async (userSyncId: number) => {
    try {
      const res = await getSyncFiles(userSyncId);
      setCurrentSyncElements(res);
      setCurrentSyncId(userSyncId);
      handleOpenedConnections(userSyncId);
    } catch (error) {
      console.error("Failed to get sync files:", error);
    }
  };

  const connect = async () => {
    const res = await callback(
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
    if (res.authorization_url) {
      window.open(res.authorization_url, "_blank");
    }
  };

  return (
    <div className="overflow-hidden flex flex-col justify-between items-center shadow-md h-min w-full p-4 rounded-md border-b-transparent border-b border-solid">
      <div className="flex items-center justify-between w-full p-2 text-lg leading-5">
        <div className="flex gap-2 items-center">
          <Image src={iconUrls[provider]} alt={label} width={24} height={24} />
          <span className="font-medium text-sm leading-4">{label}</span>
        </div>
        <Button onClick={() => void connect()}>
          <span className="mr-2">
            {existingConnections.length ? "Add more" : "Connect"}
          </span>
          <Icon
            name={existingConnections.length ? "add" : "sync"}
            color="white"
            size="small"
          />
        </Button>
      </div>
      {renderExistingConnections({
        existingConnections,
        folded,
        setFolded,
        fromAddKnowledge: !!fromAddKnowledge,
        handleGetSyncFiles,
        openedConnections,
      })}
    </div>
  );
};
