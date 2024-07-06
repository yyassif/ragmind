import {
  ChatMessageItem,
  Notification,
} from "@/app/(dashboard)/chat/[chatId]/types";

export type ChatItemWithGroupedNotifications =
  | ChatMessageItem
  | {
      item_type: "NOTIFICATION";
      body: Notification[];
    };
