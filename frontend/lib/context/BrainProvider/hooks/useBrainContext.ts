import { useContext } from "react";

import { BrainContext } from "@/lib/context/BrainProvider/brain-provider";
import { BrainContextType } from "@/lib/context/BrainProvider/types";

export const useBrainContext = (): BrainContextType => {
  const context = useContext(BrainContext);

  if (context === undefined) {
    throw new Error("useBrainContext must be used inside BrainProvider");
  }

  return context;
};
