import { InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OutputsStepProps {
  setEmailOutput: (value: boolean) => void;
}

export const OutputsStep = ({
  setEmailOutput,
}: OutputsStepProps): JSX.Element => {
  return (
    <div className="flex flex-col gap-2">
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          <span className="font-semibold">
            It can take a few minutes to process.
          </span>
        </AlertDescription>
      </Alert>
      <div className="grid gap-1">
        <Label htmlFor="goal">Receive the results via Email</Label>
        <Switch checked={true} onCheckedChange={setEmailOutput} />
      </div>
    </div>
  );
};
