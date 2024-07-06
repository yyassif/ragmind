import { ChangeEvent, useRef, useState } from "react";

import { Prompt } from "@/lib/types/Prompt";

type UsePublicPromptsListProps = {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSelect: ({ title, content }: { title: string; content: string }) => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePublicPromptsList = ({
  onChange,
  onSelect,
}: UsePublicPromptsListProps) => {
  const [selectedOption, setSelectedOption] = useState<Prompt | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: Prompt) => {
    setSelectedOption(option);
    onChange({
      target: { value: option.id },
    } as ChangeEvent<HTMLSelectElement>);
    onSelect({
      title: option.title,
      content: option.content,
    });
  };

  return {
    selectRef,
    selectedOption,
    handleOptionClick,
  };
};
