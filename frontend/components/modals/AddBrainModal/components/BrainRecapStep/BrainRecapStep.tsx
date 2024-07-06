import { capitalCase } from "change-case";
import { CircleArrowLeft, CirclePlus, ShieldAlert } from "lucide-react";
import { Fragment } from "react";
import { Controller } from "react-hook-form";

import { useFromConnectionsContext } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import { useBrainCreationContext } from "@/components/modals/AddBrainModal/brain-creation-provider";
import Spinner from "@/components/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUserApi } from "@/lib/api/user/useUserApi";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { useOnboardingContext } from "@/lib/context/OnboardingProvider/hooks/useOnboardingContext";
import { useUserData } from "@/lib/hooks/useUserData";

import { BrainRecapCard } from "./BrainRecapCard/BrainRecapCard";

import { useBrainCreationSteps } from "../../hooks/useBrainCreationSteps";
import { useBrainCreationApi } from "../FeedBrainStep/hooks/useBrainCreationApi";

export const BrainRecapStep = (): JSX.Element => {
  const { currentStepIndex, goToPreviousStep } = useBrainCreationSteps();
  const { creating, setCreating } = useBrainCreationContext();
  const { knowledgeToFeed } = useKnowledgeToFeedContext();
  const { createBrain } = useBrainCreationApi();
  const { updateUserIdentity } = useUserApi();
  const { userIdentityData } = useUserData();
  const { openedConnections } = useFromConnectionsContext();
  const { setIsBrainCreated } = useOnboardingContext();

  const feed = async (): Promise<void> => {
    if (!userIdentityData?.onboarded) {
      await updateUserIdentity({
        ...userIdentityData,
        username: userIdentityData?.username ?? "",
        onboarded: true,
      });
    }
    setCreating(true);
    createBrain();
  };

  const previous = (): void => {
    goToPreviousStep();
  };

  if (currentStepIndex !== 2) {
    return <Fragment />;
  }

  return (
    <div className="flex justify-between flex-col h-full gap-2 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-scroll">
        <Alert>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            Depending on the number of knowledge, the upload can take
            <strong> few minutes</strong>.
          </AlertDescription>
        </Alert>
        <h4 className="font-medium leading-none tracking-tight">Brain Recap</h4>
        <div className="flex flex-col gap-4">
          <div className="w-full mx-w-full">
            <Controller
              name="name"
              render={({ field }) => (
                <Fragment>
                  <Label htmlFor={field.name}>{capitalCase(field.name)}</Label>
                  <Input
                    key={field.name}
                    id={field.name}
                    value={field.value as string}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled
                  />
                </Fragment>
              )}
            />
          </div>
          <div>
            <Controller
              name="description"
              render={({ field }) => (
                <Fragment>
                  <Label htmlFor={field.name}>{capitalCase(field.name)}</Label>
                  <Textarea
                    key={field.name}
                    id={field.name}
                    value={field.value as string}
                    onChange={(e) => field.onChange(e.target.value)}
                    disabled
                  />
                </Fragment>
              )}
            />
          </div>
        </div>
        <h4 className="font-medium leading-none tracking-tight">
          Knowledge From
        </h4>
        <div className="flex flex-wrap justify-between gap-4 p-0.5">
          <BrainRecapCard
            label="Connection"
            number={openedConnections.length}
          />
          <BrainRecapCard
            label="URL"
            number={
              knowledgeToFeed.filter(
                (knowledge) => knowledge.source === "crawl"
              ).length
            }
          />
          <BrainRecapCard
            label="Document"
            number={
              knowledgeToFeed.filter(
                (knowledge) => knowledge.source === "upload"
              ).length
            }
          />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <Button
          disabled={creating}
          onClick={() => previous()}
          variant="outline"
        >
          <CircleArrowLeft className="h-4 w-4 mr-2" />
          <span>Previous step</span>
        </Button>
        <Button
          disabled={creating}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await feed();
            setIsBrainCreated(true);
          }}
        >
          {!creating ? (
            <Fragment>
              <CirclePlus className="h-4 w-4 mr-2" />
              <span>Create</span>
            </Fragment>
          ) : (
            <Fragment>
              <Spinner />
              <span>Creating</span>
            </Fragment>
          )}
        </Button>
      </div>
    </div>
  );
};
