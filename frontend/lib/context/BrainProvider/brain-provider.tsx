"use client";

import { createContext } from "react";

import { useBrainProvider } from "@/lib/context/BrainProvider/hooks/useBrainProvider";
import { BrainContextType } from "@/lib/context/BrainProvider/types";

export const BrainContext = createContext<BrainContextType | undefined>(
  undefined
);

export const BrainProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const brainProviderUtils = useBrainProvider();

  return (
    <BrainContext.Provider value={brainProviderUtils}>
      {children}
    </BrainContext.Provider>
  );
};
