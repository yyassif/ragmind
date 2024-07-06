import { useContext } from "react";

import { ChatsContext } from "@/lib/context/ChatsProvider/chats-provider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChatsContext = () => {
  const context = useContext(ChatsContext);

  if (context === undefined) {
    throw new Error("useChatsContext must be used inside ChatsProvider");
  }

  return context;
};
