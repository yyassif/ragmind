/* eslint-disable complexity */

import { Fragment } from "react";

import { StepValue } from "@/components/modals/AddBrainModal/types/types";
import { Icon } from "@/lib/components/ui/Icon/Icon";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: StepValue;
  steps: { value: string; label: string }[];
}

export const Stepper = ({ currentStep, steps }: StepperProps): JSX.Element => {
  const currentStepIndex = steps.findIndex(
    (step) => step.value === currentStep
  );

  return (
    <div className="flex w-full justify-between">
      {steps.map((step, index) => (
        <Fragment key={step.value}>
          <div className="flex flex-col relative rounded-full" key={step.value}>
            <div
              className={cn(
                "w-10 h-10 bg-indigo-700 flex justify-center items-center rounded-full",
                index === currentStepIndex &&
                  "bg-white border border-indigo-700",
                index < currentStepIndex && "bg-green-600",
                index > currentStepIndex && "bg-indigo-300"
              )}
            >
              <div
                className={cn(
                  "w-full h-full flex justify-center items-center rounded-full",
                  index === currentStepIndex && "bg-indigo-700 w-[70%] h-[70%]"
                )}
              >
                {index < currentStepIndex && (
                  <Icon name="check" size="normal" color="white" />
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-col text-xs w-10">
              <span className="whitespace-no-wrap text-gray-400 text-nowrap">
                STEP {index + 1}
              </span>
              <span
                className={cn(
                  index === currentStepIndex && "text-indigo-700",
                  index < currentStepIndex && "text-green-600",
                  index > currentStepIndex && "text-gray-400"
                )}
              >
                {index === currentStepIndex
                  ? "Progress"
                  : index < currentStepIndex
                  ? "Completed"
                  : "Pending"}
              </span>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "flex-grow h-1 bg-indigo-300 my-4 mx-2 rounded-md",
                index < currentStepIndex && "bg-green-600"
              )}
            ></div>
          )}
        </Fragment>
      ))}
    </div>
  );
};
