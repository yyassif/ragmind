import { UUID } from "crypto";
import { Fragment } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Brain } from "@/lib/context/BrainProvider/types";

import { PromptSelector } from "./components/PromptSelector/PromptSelector";
import { UsePromptProps } from "./hooks/usePrompt";
import { usePromptTab } from "./hooks/usePromptTab";

import { useBrainFormState } from "../SettingsTab/hooks/useBrainFormState";
import { usePermissionsController } from "../SettingsTab/hooks/usePermissionsController";

type PromptTabProps = {
  brainId: UUID;
};

export default function PromptTab({ brainId }: PromptTabProps): JSX.Element {
  const methods = useForm<Brain>();

  return (
    <FormProvider {...methods}>
      <PromptTabContent brainId={brainId} />
    </FormProvider>
  );
}

function PromptTabContent({ brainId }: PromptTabProps): JSX.Element {
  const { isUpdating, setIsUpdating, formRef, handleSubmit } = usePromptTab({
    brainId,
  });

  const promptProps: UsePromptProps = {
    setIsUpdating,
  };

  useBrainFormState();

  const { hasEditRights } = usePermissionsController({
    brainId,
  });

  return (
    <Fragment>
      {hasEditRights && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
          ref={formRef}
        >
          <PromptSelector
            usePromptProps={promptProps}
            isUpdatingBrain={isUpdating}
          />
        </form>
      )}
    </Fragment>
  );
}
