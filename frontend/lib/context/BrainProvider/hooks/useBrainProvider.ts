/* eslint-disable max-lines */
import { UUID } from "crypto";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useBrainFetcher } from "@/app/(dashboard)/studio/[brainId]/BrainManagementTabs/hooks/useBrainFetcher";
import { CreateBrainInput } from "@/lib/api/brain/types";
import { useBrainApi } from "@/lib/api/brain/useBrainApi";
import { usePromptApi } from "@/lib/api/prompt/usePromptApi";
import { MinimalBrainForUser } from "@/lib/context/BrainProvider/types";
import { Prompt } from "@/lib/types/Prompt";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useBrainProvider = () => {
  const { createBrain, deleteBrain, getBrains } = useBrainApi();
  const { getPublicPrompts } = usePromptApi();
  const { t } = useTranslation(["delete_or_unsubscribe_from_brain"]);

  const [allBrains, setAllBrains] = useState<MinimalBrainForUser[]>([]);
  const [currentBrainId, setCurrentBrainId] = useState<null | UUID>(null);
  const [isFetchingBrains, setIsFetchingBrains] = useState(true);
  const [publicPrompts, setPublicPrompts] = useState<Prompt[]>([]);
  const [currentPromptId, setCurrentPromptId] = useState<null | string>(null);

  const currentPrompt = publicPrompts.find(
    (prompt) => prompt.id === currentPromptId
  );
  const currentBrain = allBrains.find((brain) => brain.id === currentBrainId);
  const { brain: currentBrainDetails } = useBrainFetcher({
    brainId: currentBrainId ?? undefined,
  });

  const fetchAllBrains = useCallback(async () => {
    setIsFetchingBrains(true);
    try {
      const brains = await getBrains();
      setAllBrains(brains);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingBrains(false);
    }
  }, [getBrains]);

  const createBrainHandler = useCallback(
    async (brain: CreateBrainInput): Promise<UUID | undefined> => {
      const createdBrain = await createBrain(brain);
      try {
        setCurrentBrainId(createdBrain.id);
        void fetchAllBrains();

        return createdBrain.id;
      } catch {
        toast.error("Error occurred while creating a brain");
      }
    },
    [createBrain, fetchAllBrains, toast]
  );

  const deleteBrainHandler = useCallback(
    async (id: UUID) => {
      await deleteBrain(id);
      setAllBrains((prevBrains) =>
        prevBrains.filter((brain) => brain.id !== id)
      );
      toast.success(t("successfully_deleted"));
    },
    [deleteBrain, toast]
  );

  const fetchPublicPrompts = useCallback(async () => {
    setPublicPrompts(await getPublicPrompts());
  }, [getPublicPrompts]);

  return {
    allBrains,
    fetchAllBrains,
    isFetchingBrains,

    currentBrain,
    currentBrainDetails,
    currentBrainId,
    setCurrentBrainId,

    fetchPublicPrompts,
    publicPrompts,
    currentPrompt,

    setCurrentPromptId,
    currentPromptId,

    createBrain: createBrainHandler,

    deleteBrain: deleteBrainHandler,
  };
};
