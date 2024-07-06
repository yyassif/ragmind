import { Bot, Brain, Globe, LucideIcon, Paperclip } from "lucide-react";

import { BrainType } from "@/lib/types/BrainConfig";
type GetBrainIconFromBrainTypeOptions = {
  iconSize?: number;
  ApiBrainIcon?: LucideIcon;
  DocBrainIcon?: LucideIcon;
  iconClassName?: string;
};

export const getBrainIconFromBrainType = (
  brainType?: BrainType,
  options?: GetBrainIconFromBrainTypeOptions
): JSX.Element => {
  const iconSize = options?.iconSize ?? 38;

  const ApiBrainIcon = options?.ApiBrainIcon ?? Globe;
  const DocBrainIcon = options?.DocBrainIcon ?? Paperclip;

  if (brainType === undefined) {
    return <Brain size={iconSize} className={options?.iconClassName} />;
  }
  if (brainType === "api") {
    return <ApiBrainIcon size={iconSize} className={options?.iconClassName} />;
  }

  if (brainType === "composite") {
    return <Bot size={iconSize} className={options?.iconClassName} />;
  }

  return <DocBrainIcon size={iconSize} className={options?.iconClassName} />;
};
