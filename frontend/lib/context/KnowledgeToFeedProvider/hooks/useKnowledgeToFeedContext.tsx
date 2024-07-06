import { useContext } from "react";

import { FeedItemType } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/types";
import { KnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/knowledge-to-feed-provider";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKnowledgeToFeedContext = () => {
  const context = useContext(KnowledgeToFeedContext);

  const addKnowledgeToFeed = (knowledge: FeedItemType) => {
    context?.setKnowledgeToFeed((prevKnowledge) => [
      ...prevKnowledge,
      knowledge,
    ]);
  };

  const removeKnowledgeToFeed = (index: number) => {
    context?.setKnowledgeToFeed((prevKnowledge) => {
      const newKnowledge = [...prevKnowledge];
      newKnowledge.splice(index, 1);

      return newKnowledge;
    });
  };

  const removeAllKnowledgeToFeed = () => {
    context?.setKnowledgeToFeed([]);
  };

  if (context === undefined) {
    throw new Error("useKnowledge must be used inside KnowledgeToFeedProvider");
  }

  return {
    ...context,
    addKnowledgeToFeed,
    removeKnowledgeToFeed,
    removeAllKnowledgeToFeed,
  };
};
