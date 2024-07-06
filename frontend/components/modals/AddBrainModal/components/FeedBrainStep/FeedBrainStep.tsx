import {
  CircleArrowLeft,
  CircleArrowRight,
  CirclePlus,
  RocketIcon,
  Trash2,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import KnowledgeToFeed from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/KnowledgeToFeed";
import { useFromConnectionsContext } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { OpenedConnection } from "@/lib/api/sync/types";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { createHandleGetButtonProps } from "@/lib/helpers/handleConnectionButtons";
import { useUserData } from "@/lib/hooks/useUserData";

import { useBrainCreationSteps } from "../../hooks/useBrainCreationSteps";

export const FeedBrainStep = (): JSX.Element => {
  const { currentStepIndex, goToPreviousStep, goToNextStep } =
    useBrainCreationSteps();
  const { userIdentityData } = useUserData();
  const {
    currentSyncId,
    setCurrentSyncId,
    openedConnections,
    setOpenedConnections,
  } = useFromConnectionsContext();
  const [currentConnection, setCurrentConnection] = useState<
    OpenedConnection | undefined
  >(undefined);
  const { knowledgeToFeed } = useKnowledgeToFeedContext();

  useEffect(() => {
    setCurrentConnection(
      openedConnections.find(
        (connection) => connection.user_sync_id === currentSyncId
      )
    );
  }, [currentSyncId]);

  const getButtonProps = createHandleGetButtonProps(
    currentConnection,
    openedConnections,
    setOpenedConnections,
    currentSyncId,
    setCurrentSyncId
  );

  const renderButtons = () => {
    const buttonProps = getButtonProps();

    return (
      <div className="flex justify-between mt-4">
        {currentSyncId ? (
          <Button onClick={() => setCurrentSyncId(undefined)} variant="outline">
            <CircleArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to connections</span>
          </Button>
        ) : (
          <Button onClick={() => goToPreviousStep()} variant="outline">
            <CircleArrowLeft className="h-4 w-4 mr-2" />
            <span>Previous step</span>
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
            onClick={() => goToNextStep()}
            disabled={
              knowledgeToFeed.length === 0 &&
              !userIdentityData?.onboarded &&
              !openedConnections.length
            }
          >
            <span>Next step</span>
            <CircleArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    );
  };

  if (currentStepIndex !== 1) {
    return <Fragment />;
  }

  return (
    <div className="flex flex-col justify-between h-full p-4">
      <Fragment>
        {!userIdentityData?.onboarded && (
          <div className="pb-4">
            <Alert>
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Tutorial</AlertTitle>
              <AlertDescription>
                <span>
                  Upload documents or add URLs to add knowledges to your brain.
                </span>
              </AlertDescription>
            </Alert>
          </div>
        )}
        <div className="flex flex-col overflow-scroll h-full">
          <span className="text-xl">Feed your brain</span>
          <KnowledgeToFeed hideBrainSelector={true} />
        </div>
      </Fragment>
      {renderButtons()}
    </div>
  );
};
