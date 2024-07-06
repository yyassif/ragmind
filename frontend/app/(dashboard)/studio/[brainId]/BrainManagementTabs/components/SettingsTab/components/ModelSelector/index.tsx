import { PopoverProps } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Fragment, useRef, useState } from "react";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { defineMaxTokens } from "@/lib/helpers/defineMaxTokens";
import { Model } from "@/lib/types/BrainConfig";
import { cn } from "@/lib/utils";

import { useBrainFormState } from "../../hooks/useBrainFormState";

interface ModelSelectorProps extends PopoverProps {
  brainModel: Model;
  handleSubmit: (checkDirty: boolean) => Promise<void>;
  hasEditRights: boolean;
  accessibleModels: Model[];
}

export default function ModelSelector({
  handleSubmit,
  hasEditRights,
  accessibleModels,
  brainModel,
  ...props
}: ModelSelectorProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<Model>(brainModel);
  const { model, maxTokens, setModel, setValue } = useBrainFormState();

  return (
    <Fragment>
      <div className="grid gap-2">
        <Label htmlFor="model">Model</Label>
        <Popover open={open} onOpenChange={setOpen} {...props}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a model"
              className="w-full justify-between"
            >
              {/* eslint-disable @typescript-eslint/no-unnecessary-condition */}
              {selectedModel ?? "Select a model..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[450px] p-0">
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="Search Models..." />
                <CommandEmpty>No Models found.</CommandEmpty>
                <CommandGroup heading="Models">
                  {accessibleModels.map((item) => (
                    <ModelItem
                      key={item}
                      model={item}
                      isSelected={selectedModel === item}
                      onSelect={() => {
                        try {
                          if (item !== selectedModel && !updating) {
                            setUpdating(true);
                            setValue("model", item);
                            setSelectedModel(item);
                            setModel(item);
                            void handleSubmit(false);
                            setOpen(false);
                            setUpdating(false);
                          }
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                    />
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-2 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="maxTokens">Max. Tokens Length</Label>
          <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
            {maxTokens}
          </span>
        </div>
        <Controller
          name="maxTokens"
          defaultValue={maxTokens}
          render={({ field }) => (
            <Slider
              id="maxTokens"
              min={10}
              max={defineMaxTokens(model)}
              value={[field.value]}
              step={10}
              onValueChange={(e) => field.onChange(e.at(0))}
              className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Model Maximum Tokens"
              disabled={!hasEditRights}
            />
          )}
        />
      </div>
    </Fragment>
  );
}

interface ModelItemProps {
  model: Model;
  isSelected: boolean;
  onSelect: () => void;
}

function ModelItem({ model, isSelected, onSelect }: ModelItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <CommandItem
      key={model}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {model}
      <Check
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
}
