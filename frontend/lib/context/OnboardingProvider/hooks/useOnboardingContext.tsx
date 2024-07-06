import { useContext } from "react";

import {
  OnboardingContext,
  OnboardingContextType,
} from "../onboarding-provider";

export const useOnboardingContext = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (context === undefined) {
    throw new Error(
      "useOnboardingContext must be used within a OnboardingProvider"
    );
  }

  return context;
};
