import { Fragment } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InputsStepProps {
  defaultValue: string;
  onTextChange: (fileObj: { text: string; key: string }) => void;
}

export const JobDescriptionStep = ({
  defaultValue,
  onTextChange,
}: InputsStepProps): JSX.Element => {
  return (
    <Fragment>
      <div className="flex flex-col gap-4 my-4">
        <Label htmlFor="job_description">Job Description*</Label>
        <Textarea
          id="job_description"
          name="job_description"
          className="w-full"
          placeholder="Enter the job description here"
          defaultValue={defaultValue}
          required
          rows={7}
          onChange={(e) =>
            onTextChange({ text: e.target.value, key: "job_description" })
          }
        />
      </div>
    </Fragment>
  );
};
