import { createContext, useState } from "react";

type UserSettingsContextType = {
  remainingCredits: number | null;
  setRemainingCredits: React.Dispatch<React.SetStateAction<number | null>>;
};

export const UserSettingsContext = createContext<
  UserSettingsContextType | undefined
>(undefined);

export const UserSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);

  return (
    <UserSettingsContext.Provider
      value={{
        remainingCredits,
        setRemainingCredits,
      }}
    >
      {children}
    </UserSettingsContext.Provider>
  );
};
