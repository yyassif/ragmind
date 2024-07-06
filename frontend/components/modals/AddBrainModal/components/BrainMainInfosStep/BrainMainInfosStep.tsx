import { CircleArrowRight } from "lucide-react";
import { Fragment } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { CreateBrainProps } from "@/components/modals/AddBrainModal/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useBrainCreationSteps } from "../../hooks/useBrainCreationSteps";

export const BrainMainInfosStep = (): JSX.Element => {
  const { currentStepIndex, goToNextStep } = useBrainCreationSteps();

  const { watch } = useFormContext<CreateBrainProps>();
  const name = watch("name");
  const description = watch("description");

  const isDisabled = !name || !description;

  const next = (): void => {
    goToNextStep();
  };

  if (currentStepIndex !== 0) {
    return <Fragment />;
  }

  return (
    <div className="flex flex-col justify-between h-full p-1">
      <div className="flex flex-col gap-4 my-4">
        <span className="text-lg font-semibold">Define brain identity</span>
        <Controller
          name="name"
          render={({ field }) => (
            <Fragment>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={field.value as string}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </Fragment>
          )}
        />
        <Controller
          name="description"
          render={({ field }) => (
            <Fragment>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={field.value as string}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </Fragment>
          )}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={() => next()} disabled={isDisabled}>
          <span>Next step</span>
          <CircleArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
