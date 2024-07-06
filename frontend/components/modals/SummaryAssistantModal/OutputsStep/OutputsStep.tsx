import { InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { formatMinimalBrainsToSelectComponentInput } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/utils/formatMinimalBrainsToSelectComponentInput";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { requiredRolesForUpload } from "@/lib/config/upload";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

interface OutputsStepProps {
  setEmailOutput: (value: boolean) => void;
  setBrainOutput: (value: string) => void;
}

export const OutputsStep = ({
  setEmailOutput,
  setBrainOutput,
}: OutputsStepProps): JSX.Element => {
  const [existingBrainChecked, setExistingBrainChecked] =
    useState<boolean>(false);
  const [selectedBrainId, setSelectedBrainId] = useState<string>("");
  const { allBrains } = useBrainContext();

  const brainsWithUploadRights = formatMinimalBrainsToSelectComponentInput(
    useMemo(
      () =>
        allBrains.filter(
          (brain) =>
            requiredRolesForUpload.includes(brain.role) && !!brain.max_files
        ),
      [allBrains]
    )
  );

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
        <Label htmlFor="goal">Receive the results by Email</Label>
        <Switch checked={true} onCheckedChange={setEmailOutput} />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="goal">Upload the results on an existing Brain</Label>
        <Switch
          checked={existingBrainChecked}
          onCheckedChange={() => {
            if (existingBrainChecked) {
              setBrainOutput("");
              setSelectedBrainId("");
            }
            setExistingBrainChecked(!existingBrainChecked);
          }}
        />
      </div>
      {existingBrainChecked && (
        <div className="w-full">
          <Select
            name="brain"
            onValueChange={(brain) => {
              setBrainOutput(brain);
              setSelectedBrainId(brain);
            }}
            defaultValue={selectedBrainId}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a specific brain" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Brains list</SelectLabel>
                {brainsWithUploadRights.map((brain) => (
                  <SelectItem key={brain.value} value={brain.value}>
                    {brain.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
