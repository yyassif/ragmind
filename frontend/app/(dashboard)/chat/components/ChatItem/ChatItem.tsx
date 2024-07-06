"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { ChatEntity } from "@/app/(dashboard)/chat/[chatId]/types";
import { Card, CardTitle } from "@/components/ui/card";
import emailTimeAgo from "@/lib/helpers/emailTimeAgo";

import DeleteChatButton from "./components/DeleteChatDialog";
import EditChatButton from "./components/EditChatDialog";
import { useChatsListItem } from "./hooks/useChatsListItem";

type ChatItemProps = {
  chatItem: ChatEntity;
};

export default function ChatItem({ chatItem }: ChatItemProps): JSX.Element {
  const {
    chatName,
    updateChat,
    deleteChat,
    isUpdating,
    isDeleting,
    setChatName,
  } = useChatsListItem(chatItem);

  return (
    <Card className="group flex items-center justify-between p-3 hover:bg-gray-100/20 cursor-pointer transition-colors">
      <div className="flex-1 grow flex-col w-full">
        <Link href={`/chat/${chatItem.chat_id}`}>
          <CardTitle className="text-md font-bold">{chatName.trim()}</CardTitle>
          <p className="text-sm text-gray-500">
            {emailTimeAgo(new Date(chatItem.creation_time))}
          </p>
        </Link>
      </div>
      <div className="flex items-center space-x-2.5">
        <EditChatButton
          initialChatName={chatName}
          onChange={(name) => setChatName(name)}
          onConfirm={() => void updateChat()}
          isLoading={isUpdating}
        />
        <DeleteChatButton
          onConfirm={() => void deleteChat()}
          isLoading={isDeleting}
        />
        <Link href={`/chat/${chatItem.chat_id}`}>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </Link>
      </div>
    </Card>
  );
}
