"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useKnowledgeApi } from "@/lib/api/knowledge/useKnowledgeApi";
import { useUrlBrain } from "@/lib/hooks/useBrainIdFromUrl";
import { Knowledge } from "@/lib/types/Knowledge";

import { useKnowledge } from "../../../hooks/useKnowledge";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKnowledgeItem = () => {
  const { t } = useTranslation(["explore"]);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { deleteKnowledge } = useKnowledgeApi();
  const { brainId, brain } = useUrlBrain();
  const { invalidateKnowledgeDataKey } = useKnowledge({
    brainId,
  });

  const onDeleteKnowledge = async (knowledge: Knowledge) => {
    setIsDeleting(true);
    const knowledge_name =
      "fileName" in knowledge ? knowledge.fileName : knowledge.url;
    try {
      if (brainId === undefined) {
        throw new Error(t("noBrain", { ns: "explore" }));
      }
      await deleteKnowledge({
        brainId,
        knowledgeId: knowledge.id,
      });
      invalidateKnowledgeDataKey();
      toast.success(
        t("deleted", {
          fileName: knowledge_name,
          brain: brain?.name,
          ns: "explore",
        })
      );
    } catch (error) {
      toast.warning(
        t("errorDeleting", { fileName: knowledge_name, ns: "explore" })
      );
      console.error("Error deleting", error);
    }
    setIsDeleting(false);
  };

  return {
    isDeleting,
    onDeleteKnowledge,
  };
};
