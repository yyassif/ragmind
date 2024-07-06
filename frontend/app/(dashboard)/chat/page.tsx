"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { ChatEntity } from "@/app/(dashboard)/chat/[chatId]/types";
import PageHeader from "@/components/partial/PageHeader";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs } from "@/components/ui/tabs";
import { useChatsContext } from "@/lib/context/ChatsProvider/hooks/useChatsContext";

import ChatItem from "./components/ChatItem/ChatItem";

export default function ChatsTablePage(): JSX.Element {
  const [chatSearch, setChatSearch] = useState<string>("");
  const [filteredChats, setFilteredChats] = useState<ChatEntity[]>([]);
  const { allChats } = useChatsContext();

  useEffect(() => {
    if (chatSearch.trim() === "") {
      setFilteredChats(allChats);
    } else {
      setFilteredChats(
        allChats.filter((chat) =>
          chat.chat_name
            .trim()
            .toLowerCase()
            .includes(chatSearch.trim().toLowerCase())
        )
      );
    }
  }, [chatSearch, allChats]);

  return (
    <Tabs defaultValue="all">
      <PageHeader title="Chats" showNotifications></PageHeader>
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8"
            />
          </div>
        </form>
      </div>
      <div className="m-0">
        <ScrollArea className="h-screen">
          <div className="flex flex-col gap-4 p-4 pt-0">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col space-y-2 text-center sm:text-left px-4 py-2">
                <h3 className="text-lg font-semibold">Ooups, no chats yet.</h3>
              </div>
            ) : (
              filteredChats.map((item) => (
                <ChatItem key={item.chat_id} chatItem={item} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Tabs>
  );
}
