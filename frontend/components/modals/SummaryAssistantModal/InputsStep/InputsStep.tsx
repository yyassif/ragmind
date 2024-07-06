import { capitalCase } from "change-case";
import { Fragment } from "react";

import { AssistantInputs } from "@/lib/api/assistants/types";

import { FileInput } from "./components/FileInput/FileInput";

interface InputsStepProps {
  inputs: AssistantInputs;
  onFileChange: (file: File, inputKey: string) => void; //
}

export const InputsStep = ({
  inputs,
  onFileChange,
}: InputsStepProps): JSX.Element => {
  return (
    <Fragment>
      {inputs.files.map((fileInput) => (
        <FileInput
          key={fileInput.key}
          label={capitalCase(fileInput.key)}
          acceptedFileTypes={fileInput.allowed_extensions}
          onFileChange={(file) => onFileChange(file, fileInput.key)}
        />
      ))}
    </Fragment>
  );
};
