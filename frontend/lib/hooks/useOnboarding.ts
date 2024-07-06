import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { ONBOARDING_DATA_KEY } from "@/lib/api/onboarding/config";
import { useOnboardingApi } from "@/lib/api/onboarding/useOnboardingApi";
import { Onboarding } from "@/lib/types/Onboarding";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useOnboarding = () => {
  const { getOnboarding, updateOnboarding } = useOnboardingApi();
  const params = useParams();
  const queryClient = useQueryClient();

  const chatId = params.chatId as string | undefined;

  const { data } = useQuery({
    queryFn: getOnboarding,
    queryKey: [ONBOARDING_DATA_KEY],
  });

  const onboarding: Onboarding = data ?? {
    onboarding_a: false,
    onboarding_b1: false,
    onboarding_b2: false,
    onboarding_b3: false,
  };

  const isOnboarding = Object.values(onboarding).some((value) => value);

  const updateOnboardingHandler = async (
    newOnboardingStatus: Partial<Onboarding>
  ) => {
    await updateOnboarding(newOnboardingStatus);
    await queryClient.invalidateQueries({ queryKey: [ONBOARDING_DATA_KEY] });
  };

  const shouldDisplayWelcomeChat = onboarding.onboarding_a;

  const shouldDisplayOnboardingAInstructions =
    chatId === undefined && shouldDisplayWelcomeChat;

  return {
    onboarding,
    shouldDisplayOnboardingAInstructions,
    shouldDisplayWelcomeChat,
    updateOnboarding: updateOnboardingHandler,
    isOnboarding,
  };
};
