import { Brain } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useFromConnectionsContext } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import { CreateBrainProps } from "@/components/modals/AddBrainModal/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addBrainDefaultValues } from "@/lib/config/defaultBrainConfig";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { useUserData } from "@/lib/hooks/useUserData";

import { useBrainCreationContext } from "./brain-creation-provider";
import { BrainMainInfosStep } from "./components/BrainMainInfosStep/BrainMainInfosStep";
import { BrainRecapStep } from "./components/BrainRecapStep/BrainRecapStep";
import { FeedBrainStep } from "./components/FeedBrainStep/FeedBrainStep";
import { Stepper } from "./components/Stepper/Stepper";
import { useBrainCreationSteps } from "./hooks/useBrainCreationSteps";

export const AddBrainModal = (): JSX.Element => {
  const { t } = useTranslation(["translation", "brain", "config"]);
  const { userIdentityData } = useUserData();
  const { currentStep, steps } = useBrainCreationSteps();

  const {
    isBrainCreationModalOpened,
    setIsBrainCreationModalOpened,
    setCurrentSelectedBrain,
  } = useBrainCreationContext();
  const { setCurrentSyncId, setOpenedConnections } =
    useFromConnectionsContext();
  const { removeAllKnowledgeToFeed } = useKnowledgeToFeedContext();

  const defaultValues: CreateBrainProps = {
    ...addBrainDefaultValues,
    setDefault: true,
    brainCreationStep: "FIRST_STEP",
  };

  const methods = useForm<CreateBrainProps>({
    defaultValues,
  });

  useEffect(() => {
    setCurrentSelectedBrain(undefined);
    setCurrentSyncId(undefined);
    setOpenedConnections([]);
    methods.reset(defaultValues);
    removeAllKnowledgeToFeed();
  }, [isBrainCreationModalOpened]);

  return (
    <FormProvider {...methods}>
      <Dialog
        open={isBrainCreationModalOpened}
        onOpenChange={setIsBrainCreationModalOpened}
      >
        <DialogTrigger asChild>
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            <span>Add Brain</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[768px]"
          onInteractOutside={(e) => {
            if (!userIdentityData?.onboarded) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("newBrainTitle", { ns: "brain" })}</DialogTitle>
            <DialogDescription>
              {t("newBrainSubtitle", { ns: "brain" })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col p-2 w-full h-full overflow-hidden gap-4">
            <div className="w-full">
              <Stepper currentStep={currentStep} steps={steps} />
            </div>
            <div className="grow overflow-scroll">
              <BrainMainInfosStep />
              <FeedBrainStep />
              <BrainRecapStep />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
