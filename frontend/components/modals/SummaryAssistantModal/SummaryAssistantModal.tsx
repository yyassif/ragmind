import { CircleArrowRight, CpuIcon, RocketIcon } from "lucide-react";
import { useState } from "react";

import { Stepper } from "@/components/modals/AddBrainModal/components/Stepper/Stepper";
import { StepValue } from "@/components/modals/AddBrainModal/types/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Assistant } from "@/lib/api/assistants/types";
import { useAssistants } from "@/lib/api/assistants/useAssistants";
import { Step } from "@/lib/types/Modal";

import { InputsStep } from "./InputsStep/InputsStep";
import { OutputsStep } from "./OutputsStep/OutputsStep";

interface AssistantModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  assistant: Assistant;
}

export const SummaryAssistantModal = ({
  isOpen,
  setIsOpen,
  assistant,
}: AssistantModalProps): JSX.Element => {
  const steps: Step[] = [
    {
      label: "Inputs",
      value: "FIRST_STEP",
    },
    {
      label: "Outputs",
      value: "SECOND_STEP",
    },
  ];
  const [currentStep, setCurrentStep] = useState<StepValue>("FIRST_STEP");
  const [emailOutput, setEmailOutput] = useState<boolean>(true);
  const [brainOutput, setBrainOutput] = useState<string>("");
  const [files, setFiles] = useState<{ key: string; file: File | null }[]>(
    assistant.inputs.files.map((fileInput) => ({
      key: fileInput.key,
      file: null,
    }))
  );
  const { processAssistant } = useAssistants();

  const handleFileChange = (file: File, inputKey: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((fileObj) =>
        fileObj.key === inputKey ? { ...fileObj, file } : fileObj
      )
    );
  };

  const handleSetIsOpen = (value: boolean) => {
    if (!value) {
      setCurrentStep("FIRST_STEP");
    }
    setIsOpen(value);
  };

  const handleProcessAssistant = async () => {
    handleSetIsOpen(false);
    await processAssistant(
      {
        name: assistant.name,
        inputs: {
          files: files.map((file) => ({
            key: file.key,
            value: (file.file as File).name,
          })),
          urls: [],
          texts: [],
        },
        outputs: {
          email: {
            activated: emailOutput,
          },
          brain: {
            activated: brainOutput !== "",
            value: brainOutput,
          },
        },
      },
      files.map((file) => file.file as File)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSetIsOpen}>
      <DialogContent className="sm:max-w-[768px]">
        <DialogHeader>
          <DialogTitle>{assistant.name}</DialogTitle>
          <DialogDescription>{assistant.description}</DialogDescription>
        </DialogHeader>
        <div className="p-4 flex flex-col w-full h-full justify-between">
          <div className="flex flex-col gap-4 w-full">
            <Stepper steps={steps} currentStep={currentStep} />
            {currentStep === "FIRST_STEP" ? (
              <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Tutorial</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-col">
                    <span className="font-semibold">Expected Input</span>
                    {assistant.input_description}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Tutorial</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-col">
                    <span className="font-semibold">Output</span>
                    {assistant.output_description}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {currentStep === "FIRST_STEP" ? (
              <InputsStep
                inputs={assistant.inputs}
                onFileChange={handleFileChange}
              />
            ) : (
              <OutputsStep
                setEmailOutput={setEmailOutput}
                setBrainOutput={setBrainOutput}
              />
            )}
          </div>
          <DialogFooter className="flex !self-end">
            {currentStep === "FIRST_STEP" ? (
              <Button
                onClick={() => setCurrentStep("SECOND_STEP")}
                disabled={!!files.find((file) => !file.file)}
              >
                <span>Next</span>
                <CircleArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => void handleProcessAssistant()}
                disabled={!emailOutput && brainOutput === ""}
              >
                <span>Process</span>
                <CpuIcon className="h-4 w-4 ml-2" />
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
