import { SuggestionKeyDownProps } from "@tiptap/suggestion";
import { PlusCircle } from "lucide-react";
import { forwardRef } from "react";

import { useBrainCreationContext } from "@/components/modals/AddBrainModal/brain-creation-provider";

import { MentionItem } from "./MentionItem/MentionItem";
import { useMentionList } from "./hooks/useMentionList";
import { MentionListProps } from "./types";

export type MentionListRef = {
  onKeyDown: (event: SuggestionKeyDownProps) => boolean;
};

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const { selectItem, selectedIndex, isBrain } = useMentionList({
      ...props,
      ref,
    });

    const { setIsBrainCreationModalOpened } = useBrainCreationContext();

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <div
        className="flex bg-white flex-col max-w-96 px-1 py-2 shadow-md rounded-md gap-2 max-h-96 border-slate-200 dark:border-slate-800 dark:bg-slate-900 border overflow-y-auto transition-all"
        onClick={handleClick}
      >
        {props.suggestionData.items.map((item, index) => (
          <MentionItem
            key={item.id}
            item={item}
            isSelected={index === selectedIndex}
            onClick={() => selectItem(index)}
            type={props.suggestionData.type}
          />
        ))}

        {isBrain && (
          <button
            className="flex cursor-pointer gap-3 w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-novel-900 hover:bg-slate-200 dark:hover:bg-slate-700"
            data-testid="add-brain-button"
            onClick={() => setIsBrainCreationModalOpened(true)}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 dark:border-slate-900 dark:bg-slate-800">
              <PlusCircle className="text-xl" />
            </div>
            <div>
              <p className="font-medium">Create new Brain</p>
            </div>
          </button>
        )}
      </div>
    );
  }
);

MentionList.displayName = "MentionList";
