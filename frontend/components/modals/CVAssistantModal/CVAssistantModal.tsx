/* eslint complexity: ["error", 15] */

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

import { CVFilesStep } from "./CVFilesStep/CVFilesStep";
import { JobDescriptionStep } from "./JobDescriptionStep/JobDescriptionStep";
import { OutputsStep } from "./OutputsStep/OutputsStep";

interface AssistantModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  assistant: Assistant;
}

export const CVAssistantModal = ({
  isOpen,
  setIsOpen,
  assistant,
}: AssistantModalProps): JSX.Element => {
  const steps: Step[] = [
    {
      label: "Job Description",
      value: "FIRST_STEP",
    },
    {
      label: "CV Documents",
      value: "SECOND_STEP",
    },
    {
      label: "Outputs",
      value: "THIRD_STEP",
    },
  ];
  const [currentStep, setCurrentStep] = useState<StepValue>("FIRST_STEP");
  const [emailOutput, setEmailOutput] = useState<boolean>(true);
  const [files, setFiles] = useState<{ key: string; file: File | null }[]>(
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (assistant.inputs.files ?? []).map((fileInput) => ({
      key: fileInput.key,
      file: null,
    }))
  );
  const [texts, setTexts] = useState<{ key: string; text: string }[]>(
    assistant.inputs.texts.map((textInput) => ({
      key: textInput.key,
      text: "",
    }))
  );
  const { processAssistant } = useAssistants();

  const handleFileChange = (fileObj: { file: File; key: string }) => {
    if (assistant.name === "cv-ranker") {
      const fileIndex = files.findIndex((f) => f.key === "cv_files");
      if (fileIndex !== -1) {
        const updatedFiles = [...files];
        updatedFiles.splice(fileIndex, 1);
        setFiles(updatedFiles);
      }
    }

    setFiles((prevFiles) => {
      const fileIndex = prevFiles.findIndex((f) => f.key === fileObj.key);
      if (fileIndex !== -1) {
        const updatedFiles = [...prevFiles];
        updatedFiles[fileIndex] = fileObj;

        return updatedFiles;
      } else {
        return [...prevFiles, fileObj];
      }
    });
  };

  const removeFileByKey = (key: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.key !== key));
  };

  const handleTextChange = (textObj: { text: string; key: string }) => {
    setTexts((prevTexts) => {
      const textIndex = prevTexts.findIndex((t) => t.key === textObj.key);
      if (textIndex !== -1) {
        const updatedTexts = [...prevTexts];
        updatedTexts[textIndex] = textObj;

        return updatedTexts;
      } else {
        return [...prevTexts, textObj];
      }
    });
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
          texts: texts.map((text) => ({
            key: text.key,
            value: text.text,
          })),
        },
        outputs: {
          email: {
            activated: emailOutput,
          },
          brain: {
            activated: false,
            value: "",
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
            {currentStep === "FIRST_STEP" && (
              <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Tutorial</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-col">
                    <span className="font-semibold">Job description</span>
                    {assistant.description}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {currentStep === "SECOND_STEP" && (
              <Alert>
                <RocketIcon className="h-4 w-4" />
                <AlertTitle>Tutorial</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-col">
                    <span className="font-semibold">CV Documents</span>
                    {assistant.input_description}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            {currentStep === "THIRD_STEP" && (
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
            {currentStep === "FIRST_STEP" && (
              <JobDescriptionStep
                defaultValue={
                  texts.find((text) => text.key === "job_description")?.text ??
                  ""
                }
                onTextChange={handleTextChange}
              />
            )}
            {currentStep === "SECOND_STEP" && (
              <CVFilesStep
                files={files}
                onFileChange={handleFileChange}
                onRemoveFile={removeFileByKey}
              />
            )}
            {currentStep === "THIRD_STEP" && (
              <OutputsStep setEmailOutput={setEmailOutput} />
            )}
          </div>
          <DialogFooter className="flex !self-end">
            {currentStep === "FIRST_STEP" && (
              <Button
                onClick={() => setCurrentStep("SECOND_STEP")}
                disabled={!!files.find((file) => !file.file)}
              >
                <span>Next</span>
                <CircleArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}

            {currentStep === "SECOND_STEP" && (
              <Button
                onClick={() => setCurrentStep("THIRD_STEP")}
                disabled={!!files.find((file) => !file.file)}
              >
                <span>Next</span>
                <CircleArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {currentStep === "THIRD_STEP" && (
              <Button
                onClick={() => void handleProcessAssistant()}
                disabled={!emailOutput}
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
