import { isAxiosError } from "axios";
import { UUID } from "crypto";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useBrainApi } from "@/lib/api/brain/useBrainApi";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { defineMaxTokens } from "@/lib/helpers/defineMaxTokens";
import { getAccessibleModels } from "@/lib/helpers/getAccessibleModels";
import { useUserData } from "@/lib/hooks/useUserData";

import { useBrainFormState } from "./useBrainFormState";

import { isBrainDescriptionValid } from "../utils/isBrainDescriptionValid";
import { isBrainNameValid } from "../utils/isBrainNameValid";

type UseSettingsTabProps = {
  brainId: UUID;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSettingsTab = ({ brainId }: UseSettingsTabProps) => {
  const { t } = useTranslation(["translation", "brain", "config"]);
  const [isUpdating, setIsUpdating] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { updateBrain } = useBrainApi();
  const { fetchAllBrains } = useBrainContext();
  const { userData } = useUserData();

  const { getValues, maxTokens, setValue, openAiKey, model } =
    useBrainFormState();

  const accessibleModels = getAccessibleModels({
    openAiKey,
    userData,
  });

  useEffect(() => {
    setValue("maxTokens", Math.min(maxTokens, defineMaxTokens(model)));
  }, [maxTokens, model, setValue]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        void handleSubmit();
      }
    };

    formRef.current?.addEventListener("keydown", handleKeyPress);

    return () => {
      formRef.current?.removeEventListener("keydown", handleKeyPress);
    };
  }, [formRef.current]);

  const handleSubmit = async () => {
    const { name, description } = getValues();

    if (
      !isBrainNameValid(name, toast, t) ||
      !isBrainDescriptionValid(description, toast, t)
    ) {
      return;
    }

    try {
      setIsUpdating(true);
      const { maxTokens: max_tokens, ...otherConfigs } = getValues();

      await updateBrain(brainId, {
        ...otherConfigs,
        max_tokens,
        prompt_id:
          otherConfigs["prompt_id"] !== ""
            ? otherConfigs["prompt_id"]
            : undefined,
      });
      toast.success(t("brainUpdated", { ns: "config" }));
      void fetchAllBrains();
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

  return {
    handleSubmit,
    isUpdating,
    formRef,
    accessibleModels,
    setIsUpdating,
  };
};
