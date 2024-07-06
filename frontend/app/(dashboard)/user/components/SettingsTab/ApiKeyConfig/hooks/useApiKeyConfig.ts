/* eslint-disable max-lines */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthApi } from "@/lib/api/auth/useAuthApi";
import { USER_IDENTITY_DATA_KEY } from "@/lib/api/user/config";
import { useUserApi } from "@/lib/api/user/useUserApi";
import { UserIdentity } from "@/lib/api/user/user";
import copyToClipboard from "@/lib/helpers/copyToClipboard";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [openAiApiKey, setOpenAiApiKey] = useState<string | null>();
  const [
    changeOpenAiApiKeyRequestPending,
    setChangeOpenAiApiKeyRequestPending,
  ] = useState(false);
  const { updateUserIdentity, getUserIdentity } = useUserApi();
  const { createApiKey } = useAuthApi();
  const [userIdentity, setUserIdentity] = useState<UserIdentity>();
  const queryClient = useQueryClient();
  const { data: userData } = useQuery({
    queryKey: [USER_IDENTITY_DATA_KEY],
    queryFn: getUserIdentity,
  });

  useEffect(() => {
    if (userData !== undefined) {
      setUserIdentity(userData);
    }
  }, [userData]);

  const handleCreateClick = async () => {
    try {
      const createdApiKey = await createApiKey();
      setApiKey(createdApiKey);
    } catch (error) {
      console.error("Error creating API key: ", error);
    }
  };

  const handleCopyClick = () => {
    if (apiKey !== "") {
      void copyToClipboard(apiKey);
    }
  };

  const changeOpenAiApiKey = async () => {
    try {
      setChangeOpenAiApiKeyRequestPending(true);

      await updateUserIdentity({
        username: userIdentity?.username ?? "",
        onboarded: userIdentity?.onboarded ?? false,
      });
      void queryClient.invalidateQueries({
        queryKey: [USER_IDENTITY_DATA_KEY],
      });

      toast.success("OpenAI API Key updated");
    } catch (error) {
      console.error(error);
    } finally {
      setChangeOpenAiApiKeyRequestPending(false);
    }
  };

  const removeOpenAiApiKey = async () => {
    try {
      setChangeOpenAiApiKeyRequestPending(true);
      await updateUserIdentity({
        username: userIdentity?.username ?? "",
        onboarded: userIdentity?.onboarded ?? false,
      });
      toast.success("OpenAI API Key removed");
      void queryClient.invalidateQueries({
        queryKey: [USER_IDENTITY_DATA_KEY],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setChangeOpenAiApiKeyRequestPending(false);
    }
  };

  return {
    handleCreateClick,
    apiKey,
    handleCopyClick,
    openAiApiKey,
    setOpenAiApiKey,
    changeOpenAiApiKey,
    changeOpenAiApiKeyRequestPending,
    userIdentity,
    removeOpenAiApiKey,
  };
};
