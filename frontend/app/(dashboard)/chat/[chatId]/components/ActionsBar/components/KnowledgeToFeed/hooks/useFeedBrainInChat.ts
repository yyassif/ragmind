import { useQueryClient } from "@tanstack/react-query";
import { UUID } from "crypto";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useFromConnectionsContext } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import { FeedItemCrawlType, FeedItemUploadType } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/types";
import { CHATS_DATA_KEY } from "@/lib/api/chat/config";
import { useChatApi } from "@/lib/api/chat/useChatApi";
import { useNotificationApi } from "@/lib/api/notification/useNotificationApi";
import { useKnowledgeToFeedInput } from "@/lib/components/KnowledgeToFeedInput/hooks/useKnowledgeToFeedInput.ts";
import { useChatContext } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { useOnboarding } from "@/lib/hooks/useOnboarding";


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useFeedBrainInChat = ({
  dispatchHasPendingRequests,
}: {
  dispatchHasPendingRequests: () => void;
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["upload"]);
  const router = useRouter();
  const { updateOnboarding, onboarding } = useOnboarding();
  const { setShouldDisplayFeedCard } = useKnowledgeToFeedContext();
  const { currentBrainId } = useBrainContext();
  const { setKnowledgeToFeed, knowledgeToFeed } = useKnowledgeToFeedContext();
  const [hasPendingRequests, setHasPendingRequests] = useState(false);
  const { createChat } = useChatApi();
  const params = useParams();
  const chatId = params.chatId as UUID | undefined;
  const { setNotifications } = useChatContext();
  const { getChatNotifications } = useNotificationApi();
  const fetchNotifications = async (currentChatId: UUID): Promise<void> => {
    const fetchedNotifications = await getChatNotifications(currentChatId);
    setNotifications(fetchedNotifications);
  };
  const { openedConnections } = useFromConnectionsContext();
  const { crawlWebsiteHandler, uploadFileHandler } = useKnowledgeToFeedInput();
  const files: File[] = (
    knowledgeToFeed.filter((c) => c.source === "upload") as FeedItemUploadType[]
  ).map((c) => c.file);
  const urls: string[] = (
    knowledgeToFeed.filter((c) => c.source === "crawl") as FeedItemCrawlType[]
  ).map((c) => c.url);
  const feedBrain = async (): Promise<void> => {
    if (currentBrainId === null) {
      toast.error(t("selectBrainFirst"));

      return;
    }
    if (knowledgeToFeed.length === 0 && !openedConnections.length) {
      toast.error(t("addFiles"));

      return;
    }
    try {
      dispatchHasPendingRequests();
      setShouldDisplayFeedCard(false);
      setHasPendingRequests(true);
      const currentChatId = chatId ?? (await createChat("New Chat")).chat_id;
      const uploadPromises = files.map((file) =>
        uploadFileHandler(file, currentBrainId, currentChatId)
      );
      const crawlPromises = urls.map((url) =>
        crawlWebsiteHandler(url, currentBrainId, currentChatId)
      );

      const updateOnboardingPromise = async () => {
        if (onboarding.onboarding_a) {
          await updateOnboarding({
            onboarding_a: false,
          });
        }
      };

      await Promise.all([
        ...uploadPromises,
        ...crawlPromises,
        updateOnboardingPromise(),
      ]);

      setKnowledgeToFeed([]);

      if (chatId === undefined) {
        void queryClient.invalidateQueries({
          queryKey: [CHATS_DATA_KEY],
        });
        void router.push(`/chat/${currentChatId}`);
      } else {
        await fetchNotifications(currentChatId);
      }
    } catch (e) {
      toast.error(JSON.stringify(e));
    } finally {
      setHasPendingRequests(false);
    }
  };

  return {
    feedBrain,
    hasPendingRequests,
  };
};
