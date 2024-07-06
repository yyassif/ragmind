import { ChatItemWithGroupedNotifications } from "@/app/(dashboard)/chat/[chatId]/components/ChatDialogueArea/types";

export const getKeyFromChatItem = (
  chatItem: ChatItemWithGroupedNotifications
): string => {
  if (chatItem.item_type === "MESSAGE") {
    return chatItem.body.message_id;
  } else {
    return chatItem.body[0].id;
  }
};
