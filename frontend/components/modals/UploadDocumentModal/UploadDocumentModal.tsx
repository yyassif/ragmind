import {
  ChevronRightCircle,
  CirclePlus,
  DatabaseZap,
  Trash2,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import KnowledgeToFeed from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/KnowledgeToFeed";
import { useFromConnectionsContext } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OpenedConnection } from "@/lib/api/sync/types";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { createHandleGetButtonProps } from "@/lib/helpers/handleConnectionButtons";
import { cn } from "@/lib/utils";

import { useAddKnowledge } from "./hooks/useAddKnowledge";

export const UploadDocumentModal = (): JSX.Element => {
  const { shouldDisplayFeedCard, setShouldDisplayFeedCard, knowledgeToFeed } =
    useKnowledgeToFeedContext();
  const { currentBrain } = useBrainContext();
  const { feedBrain } = useAddKnowledge();
  const [feeding, setFeeding] = useState<boolean>(false);
  const {
    currentSyncId,
    setCurrentSyncId,
    openedConnections,
    setOpenedConnections,
  } = useFromConnectionsContext();
  const [currentConnection, setCurrentConnection] = useState<
    OpenedConnection | undefined
  >(undefined);

  const { t } = useTranslation(["knowledge"]);

  const disabled = useMemo(() => {
    return (
      (knowledgeToFeed.length === 0 &&
        openedConnections.filter((connection) => {
          return connection.submitted || !!connection.last_synced;
        }).length === 0) ||
      !currentBrain
    );
  }, [knowledgeToFeed, openedConnections, currentBrain, currentSyncId]);

  const handleFeedBrain = async () => {
    setFeeding(true);
    await feedBrain();
    setFeeding(false);
    setShouldDisplayFeedCard(false);
  };

  const getButtonProps = createHandleGetButtonProps(
    currentConnection,
    openedConnections,
    setOpenedConnections,
    currentSyncId,
    setCurrentSyncId
  );
  const buttonProps = getButtonProps();

  useEffect(() => {
    setCurrentConnection(
      openedConnections.find(
        (connection) => connection.user_sync_id === currentSyncId
      )
    );
  }, [currentSyncId]);

  return (
    <Dialog
      open={shouldDisplayFeedCard}
      onOpenChange={setShouldDisplayFeedCard}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <DatabaseZap className="h-4 w-4 mr-2" />
          <span>Add Knowledge</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>
            {t("addKnowledgeTitle", { ns: "knowledge" })}
          </DialogTitle>
          <DialogDescription>
            {t("addKnowledgeSubtitle", { ns: "knowledge" })}
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex flex-col justify-between w-full flex-1">
          <KnowledgeToFeed />
          <div
            className={cn(
              "flex justify-between mt-4",
              !currentSyncId && "justify-end"
            )}
          >
            {!!currentSyncId && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentSyncId(undefined);
                }}
              >
                <ChevronRightCircle className="h-4 w-4 mr-2" />
                <span>Back to Connections</span>
              </Button>
            )}
            {currentSyncId ? (
              <Button
                disabled={buttonProps.disabled}
                onClick={() => buttonProps.callback()}
              >
                {buttonProps.type === "dangerous" ? (
                  <Trash2 className="h-4 w-4 mr-2" />
                ) : (
                  <CirclePlus className="h-4 w-4 mr-2" />
                )}
                <span>{buttonProps.label}</span>
              </Button>
            ) : (
              <Button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setOpenedConnections([]);
                  void handleFeedBrain();
                }}
              >
                {!feeding ? (
                  <Fragment>
                    <CirclePlus className="h-4 w-4 mr-2" />
                    <span>Feed Brain</span>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Spinner />
                    <span>Feeding</span>
                  </Fragment>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
