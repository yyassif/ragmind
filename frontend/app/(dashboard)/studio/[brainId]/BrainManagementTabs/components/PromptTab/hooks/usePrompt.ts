/* eslint-disable max-lines */
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useBrainApi } from "@/lib/api/brain/useBrainApi";
import { usePromptApi } from "@/lib/api/prompt/usePromptApi";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

import { useBrainFormState } from "../../SettingsTab/hooks/useBrainFormState";

export type UsePromptProps = {
  setIsUpdating: (isUpdating: boolean) => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const usePrompt = (props: UsePromptProps) => {
  const { t } = useTranslation(["translation", "brain", "config"]);
  const { updateBrain } = useBrainApi();
  const { getPrompt, updatePrompt, createPrompt } = usePromptApi();
  const [isRemovingPrompt, setIsRemovingPrompt] = useState(false);
  const { fetchAllBrains } = useBrainContext();
  const {
    dirtyFields,
    getValues,
    register,
    reset,
    setValue,
    resetField,
    promptId,
    refetchBrain,
    brainId,
  } = useBrainFormState();

  const { setIsUpdating } = props;

  const [currentPromptId, setCurrentPromptId] = useState<string | undefined>(
    promptId
  );

  useEffect(() => {
    setCurrentPromptId(promptId);
  }, [promptId]);

  const fetchPrompt = async () => {
    if (currentPromptId === "" || currentPromptId === undefined) {
      return;
    }

    const prompt = await getPrompt(currentPromptId);
    if (prompt === undefined) {
      return;
    }
    setValue("prompt", prompt);
  };
  useEffect(() => {
    void fetchPrompt();
  }, [currentPromptId]);

  const removeBrainPrompt = async () => {
    if (brainId === undefined) {
      return;
    }
    try {
      setIsRemovingPrompt(true);
      await updateBrain(brainId, {
        prompt_id: null,
      });
      setValue("prompt", {
        title: "",
        content: "",
      });
      reset();
      refetchBrain();
      toast.success(t("promptRemoved", { ns: "config" }));
      setCurrentPromptId(undefined);
    } catch (err) {
      toast.error(t("errorRemovingPrompt", { ns: "config" }));
    } finally {
      setIsRemovingPrompt(false);
    }
  };

  const promptHandler = async () => {
    const { prompt } = getValues();

    if (dirtyFields["prompt"] && promptId !== undefined) {
      await updatePrompt(promptId, {
        title: prompt.title,
        content: prompt.content,
      });
    }
  };

  // eslint-disable-next-line complexity
  const submitPrompt = async () => {
    const { prompt, maxTokens: max_tokens, ...otherConfigs } = getValues();

    if (!dirtyFields["prompt"]) {
      return;
    }

    if (prompt.content === "" || prompt.title === "") {
      return toast.warning(t("promptFieldsRequired", { ns: "config" }));
    }

    if (brainId === undefined) {
      return;
    }

    try {
      if (promptId === "" || promptId === undefined) {
        otherConfigs["prompt_id"] = (
          await createPrompt({
            title: prompt.title,
            content: prompt.content,
          })
        ).id;

        await updateBrain(brainId, {
          ...otherConfigs,
          max_tokens,
        });
        refetchBrain();
      } else {
        await Promise.all([
          updateBrain(brainId, {
            ...otherConfigs,
            max_tokens,
          }),
          promptHandler(),
        ]);
      }
      void fetchAllBrains();
      toast.success(t("brainUpdated", { ns: "config" }));
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 429) {
        toast.error(
          `${JSON.stringify(
            (
              err.response as {
                data: { detail: string };
              }
            ).data.detail
          )}`
        );
      } else {
        toast.error(`${JSON.stringify(err)}`);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const pickPublicPrompt = ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }): void => {
    setValue("prompt.title", title, {
      shouldDirty: true,
    });
    setValue("prompt.content", content, {
      shouldDirty: true,
    });
  };

  return {
    register,
    pickPublicPrompt,
    submitPrompt,
    removeBrainPrompt,
    setValue,
    isRemovingPrompt,
    promptId,
    dirtyFields,
    resetField,
  };
};
