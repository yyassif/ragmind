import { AnimatePresence } from "framer-motion";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

import { ChatItemWithGroupedNotifications } from "@/app/(dashboard)/chat/[chatId]/components/ChatDialogueArea/types";
import { useOnboarding } from "@/lib/hooks/useOnboarding";

import { ChatItem } from "./components";
import { useChatDialogue } from "./hooks/useChatDialogue";
import { getKeyFromChatItem } from "./utils/getKeyFromChatItem";

type MessagesDialogueProps = {
  chatItems: ChatItemWithGroupedNotifications[];
};

export const ChatDialogue = ({
  chatItems,
}: MessagesDialogueProps): JSX.Element => {
  const { t } = useTranslation(["chat"]);
  const { chatListRef } = useChatDialogue();

  const { shouldDisplayOnboardingAInstructions } = useOnboarding();

  return (
    <div
      ref={chatListRef}
      className="flex flex-col flex-1 overflow-y-auto mb-10"
    >
      <AnimatePresence>
        {shouldDisplayOnboardingAInstructions ? (
          <Fragment>
            <div className="flex flex-col gap-3">
              {chatItems.map((chatItem, index) => (
                <ChatItem
                  index={index}
                  content={chatItem}
                  key={getKeyFromChatItem(chatItem)}
                />
              ))}
            </div>
          </Fragment>
        ) : chatItems.length === 0 ? (
          <div
            data-testid="empty-history-message"
            className="text-center opacity-50"
          >
            {t("ask", { ns: "chat" })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chatItems.map((chatItem, index) => (
              <ChatItem
                index={index}
                content={chatItem}
                key={getKeyFromChatItem(chatItem)}
                lastMessage={index === chatItems.length - 1}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
