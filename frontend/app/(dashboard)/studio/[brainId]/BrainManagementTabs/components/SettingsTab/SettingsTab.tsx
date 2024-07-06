import { UUID } from "crypto";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { useBrainFetcher } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/hooks/useBrainFetcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Brain } from "@/lib/context/BrainProvider/types";
import { Model } from "@/lib/types/BrainConfig";

import ModelSelector from "./components/ModelSelector";
import { useBrainFormState } from "./hooks/useBrainFormState";
import { usePermissionsController } from "./hooks/usePermissionsController";
import { useSettingsTab } from "./hooks/useSettingsTab";

type SettingsTabProps = {
  brainId: UUID;
};

export default function SettingsTab({
  brainId,
}: SettingsTabProps): JSX.Element {
  const methods = useForm<Brain>();

  return (
    <FormProvider {...methods}>
      <SettingsTabContent brainId={brainId} />
    </FormProvider>
  );
}

function SettingsTabContent({ brainId }: SettingsTabProps): JSX.Element {
  const { handleSubmit, formRef, accessibleModels, isUpdating } =
    useSettingsTab({
      brainId,
    });

  useBrainFormState();

  const { hasEditRights } = usePermissionsController({
    brainId,
  });

  const { brain } = useBrainFetcher({
    brainId,
  });

  return (
    <form
      className="space-y-4 py-4"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
      ref={formRef}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="brain_name">Brain name *</Label>
          <Controller
            name="name"
            defaultValue={brain?.name}
            render={({ field }) => (
              <Input
                type="text"
                id="brain_name"
                disabled={!hasEditRights || isUpdating}
                value={field.value as string}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Assign a name to your brain."
              />
            )}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            defaultValue={brain?.description}
            render={({ field }) => (
              <Textarea
                id="description"
                disabled={!hasEditRights || isUpdating}
                defaultValue={brain?.description}
                value={field.value as string}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder="Write a well detailed desription for your Brain."
              />
            )}
          />
        </div>
        {(!!brain?.integration_description?.allow_model_change ||
          brain?.brain_type === "doc") && (
          <ModelSelector
            accessibleModels={accessibleModels as Model[]}
            hasEditRights={hasEditRights}
            brainModel={brain.model as Model}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <div className="flex items-center space-x-2">
        {hasEditRights && (
          <Button disabled={isUpdating} type="submit">
            Save Brain
          </Button>
        )}
      </div>
    </form>
  );
}
