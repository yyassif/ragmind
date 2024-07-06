/* eslint-disable max-lines */
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { CHATS_DATA_KEY } from "@/lib/api/chat/config";
import { useChatApi } from "@/lib/api/chat/useChatApi";
import { useChatContext } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { getChatNameFromQuestion } from "@/lib/helpers/getChatNameFromQuestion";

import { useLocalStorageChatConfig } from "./useLocalStorageChatConfig";
import { useQuestion } from "./useQuestion";

import { ChatQuestion } from "../types";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useChat = () => {
  const queryClient = useQueryClient();

  const params = useParams();
  const [chatId, setChatId] = useState<string | undefined>(
    params.chatId as string | undefined
  );
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const router = useRouter();
  const { messages } = useChatContext();
  const { currentBrain, currentPromptId } = useBrainContext();
  const { createChat } = useChatApi();
  const {
    chatConfig: { model, maxTokens, temperature },
  } = useLocalStorageChatConfig();

  const { addStreamQuestion } = useQuestion();
  const { t } = useTranslation(["chat"]);

  const addQuestion = async (question: string, callback?: () => void) => {
    if (question === "") {
      return toast.error(t("ask"));
    }

    try {
      setGeneratingAnswer(true);

      let currentChatId = chatId;

      //if chatId is not set, create a new chat. Chat name is from the first question
      if (currentChatId === undefined) {
        const chat = await createChat(getChatNameFromQuestion(question));
        currentChatId = chat.chat_id;
        setChatId(currentChatId);
        router.push(`/chat/${currentChatId}`);
        void queryClient.invalidateQueries({
          queryKey: [CHATS_DATA_KEY],
        });
      }

      const chatQuestion: ChatQuestion = {
        model, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        question,
        temperature: temperature,
        max_tokens: maxTokens,
        brain_id: currentBrain?.id,
        prompt_id: currentPromptId ?? undefined,
      };

      callback?.();
      await addStreamQuestion(currentChatId, chatQuestion);
    } catch (error) {
      console.error({ error });

      if ((error as AxiosError).response?.status === 429) {
        return toast.error(t("limit_reached", { ns: "chat" }));
      }

      toast.error(t("error_occurred", { ns: "chat" }));
    } finally {
      setGeneratingAnswer(false);
    }
  };

  return {
    messages,
    addQuestion,
    generatingAnswer,
    chatId,
  };
};
