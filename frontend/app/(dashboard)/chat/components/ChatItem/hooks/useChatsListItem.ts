import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { ChatEntity } from "@/app/(dashboard)/chat/[chatId]/types";
import { useChatApi } from "@/lib/api/chat/useChatApi";
import { useChatsContext } from "@/lib/context/ChatsProvider/hooks/useChatsContext";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChatsListItem = (chat: ChatEntity) => {
  const pathname = usePathname().split("/").at(-1);
  const selected = chat.chat_id === pathname;
  const [chatName, setChatName] = useState(chat.chat_name);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { updateChat, deleteChat } = useChatApi();
  const { setAllChats } = useChatsContext();
  const router = useRouter();
  const { t } = useTranslation(["chat"]);

  const deleteChatHandler = async () => {
    const chatId = chat.chat_id;
    setIsDeleting(true);
    try {
      await deleteChat(chatId);
      setAllChats((chats) =>
        chats.filter((currentChat) => currentChat.chat_id !== chatId)
      );
      // TODO: Change route only when the current chat is being deleted
      if (selected) {
        void router.push("/search");
      }
      toast.success(t("chatDeleted", { id: chatId, ns: "chat" }));
    } catch (error) {
      console.error(t("errorDeleting", { error: error, ns: "chat" }));
      toast.error(t("errorDeleting", { error: error, ns: "chat" }));
    }
    setIsDeleting(false);
  };

  const updateChatName = async () => {
    if (chatName !== chat.chat_name) {
      setIsUpdating(true);
      await updateChat(chat.chat_id, { chat_name: chatName });
      toast.success(t("chatNameUpdated", { ns: "chat" }));
      setIsUpdating(false);
    }
  };

  return {
    setChatName,
    isUpdating,
    chatName,
    selected,
    isDeleting,
    updateChat: updateChatName,
    deleteChat: deleteChatHandler,
  };
};
