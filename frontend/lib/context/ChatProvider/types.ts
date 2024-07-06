import {
  ChatMessage,
  Notification,
} from "@/app/(dashboard)/chat/[chatId]/types";
import { Model } from "@/lib/types/BrainConfig";

export type ChatConfig = {
  model: Model;
  temperature: number;
  maxTokens: number;
};

export type ChatContextProps = {
  messages: ChatMessage[];
  setMessages: (history: ChatMessage[]) => void;
  updateStreamingHistory: (streamedChat: ChatMessage) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  removeMessage: (id: string) => void;
};
