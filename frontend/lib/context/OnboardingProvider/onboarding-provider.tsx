import { createContext, useEffect, useState } from "react";

import { useUserData } from "@/lib/hooks/useUserData";

export type OnboardingContextType = {
  isOnboardingModalOpened: boolean;
  setIsOnboardingModalOpened: React.Dispatch<React.SetStateAction<boolean>>;
  isBrainCreated: boolean;
  setIsBrainCreated: React.Dispatch<React.SetStateAction<boolean>>;
};
export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [isOnboardingModalOpened, setIsOnboardingModalOpened] =
    useState<boolean>(false);
  const [isBrainCreated, setIsBrainCreated] = useState<boolean>(false);
  const { userIdentityData } = useUserData();

  useEffect(() => {
    if (userIdentityData) {
      setIsOnboardingModalOpened(!userIdentityData.username);
    }
  }, [userIdentityData]);

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingModalOpened,
        setIsOnboardingModalOpened,
        isBrainCreated,
        setIsBrainCreated,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
