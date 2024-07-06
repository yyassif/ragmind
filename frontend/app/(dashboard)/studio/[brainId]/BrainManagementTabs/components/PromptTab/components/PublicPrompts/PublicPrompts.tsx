import { PopoverProps } from "@radix-ui/react-popover";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { ChangeEvent, useState } from "react";

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
import { Prompt } from "@/lib/types/Prompt";
import { cn } from "@/lib/utils";

import { usePublicPromptsList } from "./hooks/usePublicPromptsList";

interface PublicPromptsProps extends PopoverProps {
  prompts: Prompt[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSelect: ({ title, content }: { title: string; content: string }) => void;
}

export const PublicPrompts = ({
  prompts,
  onChange,
  onSelect,
  ...props
}: PublicPromptsProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const { handleOptionClick, selectedOption } = usePublicPromptsList({
    onChange,
    onSelect,
  });

  return (
    <div className="grid gap-2">
      <Label htmlFor="prompt">Prompt</Label>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a prompt"
            className="w-full justify-between"
          >
            {selectedOption?.id
              ? selectedOption.title
              : "Select a RAGMind prompt..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <Command loop>
            <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
              <CommandInput placeholder="Search for prompts..." />
              <CommandEmpty>Oops, No prompts found.</CommandEmpty>
              <CommandGroup heading="Prompts">
                {prompts.map((prompt) => (
                  <PromptItem
                    key={prompt.id}
                    prompt={prompt}
                    isSelected={selectedOption?.id === prompt.id}
                    onSelect={() => {
                      handleOptionClick(prompt);
                      setOpen(false);
                    }}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface PromptItemProps {
  prompt: Prompt;
  isSelected: boolean;
  onSelect: () => void;
}

function PromptItem({
  prompt,
  isSelected,
  onSelect,
}: PromptItemProps): JSX.Element {
  return (
    <CommandItem
      key={prompt.id}
      onSelect={onSelect}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {prompt.title}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0"
        )}
      />
    </CommandItem>
  );
}
