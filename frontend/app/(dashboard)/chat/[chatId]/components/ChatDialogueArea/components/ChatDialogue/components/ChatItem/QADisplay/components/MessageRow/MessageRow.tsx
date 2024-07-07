/*eslint complexity: ["error", 15]*/

import { motion } from "framer-motion";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useChatInput } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/ChatInput/hooks/useChatInput";
import { useChat } from "@/app/(dashboard)/chat/[chatId]/hooks/useChat";
import { useChatApi } from "@/lib/api/chat/useChatApi";
import { CopyButton } from "@/lib/components/ui/CopyButton";
import { Icon } from "@/lib/components/ui/Icon/Icon";
import { Source } from "@/lib/types/MessageMetadata";
import { cn } from "@/lib/utils";

import { MessageContent } from "./components/MessageContent/MessageContent";
import { QuestionBrain } from "./components/QuestionBrain/QuestionBrain";
import { useMessageRow } from "./hooks/useMessageRow";

type MessageRowProps = {
  speaker: "user" | "assistant";
  text?: string;
  brainName?: string | null;
  children?: React.ReactNode;
  metadata?: {
    sources?: Source[];
    thoughts?: string;
    followup_questions?: string[];
  };
  brainId?: string;
  index?: number;
  messageId?: string;
  thumbs?: boolean;
  lastMessage?: boolean;
};

export const MessageRow = ({
  speaker,
  index,
  text,
  brainName,
  children,
  brainId,
  messageId,
  thumbs: initialThumbs,
  metadata,
  lastMessage,
}: MessageRowProps): JSX.Element => {
  const { handleCopy, isUserSpeaker } = useMessageRow({
    speaker,
    text,
  });
  const { updateChatMessage } = useChatApi();
  const { chatId } = useChat();
  const [thumbs, setThumbs] = useState<boolean | undefined | null>(
    initialThumbs
  );
  const { submitQuestion } = useChatInput();

  useEffect(() => {
    setThumbs(initialThumbs);
  }, [initialThumbs, metadata]);

  const messageContent = text ?? "";

  const thumbsUp = async () => {
    if (chatId && messageId) {
      await updateChatMessage(chatId, messageId, {
        thumbs: thumbs ? null : true,
      });
      setThumbs(thumbs ? null : true);
    }
  };

  const thumbsDown = async () => {
    if (chatId && messageId) {
      await updateChatMessage(chatId, messageId, {
        thumbs: thumbs === false ? null : false,
      });
      setThumbs(thumbs === false ? null : false);
    }
  };

  const renderMetadata = () => {
    if (!isUserSpeaker && messageContent !== "🧠") {
      return (
        <div className="flex flex-col gap-2 left-1 top-[calc(100%_+_0.5rem)]">
          <div className="flex gap-3 w-full justify-end py-2">
            <CopyButton handleCopy={handleCopy} />
            <ThumbsUp
              className={cn(
                "w-4 h-4 cursor-pointer",
                thumbs === true && "text-green-600"
              )}
              onClick={() => void thumbsUp()}
            />
            <ThumbsDown
              className={cn(
                "w-4 h-4 cursor-pointer",
                thumbs === false && "text-orange-600"
              )}
              onClick={() => void thumbsDown()}
            />
          </div>
        </div>
      );
    }
  };

  const renderRelatedQuestions = () => {
    if (!isUserSpeaker && (metadata?.followup_questions?.length ?? 0) > 0) {
      return (
        <div className="flex flex-col gap-2 p-0.5">
          <div className="flex items-center gap-2">
            <Icon name="search" color="black" size="normal" />
            <span className="text-lg font-medium">Follow up questions</span>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            {metadata?.followup_questions?.map((question, idx) => (
              <div
                className="flex items-center gap-2"
                key={idx}
                onClick={() => submitQuestion(question)}
              >
                <Icon name="followUp" size="small" color="grey" />
                <span className="text-slate-400 transition-[color] duration-[0.5s] ease-[ease] hover:text-foreground hover:cursor-pointer">
                  {question}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: Number(index) * 0.05 + 0.2,
        },
      }}
      style={{
        originX: 0.5,
        originY: 0.5,
      }}
      className={cn(
        "flex flex-col gap-2 relative pr-4 pb-4 whitespace-pre-wrap",
        isUserSpeaker ? "text-3xl font-medium border-b-[none]" : "",
        messageContent.length > 100 && isUserSpeaker ? "text-lg" : "",
        lastMessage ? "border-b-[none]" : ""
      )}
    >
      {!isUserSpeaker && (
        <div className="overflow-hidden">
          <div className="flex gap-3 items-baseline text-lg font-medium">
            <QuestionBrain brainName={brainName} brainId={brainId} />
          </div>
        </div>
      )}
      <div
        className={cn(
          isUserSpeaker ? "w-fit rounded-xl p-0.5" : "self-start relative p-0"
        )}
      >
        {children ?? (
          <MessageContent text={messageContent} isUser={isUserSpeaker} />
        )}
      </div>
      {renderMetadata()}
      {renderRelatedQuestions()}
    </motion.div>
  );
};
