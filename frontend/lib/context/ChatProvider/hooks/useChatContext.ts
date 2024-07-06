import { useContext } from "react";

import { ChatContext } from "@/lib/context/ChatProvider/chat-provider";
import { ChatContextProps } from "@/lib/context/ChatProvider/types";

export const useChatContext = (): ChatContextProps => {
  const context = useContext(ChatContext);

  if (context === undefined) {
    throw new Error("useChatContext must be used inside ChatProvider");
  }

  return context;
};
