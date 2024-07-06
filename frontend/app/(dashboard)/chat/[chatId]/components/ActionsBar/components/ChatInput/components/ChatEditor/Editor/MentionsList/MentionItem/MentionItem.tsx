import Image from "next/image";

import { Icon } from "@/lib/components/ui/Icon/Icon";
import { cn } from "@/lib/utils";

import { SuggestionDataType, SuggestionItem } from "../../types";

type MentionItemProps = {
  item: SuggestionItem;
  type: SuggestionDataType;
  isSelected: boolean;
  onClick: () => void;
};

export const MentionItem = ({
  item,
  onClick,
  isSelected,
}: MentionItemProps): JSX.Element => {
  return (
    <button
      className={cn(
        "flex cursor-pointer gap-3 w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm text-novel-900 hover:bg-slate-200 dark:hover:bg-slate-700",
        isSelected && "bg-slate-200 font-semibold dark:bg-slate-700"
      )}
      key={item.id}
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-900 dark:bg-slate-800">
        {item.iconUrl ? (
          <Image
            src={item.iconUrl}
            width={40}
            height={40}
            alt="logo_url"
            className="dark:invert"
          />
        ) : (
          <Icon color="primary" size="normal" name="brain" />
        )}
      </div>
      <div>
        <p className="font-medium">{item.label}</p>
      </div>
    </button>
  );
};
