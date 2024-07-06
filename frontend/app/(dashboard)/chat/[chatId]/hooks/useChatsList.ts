import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { CHATS_DATA_KEY } from "@/lib/api/chat/config";
import { useChatApi } from "@/lib/api/chat/useChatApi";
import { useChatsContext } from "@/lib/context/ChatsProvider/hooks/useChatsContext";
import { useSupabase } from "@/lib/context/SupabaseProvider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChatsList = () => {
  const { t } = useTranslation(["chat"]);

  const { setAllChats, setIsLoading } = useChatsContext();
  const { getChats } = useChatApi();
  const { session } = useSupabase();

  const fetchAllChats = async () => {
    if (session) {
      try {
        const response = await getChats();

        return response.reverse();
      } catch (error) {
        console.error(error);
        toast.error(t("errorFetching", { ns: "chat" }));
      }
    }
  };

  const { data: chats, isLoading } = useQuery({
    queryKey: [CHATS_DATA_KEY],
    queryFn: fetchAllChats,
  });

  useEffect(() => {
    setAllChats(chats ?? []);
  }, [chats]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);
};
