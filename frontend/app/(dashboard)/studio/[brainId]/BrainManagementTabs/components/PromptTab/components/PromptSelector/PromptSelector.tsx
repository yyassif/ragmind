import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { usePrompt, UsePromptProps } from "../../hooks/usePrompt";
import { PublicPrompts } from "../PublicPrompts/PublicPrompts";
import { usePublicPrompts } from "../PublicPrompts/hooks/usePublicPrompts";

type PromptSelectorProps = {
  usePromptProps: UsePromptProps;
  isUpdatingBrain: boolean;
};

export const PromptSelector = ({
  isUpdatingBrain,
  usePromptProps,
}: PromptSelectorProps): JSX.Element => {
  const {
    pickPublicPrompt,
    submitPrompt,
    promptId,
    isRemovingPrompt,
    removeBrainPrompt,
  } = usePrompt(usePromptProps);

  const { handleChange, publicPrompts } = usePublicPrompts({
    onSelect: pickPublicPrompt,
  });

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col space-y-4">
        <PublicPrompts
          prompts={publicPrompts}
          onChange={handleChange}
          onSelect={pickPublicPrompt}
        />
        <div className="flex flex-col space-y-2">
          <Label htmlFor="prompt_title">Prompt title *</Label>
          <Controller
            name="prompt.title"
            defaultValue=""
            render={({ field }) => (
              <Input
                type="text"
                id="prompt_title"
                placeholder="Choose a name for your prompt"
                value={field.value as string}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="prompt_content">Prompt Instructions *</Label>
          <Controller
            name="prompt.content"
            defaultValue=""
            render={({ field }) => (
              <Textarea
                id="prompt_content"
                placeholder="Write specific instructions for your brain here"
                value={field.value as string}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </div>
      </div>
      <div
        className={cn(
          "flex items-center space-x-2",
          promptId !== "" ? "justify-between" : "justify-end"
        )}
      >
        {promptId !== "" && (
          <Button
            variant="destructive"
            disabled={isUpdatingBrain || isRemovingPrompt}
            onClick={() => void removeBrainPrompt()}
          >
            Remove Prompt
          </Button>
        )}
        <Button onClick={() => void submitPrompt()}>Save Prompt</Button>
      </div>
    </div>
  );
};
